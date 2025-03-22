import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthorContextObj } from "../../context/userAuthorContext";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/home.css";
import "../../styles/roleSelection.css";

function Home() {
  const { currentUser, setCurrentUser } = useContext(UserAuthorContextObj);
  const { isSignedIn, isLoaded, user } = useUser();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      setCurrentUser((prevUser) => ({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses?.[0]?.emailAddress || "",
        profileImageUrl: user.imageUrl || "",
        role: "",
      }));
    }
  }, [isLoaded, user, setCurrentUser]);

  async function onSelectRole(e) {
    setError("");
    const selectedRole = e.target.value;

    const updatedUser = { ...currentUser, role: selectedRole };
    setCurrentUser(updatedUser);
    localStorage.setItem("userRole", selectedRole);

    try {
      let res = null;
      if (selectedRole === "admin") {
        navigate('/admin-profile');
        return;
      } else if (selectedRole === "author") {
        res = await axios.post("${import.meta.env.VITE_BACKEND_URL}/author-api/author", updatedUser);
      } else if (selectedRole === "user") {
        res = await axios.post("${import.meta.env.VITE_BACKEND_URL}/user-api/user", updatedUser);
      }

      if (res) {
        const { message, payload, error } = res.data;
        if (error) {
          if (error.includes('blocked')) {
            setCurrentUser(prev => ({ ...prev, role: "" }));
            localStorage.removeItem("userRole");
            navigate('/blocked');
            return;
          }
          setError(error);
          setCurrentUser(prev => ({ ...prev, role: "" }));
          localStorage.removeItem("userRole");
          return;
        }
        if (message === selectedRole) {
          setCurrentUser((prevUser) => ({ ...prevUser, ...payload }));
          if (selectedRole === "user") {
            navigate(`/user-profile/${updatedUser.email}`);
          } else if (selectedRole === "author") {
            navigate(`/author-profile/${updatedUser.email}`);
          }
        } else if (message === "Account blocked") {
          setCurrentUser(prev => ({ ...prev, role: "" }));
          localStorage.removeItem("userRole");
          navigate('/blocked');
          return;
        } else {
          setError("Invalid role selection response");
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "An error occurred during role selection";
      if (errorMessage.includes('blocked')) {
        setCurrentUser(prev => ({ ...prev, role: "" }));
        localStorage.removeItem("userRole");
        navigate('/blocked');
        return;
      }
      setError(errorMessage);
      setCurrentUser(prev => ({ ...prev, role: "" }));
      localStorage.removeItem("userRole");
    }
  }

  return (
    <div className="container">
      {!isSignedIn ? (
        <>
          <section className="hero">
            <div className="hero-content">
              <h1>Welcome to BlogSphere</h1>
              <p>Read. Write. Inspire. Join a community of passionate readers and writers.</p>
              <button className="cta-button" onClick={() => navigate("/signin")}>Get Started</button>
            </div>
          </section>

          {/* Features Section */}
          <section className="features">
            <h2>Why Choose BlogSphere?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h3>📝 Write & Share</h3>
                <p>Express your thoughts and publish your ideas effortlessly.</p>
              </div>
              <div className="feature-item">
                <h3>📚 Explore Articles</h3>
                <p>Discover stories from talented writers worldwide.</p>
              </div>
              <div className="feature-item">
                <h3>💬 Connect & Engage</h3>
                <p>Join conversations and interact with writers.</p>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="testimonials">
            <h2>What Our Users Say</h2>
            <div className="testimonial">
              <p>"BlogSphere has transformed the way I share my ideas with the world!"</p>
              <p>- Ramesh, Author</p>
            </div>
            <div className="testimonial">
              <p>"A fantastic platform for readers and writers alike. Highly recommend!"</p>
              <p>- Prakesh, Reader</p>
            </div>
          </section>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="role-card">
            <div className="role-card-body">
              <div className="profile-section">
                <img 
                  src={user?.imageUrl} 
                  alt="Profile" 
                  className="profile-image"
                />
                <h3 className="user-name">{user?.fullName || "Guest"}</h3>
                {error && (
                  <div className="error-alert">
                    {error}
                  </div>
                )}
              </div>

              <h4 className="role-heading">Select Your Role</h4>
              <div className="role-options">
                <div className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    id="userRole"
                    onChange={onSelectRole}
                    disabled={!!error && error.includes("blocked")}
                  />
                  <label className="role-label" htmlFor="userRole">
                    User
                  </label>
                </div>

                <div className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="author"
                    id="authorRole"
                    onChange={onSelectRole}
                    disabled={!!error && error.includes("blocked")}
                  />
                  <label className="role-label" htmlFor="authorRole">
                    Author
                  </label>
                </div>

                <div className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    id="adminRole"
                    onChange={onSelectRole}
                  />
                  <label className="role-label" htmlFor="adminRole">
                    Admin
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