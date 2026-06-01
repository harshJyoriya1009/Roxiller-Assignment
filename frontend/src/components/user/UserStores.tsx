import React, { useCallback, useEffect, useState } from 'react';
import { storesApi, ratingsApi } from '../../api/stores.api';
import { Store } from '../../types';
import { getErrorMessage } from '../../utils/validators';
import StarRating from '../common/StarRating';
import Modal from '../common/Modal';

const UserStores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState({ name: '', address: '' });
  const [ratingModal, setRatingModal] = useState<{ store: Store; mode: 'create' | 'update' } | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState('');

  const loadStores = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await storesApi.getAll(search);
      setStores(res.data);
    } catch (err) {
      setLoadError(getErrorMessage(err));
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const openRatingModal = (store: Store, mode: 'create' | 'update') => {
    setRatingValue(mode === 'update' && store.userRating ? store.userRating : 0);
    setRatingModal({ store, mode });
    setRatingError('');
  };

  const submitRating = async () => {
    if (!ratingModal || ratingValue === 0) {
      setRatingError('Please select a rating');
      return;
    }
    setRatingLoading(true);
    setRatingError('');
    try {
      if (ratingModal.mode === 'create') {
        await ratingsApi.create({ storeId: ratingModal.store.id, value: ratingValue });
      } else if (ratingModal.store.userRatingId) {
        await ratingsApi.update(ratingModal.store.userRatingId, { value: ratingValue });
      }
      setRatingModal(null);
      loadStores();
    } catch (err) { setRatingError(getErrorMessage(err)); }
    finally { setRatingLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Browse Stores</h1>
        <p>Discover and rate stores on our platform</p>
      </div>

      {loadError && <div className="alert alert-error">{loadError}</div>}

      <div className="filter-bar">
          <div className="search-wrapper">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input className="search-input" placeholder="Search by store name..." value={search.name}
            onChange={(e) => setSearch((current) => ({ ...current, name: e.target.value }))} />
        </div>
        <input className="search-input" style={{ flex: 1, minWidth: 200, paddingLeft: 14 }} placeholder="Search by address..."
          value={search.address} onChange={(e) => setSearch((current) => ({ ...current, address: e.target.value }))} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text2)' }}>Loading stores...</div>
      ) : stores.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <h3>No stores found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="store-grid">
          {stores.map((store) => (
            <div className="store-card" key={store.id}>
              <div className="store-card-name">{store.name}</div>
              <div className="store-card-addr">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, flexShrink: 0, display: 'inline' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {store.address || 'No address provided'}
              </div>

              <div className="rating-display">
                <StarRating value={Math.round(store.averageRating)} readonly size={16} />
                <span style={{ fontWeight: 600 }}>{store.averageRating.toFixed(1)}</span>
                <span className="rating-count">({store.totalRatings} {store.totalRatings === 1 ? 'rating' : 'ratings'})</span>
              </div>

              <div className="user-rating-section">
                <div className="user-rating-label">
                  {store.userRating ? `Your rating: ${store.userRating} ★` : 'You haven\'t rated this store yet'}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {!store.userRating ? (
                    <button className="btn btn-primary btn-sm" onClick={() => openRatingModal(store, 'create')}>
                      Rate this store
                    </button>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => openRatingModal(store, 'update')}>
                      Update rating
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {ratingModal && (
        <Modal
          title={ratingModal.mode === 'create' ? `Rate ${ratingModal.store.name}` : `Update your rating for ${ratingModal.store.name}`}
          onClose={() => setRatingModal(null)}
        >
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <p style={{ color: 'var(--text2)', marginBottom: 20 }}>How would you rate this store?</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <StarRating value={ratingValue} onChange={setRatingValue} size={32} />
            </div>
            {ratingValue > 0 && (
              <div style={{ color: 'var(--warning)', fontSize: 14, marginBottom: 8 }}>
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][ratingValue]} ({ratingValue}/5)
              </div>
            )}
            {ratingError && <div className="alert alert-error" style={{ textAlign: 'left', marginTop: 12 }}>{ratingError}</div>}
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setRatingModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitRating} disabled={ratingLoading || ratingValue === 0}>
              {ratingLoading ? 'Submitting...' : ratingModal.mode === 'create' ? 'Submit Rating' : 'Update Rating'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserStores;
