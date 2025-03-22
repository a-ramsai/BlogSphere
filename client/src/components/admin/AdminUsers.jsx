import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth(); // <-- Use useAuth for getToken
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/signin');
      return;
    }
    fetchUsers();
  }, [isSignedIn, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin-api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.payload);
      setMessage('');
    } catch (err) {
      setMessage('Failed to fetch users. ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserBlock = async (email) => {
    try {
      setMessage('');
      const token = await getToken();
      const encodedEmail = encodeURIComponent(email);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin-api/users/${encodedEmail}/toggle-block`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update local state using a functional update
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.email === email ? { ...u, isBlocked: response.data.payload.isBlocked } : u
        )
      );

      setMessage(`Successfully ${response.data.payload.isBlocked ? 'blocked' : 'unblocked'} user`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update user status. ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Users and Authors</h2>
      {message && (
        <div className={`alert ${message.includes('Successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
          {message}
        </div>
      )}
      
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No users found</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.email}>
                  <td>{`${u.firstName} ${u.lastName || ''}`}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${
                      u.role === 'admin' ? 'bg-primary' : 
                      u.role === 'author' ? 'bg-info' : 'bg-secondary'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.isBlocked ? 'bg-danger' : 'bg-success'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${u.isBlocked ? 'btn-success' : 'btn-danger'}`}
                      onClick={() => toggleUserBlock(u.email)}
                    >
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
