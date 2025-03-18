import { SignedIn, SignIn, useClerk, useUser } from '@clerk/clerk-react'
import {useContext,useEffect} from 'react'
import { UserAuthorContextObj } from '../../context/userAuthorContext';
import {Link, useNavigate} from 'react-router-dom'
function Header() {

    const {signOut}=useClerk();
    const {isLoaded,isSignedIn,user} = useUser();
    const {currentUser,setCurrentUser}= useContext(UserAuthorContextObj)
    const Navigate =useNavigate();

    async function handleSignout() {
        await signOut();
        setCurrentUser(null);
        Navigate('/');
        
    }
  return (
    <div>
  <div>
  <nav className="navbar navbar-expand-lg navbar-light bg-dark d-flex justify-content-between">
    <a className="navbar-brand text-white" href="#">LOGO</a>
    <div>
      <ul className="navbar-nav mr-auto ">
        {
            !isSignedIn ?
            <>
                <li className="nav-item">
          <a className="nav-link fw-bold text-white" href="http://localhost:5173">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white fw-bold" href="signin">Signin</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white fw-bold" href="signup">Signup</a>
        </li>
            </>
            :
            <div className='d-flex'>
                <div>
                <div className="d-flex align-items-center p-2 stylish-profile">
  <img src={user.imageUrl} className="profile-img rounded-circle shadow-lg"/>
  <span className="fw-bold username-text">{user.fullName}</span>
            </div>

                </div>
                <button className="btn btn-danger signout-btn  " onClick={handleSignout}><h6 className='c'>Signout</h6></button>
            </div>
        }
            
        
      </ul>
    </div>
  </nav>
</div>

    </div>
  )
}

export default Header