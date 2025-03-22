import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserAuthorContextObj = createContext();

function UserAuthorContext({ children }) {
  let [currentUser, setCurrentUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImageUrl: "",
    role: "",
  });

  useEffect(() => {
    const userInStorage = localStorage.getItem('currentuser');
    if (userInStorage) {
      const user = JSON.parse(userInStorage);
      // Check if user is blocked when restoring from storage
      if (user.email && user.role) {
        const checkUserStatus = async () => {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/${user.role === 'author' ? 'author' : 'user'}-api/${user.role}`,
              user
            );
            if (res.data.error) {
              // If user is blocked, clear the storage and reset state
              localStorage.removeItem('currentuser');
              localStorage.removeItem('userRole');
              setCurrentUser({
                firstName: "",
                lastName: "",
                email: "",
                profileImageUrl: "",
                role: "",
              });
            } else {
              setCurrentUser(user);
            }
          } catch (error) {
            if (error.response?.data?.error?.includes('blocked')) {
              localStorage.removeItem('currentuser');
              localStorage.removeItem('userRole');
              setCurrentUser({
                firstName: "",
                lastName: "",
                email: "",
                profileImageUrl: "",
                role: "",
              });
            }
          }
        };
        checkUserStatus();
      } else {
        setCurrentUser(user);
      }
    }
  }, []);

  return (
    <UserAuthorContextObj.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserAuthorContextObj.Provider>
  );
}

export default UserAuthorContext;
