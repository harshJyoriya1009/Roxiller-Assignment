import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { CreateUserRequest, User, UserDetails, UserRole } from '../../types';
import { validators, getErrorMessage } from '../../utils/validators';
import Modal from '../common/Modal';
import SortableHeader from '../common/SortableHeader';

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'Normal User' },
  { value: 'store_owner', label: 'Store Owner' },
];

const defaultCreateUserForm: CreateUserRequest = {
  name: '',
  email: '',
  password: '',
  address: '',
  role: 'user',
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'createdAt', sortOrder: 'DESC' as 'ASC' | 'DESC' });
  const [showCreate, setShowCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [form, setForm] = useState<CreateUserRequest>(defaultCreateUserForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data);
    } catch (err) {
      setLoadError(getErrorMessage(err));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = [...users]
    .filter((user) => {
      const matchesName = user.name.toLowerCase().includes(filters.name.trim().toLowerCase());
      const matchesEmail = user.email.toLowerCase().includes(filters.email.trim().toLowerCase());
      const matchesAddress = (user.address || '').toLowerCase().includes(filters.address.trim().toLowerCase());
      const matchesRole = !filters.role || user.role === filters.role;

      return matchesName && matchesEmail && matchesAddress && matchesRole;
    })
    .sort((a, b) => {
      const direction = sort.sortOrder === 'ASC' ? 1 : -1;
      if (sort.sortBy === 'name') return a.name.localeCompare(b.name) * direction;
      if (sort.sortBy === 'email') return a.email.localeCompare(b.email) * direction;
      if (sort.sortBy === 'address') return (a.address || '').localeCompare(b.address || '') * direction;
      if (sort.sortBy === 'role') return a.role.localeCompare(b.role) * direction;
      if (sort.sortBy === 'createdAt') return ((a.createdAt || '').localeCompare(b.createdAt || '')) * direction;
      return 0;
    });

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
    const passwordError = validators.password(form.password);
    const addressError = validators.address(form.address);

    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (addressError) nextErrors.address = addressError;

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setCreateLoading(true);
    setApiError('');
    try {
      await adminApi.createUser(form);
      setShowCreate(false);
      setForm(defaultCreateUserForm);
      loadUsers();
    } catch (err) { setApiError(getErrorMessage(err)); }
    finally { setCreateLoading(false); }
  };

  const viewDetail = async (id: string) => {
    try {
      const res = await adminApi.getUserDetails(id);
      setSelectedUser(res.data);
    } catch (err) { console.error(err); }
  };

  const roleBadge = (role: string) => (
    <span className={`badge badge-${role}`}>
      {role === 'admin' ? 'Admin' : role === 'store_owner' ? 'Store Owner' : 'User'}
    </span>
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Users</h1>
          <p>Manage platform users and their roles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add User
        </button>
      </div>

      {loadError && <div className="alert alert-error">{loadError}</div>}

      <div className="filter-bar">
        <div className="search-wrapper">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
            <input className="search-input" placeholder="Search by name..." value={filters.name}
            onChange={(e) => setFilters((current) => ({ ...current, name: e.target.value }))} />
        </div>
        <input className="search-input" style={{ flex: 1, minWidth: 160, paddingLeft: 14 }} placeholder="Filter by email..."
          value={filters.email} onChange={(e) => setFilters((current) => ({ ...current, email: e.target.value }))} />
        <input className="search-input" style={{ flex: 1, minWidth: 160, paddingLeft: 14 }} placeholder="Filter by address..."
          value={filters.address} onChange={(e) => setFilters((current) => ({ ...current, address: e.target.value }))} />
        <select className="filter-select" value={filters.role} onChange={(e) => setFilters((current) => ({ ...current, role: e.target.value }))}>
          {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              </svg>
              <h3>No users found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <SortableHeader label="Name" field="name" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <SortableHeader label="Email" field="email" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <SortableHeader label="Address" field="address" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <SortableHeader label="Role" field="role" sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={handleSort} />
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 500 }}>{user.name}</td>
                    <td style={{ color: 'var(--text2)' }}>{user.email}</td>
                    <td style={{ color: 'var(--text2)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.address || '—'}</td>
                    <td>{roleBadge(user.role)}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => viewDetail(user.id)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showCreate && (
        <Modal title="Add New User" onClose={() => { setShowCreate(false); setApiError(''); setFormErrors({}); }}>
          {apiError && <div className="alert alert-error">{apiError}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Full Name <span style={{ color: 'var(--text3)', fontSize: 11 }}>(2–60 chars)</span></label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={formErrors.name ? 'error' : ''} />
              {formErrors.name && <div className="form-error">{formErrors.name}</div>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={formErrors.email ? 'error' : ''} />
              {formErrors.email && <div className="form-error">{formErrors.email}</div>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={formErrors.password ? 'error' : ''} />
              {formErrors.password && <div className="form-error">{formErrors.password}</div>}
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={formErrors.address ? 'error' : ''} />
              {formErrors.address && <div className="form-error">{formErrors.address}</div>}
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}>
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={createLoading}>
                {createLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selectedUser && (
        <Modal title="User Details" onClose={() => setSelectedUser(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['Name', selectedUser.name],
              ['Email', selectedUser.email],
              ['Address', selectedUser.address || '—'],
              ['Role', selectedUser.role],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 12 }}>
                <span style={{ width: 80, color: 'var(--text3)', fontSize: 13, flexShrink: 0 }}>{label}</span>
                <span style={{ fontWeight: 500 }}>
                  {label === 'Role' ? roleBadge(value as string) : value}
                </span>
              </div>
            ))}
            {selectedUser.store && (
              <div style={{ marginTop: 8, padding: 12, background: 'var(--bg3)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>STORE INFORMATION</div>
                <div style={{ fontWeight: 500 }}>{selectedUser.store.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>
                  Average Rating: <strong style={{ color: 'var(--warning)' }}>{selectedUser.store.averageRating} ★</strong> ({selectedUser.store.totalRatings} ratings)
                </div>
              </div>
            )}
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsers;
