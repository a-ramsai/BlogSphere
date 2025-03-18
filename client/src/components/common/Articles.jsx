import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";
import { UserAuthorContextObj } from "../../context/userAuthorContext";
import { useContext } from 'react';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { currentUser, setCurrentUser } = useContext(UserAuthorContextObj);

  // Check if user is blocked
  const checkUserStatus = async () => {
    if (!currentUser?.role || !currentUser?.email) {
      navigate('/');
      return false;
    }

    try {
      const token = await getToken();
      const res = await axios.post(
        `http://localhost:3000/${currentUser.role}-api/${currentUser.role}`,
        currentUser,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (res.data.error) {
        // Clear user data from context and localStorage
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
        return false;
      }
      return true;
    } catch (err) {
      if (err.response?.data?.error?.includes('blocked')) {
        // Clear user data from context and localStorage
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
        setError("An error occurred. Please try again later.");
      }
      return false;
    }
  };

  async function getArticles() {
    try {
      // Check if user is blocked before fetching articles
      const isActive = await checkUserStatus();
      if (!isActive) {
        setLoading(false);
        return;
      }

      const token = await getToken();
      // Use different endpoints based on user role
      const endpoint = currentUser.role === 'author' 
        ? "http://localhost:3000/author-api/articles"
        : "http://localhost:3000/user-api/articles";

      let res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.message === "articles") {
        setArticles(res.data.payload);
        setError("");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch articles.");
    } finally {
      setLoading(false);
    }
  }
  
  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  useEffect(() => {
    getArticles();
  }, [currentUser?.role]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger text-center" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="row">
        {articles.length === 0 ? (
          <div className="col-12 text-center mt-5">
            <h3>No articles found</h3>
          </div>
        ) : (
          articles.map((article) => (
            <div key={article.articleId} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">{article.content.substring(0, 150)}...</p>
                  <p className="card-text">
                    <small className="text-muted">By {article.authorData.nameOfAuthor}</small>
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => gotoArticleById(article)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Articles;
