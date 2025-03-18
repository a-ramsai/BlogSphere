import React, { createContext, useState, useEffect } from 'react';

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
      setCurrentUser(JSON.parse(userInStorage))
    }
  }, [])

  return (
    <UserAuthorContextObj.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserAuthorContextObj.Provider>
  );
}

export default UserAuthorContext;
