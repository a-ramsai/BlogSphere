import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function UserProfile() {
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
  )
}

export default UserProfile