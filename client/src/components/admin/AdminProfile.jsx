import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { useEffect } from 'react';

function AdminProfile() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/signin');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="admin-profile container py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">Admin Dashboard</h1>
          <ul className="nav nav-pills justify-content-center mb-4">
            <li className="nav-item">
              <NavLink to="users" className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }>
                Manage Users & Authors
              </NavLink>
            </li>
          </ul>
          <div className="mt-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile; 