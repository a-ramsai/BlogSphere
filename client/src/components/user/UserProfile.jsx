import React, { useEffect, useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { UserAuthorContextObj } from '../../context/userAuthorContext';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

function UserProfile() {
  const { currentUser, setCurrentUser } = useContext(UserAuthorContextObj);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!currentUser?.email || currentUser?.role !== 'user') {
        navigate('/');
        return;
      }

      try {
        const token = await getToken();
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user-api/user`,
          currentUser,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (res.data.error) {
          // Clear user data
          setCurrentUser({
            firstName: "",
            lastName: "",
            email: "",
            profileImageUrl: "",
            role: "",
          });
          localStorage.removeItem('currentuser');
          localStorage.removeItem('userRole');
          navigate('/blocked');
        }
      } catch (err) {
        if (err.response?.data?.error?.includes('blocked')) {
          // Clear user data
          setCurrentUser({
            firstName: "",
            lastName: "",
            email: "",
            profileImageUrl: "",
            role: "",
          });
          localStorage.removeItem('currentuser');
          localStorage.removeItem('userRole');
          navigate('/blocked');
        } else {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [currentUser, navigate, getToken, setCurrentUser]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <ul className="d-flex justify-content-around list-unstyled fs-3">
        <li className="nav-item">
          <NavLink to="articles" className="nav-link">Articles</NavLink>
        </li>
      </ul>
      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  );
}

export default UserProfile;