import React, { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { Store } from '../../types';
import { validators, getErrorMessage } from '../../utils/validators';
import Modal from '../common/Modal';
import SortableHeader from '../common/SortableHeader';
import StarRating from '../common/StarRating';

const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'ASC' as 'ASC' | 'DESC' });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const loadStores = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await adminApi.getStores({ ...filters, ...sort });
      setStores(res.data);
    } catch (err) {
      setLoadError(getErrorMessage(err));
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const handleSort = (field: string) => {
    setSort((prev) => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    const nameError = validators.name(form.name);
    const emailError = validators.email(form.email);
    const addressError = validators.address(form.address);

    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (addressError) nextErrors.address = addressError;

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreate = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateForm()) return;
    setCreateLoading(true);
    setApiError('');
    try {
      await adminApi.createStore(form);
      setShowCreate(false);
      setForm({ name: '', email: '', address: '', ownerId: '' });
      loadStores();
    } catch (err) { setApiError(getErrorMessage(err)); }
    finally { setCreateLoading(false); }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Stores</h1>
          <p>Manage registered stores on the platform</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Store
        </button>
      </div>

      {loadError && <div className="alert alert-error">{loadError}</div>}

      <div className="filter-bar">
        <div className="search-wrapper">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input className="search-input" placeholder="Search by store name..." value={filters.name}
            onChange={(e) => setFilters((current) => ({ ...current, name: e.target.value }))} />
        </div>
        <input className="search-input" style={{ flex: 1, minWidth: 200, paddingLeft: 14 }} placeholder="Filter by address..."
          value={filters.address} onChange={(e) => setFilters((current) => ({ ...current, address: e.target.value }))} />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Loading stores...</div>
          ) : stores.length === 0 ? (
            <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <h3>No stores found</h3>
              <p>Add your first store using the button above</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <SortableHeader label="Name" field="name" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <SortableHeader label="Email" field="email" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <SortableHeader label="Address" field="address" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td style={{ fontWeight: 500 }}>{store.name}</td>
                    <td style={{ color: 'var(--text2)' }}>{store.email}</td>
                    <td style={{ color: 'var(--text2)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{store.address || '—'}</td>
                    <td>
                      <div className="rating-display">
                        <StarRating value={Math.round(store.averageRating)} readonly size={14} />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{store.averageRating.toFixed(1)}</span>
                        <span className="rating-count">({store.totalRatings})</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showCreate && (
        <Modal title="Add New Store" onClose={() => { setShowCreate(false); setApiError(''); setFormErrors({}); }}>
          {apiError && <div className="alert alert-error">{apiError}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Store Name <span style={{ color: 'var(--text3)', fontSize: 11 }}>(2–60 chars)</span></label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={formErrors.name ? 'error' : ''} />
              {formErrors.name && <div className="form-error">{formErrors.name}</div>}
            </div>
            <div className="form-group">
              <label>Store Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={formErrors.email ? 'error' : ''} />
              {formErrors.email && <div className="form-error">{formErrors.email}</div>}
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={formErrors.address ? 'error' : ''} />
              {formErrors.address && <div className="form-error">{formErrors.address}</div>}
            </div>
            <div className="form-group">
              <label>Owner ID <span style={{ color: 'var(--text3)', fontSize: 11 }}>(optional – UUID of store_owner user)</span></label>
              <input type="text" value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })} placeholder="Leave blank if no owner yet" />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={createLoading}>
                {createLoading ? 'Creating...' : 'Create Store'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminStores;
