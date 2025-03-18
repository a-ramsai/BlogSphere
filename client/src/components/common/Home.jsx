import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthorContextObj } from "../../context/userAuthorContext";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

function Home() {
  const { currentUser, setCurrentUser } = useContext(UserAuthorContextObj);
  const { isSignedIn, isLoaded, user } = useUser();
  const [error, setError] = useState("");
  const [hasSelectedRole, setHasSelectedRole] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      setCurrentUser((prevUser) => ({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses?.[0]?.emailAddress || "",
        profileImageUrl: user.imageUrl || "",
        role: "",  // Reset role on initial load
      }));
    }
  }, [isLoaded, user, setCurrentUser]);

  async function onSelectRole(e) {
    setError("");
    const selectedRole = e.target.value;

    const updatedUser = { ...currentUser, role: selectedRole };
    setCurrentUser(updatedUser);
    localStorage.setItem("userRole", selectedRole); // Save role persistently
    setHasSelectedRole(true);

    try {
      let res = null;
      if (selectedRole === "admin") {
        // For admin, we'll navigate directly without creating a user record
        navigate('/admin-profile');
        return;
      } else if (selectedRole === "author") {
        res = await axios.post("http://localhost:3000/author-api/author", updatedUser);
      } else if (selectedRole === "user") {
        res = await axios.post("http://localhost:3000/user-api/user", updatedUser);
      }

      if (res) {
        const { message, payload, error } = res.data;
        if (error) {
          setError(error);
          setHasSelectedRole(false);
          return;
        }
        if (message === selectedRole) {
          setCurrentUser((prevUser) => ({ ...prevUser, ...payload }));
        } else {
          setError("Invalid role selection response");
          setHasSelectedRole(false);
        }
      }
    } catch (error) {
      console.error("Error during role selection:", error.response?.data || error.message);
      setError(error.response?.data?.error || error.response?.data?.message || "An error occurred during role selection");
      setHasSelectedRole(false);
    }
  }

  useEffect(() => {
    if (!currentUser || !hasSelectedRole || error) return;

    if (currentUser.role === "user") {
      navigate(`/user-profile/${currentUser.email}`, { replace: true });
    } else if (currentUser.role === "author") {
      navigate(`/author-profile/${currentUser.email}`, { replace: true });
    }
  }, [currentUser, hasSelectedRole, error, navigate]);

  return (
    <div className="container">
      {isSignedIn === false && (
        <div className="text-center mt-5">
          <h2 className="mb-4">Welcome to the Blog App</h2>
          <p className="lead">
            Sign in to read articles, share your thoughts, or become an author and start writing!
          </p>
        </div>
      )}

      {isSignedIn === true && (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="card bg-dark text-light p-5 rounded-4 shadow-lg border border-warning">
            <div className="text-center mb-4">
              <img 
                src={user?.imageUrl} 
                alt="Profile" 
                className="rounded-circle mb-3" 
                style={{width: "100px", height: "100px", objectFit: "cover"}}
              />
              <h3 className="text-warning mb-4">{user?.fullName || "Guest"}</h3>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
            </div>

            <div className="text-center">
              <h4 className="mb-4">Choose your role</h4>
              <div className="d-flex flex-column gap-3">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="role"
                    value="user"
                    id="userRole"
                    onChange={onSelectRole}
                  />
                  <label className="form-check-label" htmlFor="userRole">
                    User - Read and comment on articles
                  </label>
                </div>

                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="role"
                    value="author"
                    id="authorRole"
                    onChange={onSelectRole}
                  />
                  <label className="form-check-label" htmlFor="authorRole">
                    Author - Write and publish articles
                  </label>
                </div>

                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="role"
                    value="admin"
                    id="adminRole"
                    onChange={onSelectRole}
                  />
                  <label className="form-check-label" htmlFor="adminRole">
                    Admin - Manage users and content
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
