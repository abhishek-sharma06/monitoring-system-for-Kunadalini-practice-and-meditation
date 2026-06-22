// Import React hooks, API client, and icons.
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Trash2, Shield, User, Search, RefreshCw, X, AlertTriangle } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState(''); // '', 'true', 'false'
  const [error, setError] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Role toggle modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleUserId, setRoleUserId] = useState(null);
  const [togglingRole, setTogglingRole] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [verifiedFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/users?search=${search}&verified=${verifiedFilter}`);
      if (res.data.success) {
        setUsers(res.data.data.users);
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch user list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const openDeleteDialog = (id) => {
    setSelectedUserId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteDialog = () => {
    setSelectedUserId(null);
    setShowDeleteModal(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/api/admin/users/${selectedUserId}`);
      if (res.data.success) {
        closeDeleteDialog();
        fetchUsers();
      }
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to delete user.');
      closeDeleteDialog();
    } finally {
      setDeleting(false);
    }
  };

  const openRoleDialog = (id) => {
    setRoleUserId(id);
    setShowRoleModal(true);
  };

  const closeRoleDialog = () => {
    setRoleUserId(null);
    setShowRoleModal(false);
  };

  const handleToggleRole = async () => {
    if (!roleUserId) return;
    setTogglingRole(true);
    try {
      const res = await api.patch(`/api/admin/users/${roleUserId}/role`);
      if (res.data.success) {
        closeRoleDialog();
        fetchUsers();
      }
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to modify role.');
      closeRoleDialog();
    } finally {
      setTogglingRole(false);
    }
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner text="Retrieving platform accounts database..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">Manage Users</h1>
        <p className="text-sm text-text-secondary">Search, verify email statuses, toggle roles, and delete accounts.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-border p-4 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:max-w-md">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-accent-primary bg-background-primary/40"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-accent-primary text-white text-sm font-bold rounded-xl hover:bg-opacity-95 transition"
          >
            Search
          </button>
        </form>

        <div className="flex gap-3 w-full sm:w-auto">
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-xl text-sm focus:outline-none bg-background-primary/40"
          >
            <option value="">All Verification States</option>
            <option value="true">Verified Email</option>
            <option value="false">Unverified Email</option>
          </select>
          <button
            onClick={fetchUsers}
            className="p-2 border border-border rounded-xl text-text-secondary hover:bg-background-secondary/30 transition"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm">
        {users.length === 0 ? (
          <div className="text-center py-12 text-sm text-text-secondary italic">No users found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-background-primary/50 text-left">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">User Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Verification</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Logged Practices</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Avg Score</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Joined Date</th>
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
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.is_verified ? 'bg-green-50 text-success' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {u.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary font-bold">
                      {u.total_sessions} logs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-primary font-extrabold">
                      {Number(u.avg_score).toFixed(1)}/10
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                      <button
                        onClick={() => openRoleDialog(u.id)}
                        className="text-accent-primary hover:text-purple-800 p-1.5 rounded-lg hover:bg-purple-50 transition"
                        title="Toggle Admin Privilege"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(u.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-border rounded-3xl p-6 max-w-sm w-full shadow-lg relative flex flex-col gap-4">
            <button onClick={closeDeleteDialog} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Delete user account?</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                This action is irreversible. The account, progress trends, goals, and all historical kriya sessions will be permanently erased.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={closeDeleteDialog} className="flex-1 py-2.5 bg-background-secondary text-text-primary font-bold rounded-xl text-sm">
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 transition"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Toggle Confirmation Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-border rounded-3xl p-6 max-w-sm w-full shadow-lg relative flex flex-col gap-4">
            <button onClick={closeRoleDialog} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-purple-50 text-accent-primary rounded-full flex items-center justify-center mb-2">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Modify Account Role?</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Are you sure you want to alter the administrator authorization permissions for this user account?
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={closeRoleDialog} className="flex-1 py-2.5 bg-background-secondary text-text-primary font-bold rounded-xl text-sm">
                Cancel
              </button>
              <button
                onClick={handleToggleRole}
                disabled={togglingRole}
                className="flex-1 py-2.5 bg-accent-primary text-white font-bold rounded-xl text-sm hover:bg-opacity-90 transition"
              >
                {togglingRole ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export UserList.
export default UserList;
