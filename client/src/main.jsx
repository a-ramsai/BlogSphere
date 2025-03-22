import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, Navigate,RouterProvider} from 'react-router-dom'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import RootLayout from './components/RootLayout.jsx'
import Home from './components/common/Home.jsx'
import Signin from './components/common/Signin.jsx'
import Signup from './components/common/Signup.jsx'
import UserProfile from './components/user/UserProfile.jsx'
import Articles from './components/common/Articles.jsx'
import ArticleByID from './components/common/ArticleByID.jsx'
import AuthorProfile from './components/author/AuthorProfile.jsx'
import PostArticle from './components/author/PostArticle.jsx'
import UserAuthorContext from './context/UserAuthorContext.jsx';
import AdminProfile from './components/admin/AdminProfile.jsx'
import AdminUsers from './components/admin/AdminUsers.jsx'
import BlockedUser from './components/common/BlockedUser.jsx'

const browserRouteObj= createBrowserRouter([
  {
    path:"/",
    element:<RootLayout/>,
    children:[
      {
        path:"",
        element:<Home/>,
      },
      {
        path:"signin",
        element:<Signin/>
      },
      {
        path:"signup",
        element:<Signup/>
      },
      {
        path:"blocked",
        element:<BlockedUser/>
      },
      {
        path:"user-profile/:email",
        element:<UserProfile/>,
        children:[
          {
            path:"articles",
            element:<Articles/>
          },
          {
            path:":articleId",
            element:<ArticleByID/>
          },
          {
            path:"",
            element:<Navigate to ="articles"/>
          }
        ]
      },
      {
        path:"author-profile/:email",
        element:<AuthorProfile/>,
        children:[
          {
            path:"articles",
            element:<Articles/>
          },
          {
            path:":articleId",
            element:<ArticleByID/>
          },
          {
            path:"article",
            element:<PostArticle/>
          },
          {
            path:"",
            element:<Navigate to ="articles"/>
          }
        ]
      },
      {
        path:"admin-profile",
        element:<AdminProfile/>,
        children:[
          {
            path:"users",
            element:<AdminUsers/>
          },
          {
            path:"",
            element:<Navigate to="users"/>
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAuthorContext>
      <RouterProvider router={browserRouteObj}/>
    </UserAuthorContext>
  </StrictMode>
)
