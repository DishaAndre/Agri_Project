import React, { useState } from 'react';

const AdminPanel = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Farmer A', role: 'farmer', approved: false },
    { id: 2, name: 'Pharma B', role: 'pharma', approved: true },
  ]);

  const handleApprove = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, approved: true } : u));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">User Approvals</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Role</th>
              <th className="text-left">Status</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.approved ? 'Approved' : 'Pending'}</td>
                <td>
                  {!user.approved && (
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;