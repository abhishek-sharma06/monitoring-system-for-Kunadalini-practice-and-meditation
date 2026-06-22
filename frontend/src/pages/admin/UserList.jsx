import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Trash2, Shield, User, Search, RefreshCw, X, AlertTriangle, Plus, Edit2, CheckCircle, ChevronDown } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [actionUserId, setActionUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Create form
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'user', level: 'beginner', is_verified: false });
  // Edit form
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'user', level: 'beginner' });

  useEffect(() => { fetchUsers(); }, [verifiedFilter, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/admin/users?search=${search}&verified=${verifiedFilter}&role=${roleFilter}`);
      if (res.data.success) setUsers(res.data.data.users);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => { e.preventDefault(); fetchUsers(); };

  // ─── Create User ───────────────────────────────────────────────────────────
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.post('/api/admin/users', createForm);
      if (res.data.success) {
        setShowCreateModal(false);
        setCreateForm({ name: '', email: '', password: '', role: 'user', level: 'beginner', is_verified: false });
        fetchUsers();
      }
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to create user.');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Edit User ─────────────────────────────────────────────────────────────
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role, level: user.level || 'beginner' });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.put(`/api/admin/users/${editingUser.id}`, editForm);
      if (res.data.success) {
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers();
      }
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to update user.');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Toggle Verification ───────────────────────────────────────────────────
  const handleToggleVerify = async (userId) => {
    try {
      const res = await api.patch(`/api/admin/users/${userId}/verify`);
      if (res.data.success) fetchUsers();
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to toggle verification.');
    }
  };

  // ─── Toggle Role ───────────────────────────────────────────────────────────
  const handleToggleRole = async () => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/admin/users/${actionUserId}/role`);
      if (res.data.success) { setShowRoleModal(false); fetchUsers(); }
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to modify role.');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Delete User ───────────────────────────────────────────────────────────
  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      const res = await api.delete(`/api/admin/users/${actionUserId}`);
      if (res.data.success) { setShowDeleteModal(false); fetchUsers(); }
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to delete user.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && users.length === 0) return <LoadingSpinner text="Loading user data..." />;

  const inputClass = "w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-accent-primary bg-background-primary/50";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Manage Users</h1>
          <p className="text-sm text-text-secondary">Create, edit, verify, and manage all user accounts.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent-primary text-white text-sm font-bold rounded-2xl hover:bg-opacity-95 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100">{error}</div>
      )}

      {/* Filters */}
      <div className="bg-white border border-border p-4 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:max-w-md">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary"><Search className="w-4 h-4" /></span>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-accent-primary bg-background-primary/40"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-accent-primary text-white text-sm font-bold rounded-xl hover:bg-opacity-95 transition">Search</button>
        </form>
        <div className="flex gap-3">
          <select value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-xl text-sm focus:outline-none bg-background-primary/40">
            <option value="">All Verification</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-xl text-sm focus:outline-none bg-background-primary/40">
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
          <button onClick={fetchUsers} className="p-2 border border-border rounded-xl text-text-secondary hover:bg-background-secondary/30 transition" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm">
        {users.length === 0 ? (
          <div className="text-center py-12 text-sm text-text-secondary italic">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-background-primary/50 text-left">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Level</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Email Verified</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Disclaimer</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-background-secondary/10 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-text-primary">{u.name}</span>
                        <span className="text-xs text-text-secondary">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-accent-primary capitalize">
                        {u.level || 'beginner'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleVerify(u.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition hover:opacity-80 ${
                          u.is_verified ? 'bg-green-50 text-success' : 'bg-yellow-50 text-yellow-600'
                        }`}
                        title="Click to toggle verification"
                      >
                        {u.is_verified ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {u.is_verified ? 'Verified' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-semibold ${u.safety_disclaimer_accepted ? 'text-success' : 'text-yellow-600'}`}>
                        {u.safety_disclaimer_accepted ? 'Accepted' : 'Not yet'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEditModal(u)} className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition" title="Edit User">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setActionUserId(u.id); setShowRoleModal(true); }} className="text-accent-primary hover:text-purple-800 p-1.5 rounded-lg hover:bg-purple-50 transition" title="Toggle Role">
                          <Shield className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setActionUserId(u.id); setShowDeleteModal(true); }} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition" title="Delete User">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Create User Modal ─────────────────────────────────────────── */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)} title="Create New User">
          <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
            <input className={inputClass} type="text" placeholder="Full Name" required value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
            <input className={inputClass} type="email" placeholder="Email" required value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
            <input className={inputClass} type="password" placeholder="Password (min 8 chars, 1 uppercase, 1 number)" required value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
            <div className="flex gap-3">
              <select className={inputClass} value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <select className={inputClass} value={createForm.level} onChange={(e) => setCreateForm({ ...createForm, level: e.target.value })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={createForm.is_verified} onChange={(e) => setCreateForm({ ...createForm, is_verified: e.target.checked })} className="rounded" />
              Mark email as verified
            </label>
            <button type="submit" disabled={actionLoading} className="w-full py-2.5 bg-accent-primary text-white font-bold rounded-xl text-sm hover:bg-opacity-95 transition disabled:opacity-50">
              {actionLoading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </Modal>
      )}

      {/* ─── Edit User Modal ───────────────────────────────────────────── */}
      {showEditModal && editingUser && (
        <Modal onClose={() => { setShowEditModal(false); setEditingUser(null); }} title="Edit User">
          <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
            <input className={inputClass} type="text" placeholder="Full Name" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <input className={inputClass} type="email" placeholder="Email" required value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            <div className="flex gap-3">
              <select className={inputClass} value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <select className={inputClass} value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <button type="submit" disabled={actionLoading} className="w-full py-2.5 bg-accent-primary text-white font-bold rounded-xl text-sm hover:bg-opacity-95 transition disabled:opacity-50">
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </Modal>
      )}

      {/* ─── Role Toggle Modal ─────────────────────────────────────────── */}
      {showRoleModal && (
        <Modal onClose={() => setShowRoleModal(false)} title="Change User Role">
          <p className="text-sm text-text-secondary mb-4">Are you sure you want to change this user's role?</p>
          <div className="flex gap-3">
            <button onClick={() => setShowRoleModal(false)} className="flex-1 py-2.5 bg-background-secondary text-text-primary font-bold rounded-xl text-sm">Cancel</button>
            <button onClick={handleToggleRole} disabled={actionLoading} className="flex-1 py-2.5 bg-accent-primary text-white font-bold rounded-xl text-sm hover:bg-opacity-90 transition disabled:opacity-50">
              {actionLoading ? 'Saving...' : 'Confirm'}
            </button>
          </div>
        </Modal>
      )}

      {/* ─── Delete Modal ──────────────────────────────────────────────── */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)} title="Delete User Account">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-sm text-text-secondary">This action is irreversible. The user account and all associated data will be permanently deleted.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 bg-background-secondary text-text-primary font-bold rounded-xl text-sm">Cancel</button>
            <button onClick={handleDeleteUser} disabled={actionLoading} className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 transition disabled:opacity-50">
              {actionLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Reusable modal wrapper
const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white border border-border rounded-3xl p-6 max-w-md w-full shadow-lg relative flex flex-col gap-4">
      <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"><X className="w-4 h-4" /></button>
      <h3 className="text-lg font-bold text-text-primary">{title}</h3>
      {children}
    </div>
  </div>
);

export default UserList;
