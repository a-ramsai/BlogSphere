import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";
import { UserAuthorContextObj } from "../../context/";
import { useContext } from 'react';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { currentUser, setCurrentUser } = useContext(UserAuthorContextObj);

  const checkUserStatus = async () => {
    if (!currentUser?.role || !currentUser?.email) {
      navigate('/');
      return false;
    }
    try {
      const token = await getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/${currentUser.role}-api/${currentUser.role}`,
        currentUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.error) {
        setCurrentUser({ firstName: "", lastName: "", email: "", profileImageUrl: "", role: "" });
        localStorage.removeItem('currentuser');
        localStorage.removeItem('userRole');
        navigate('/blocked');
        return false;
      }
      return true;
    } catch (err) {
      if (err.response?.data?.error?.includes('blocked')) {
        setCurrentUser({ firstName: "", lastName: "", email: "", profileImageUrl: "", role: "" });
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
      const isActive = await checkUserStatus();
      if (!isActive) {
        setLoading(false);
        return;
      }
      const token = await getToken();
      const endpoint = currentUser.role === 'author' 
        ? `${import.meta.env.VITE_BACKEND_URL}/author-api/articles`
        : `${import.meta.env.VITE_BACKEND_URL}/user-api/articles`;
      let res = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.message === "articles") {
        setArticles(res.data.payload);
        setError("");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
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
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {articles.length === 0 ? (
          <div className="col-12 text-center mt-5">
            <h3>No articles found</h3>
          </div>
        ) : (
          articles.map((article) => (
            <div key={article.articleId} className="col">
              <div className="card h-100 shadow-sm border-0">
                {article.imageUrl && (
                  <img src={article.imageUrl} className="card-img-top" alt={article.title} />
                )}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <img src={article.authorData.profileImageUrl} width='40px' className='rounded-circle me-2' alt="author" />
                    <small className='text-muted'>{article.authorData.nameOfAuthor}</small>
                  </div>
                  <h5 className="card-title fw-bold fs-3">{article.title}</h5>
                  <p className="card-text">{article.content.substring(0, 80)}...</p>
                  <button className="btn btn-primary mt-auto w-100" onClick={() => gotoArticleById(article)}>
                    Read More
                  </button>
                </div>
                <div className="card-footer">
                  <small className="text-body-secondary">Last updated on {article.dateOfModification}</small>
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
