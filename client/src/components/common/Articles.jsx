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
  const { currentUser } = useContext(UserAuthorContextObj);

  async function getArticles() {
    const token = await getToken();

    try {
      // Use different endpoints based on user role
      const endpoint = currentUser.role === 'author' 
        ? "http://localhost:3000/author-api/articles"
        : "http://localhost:3000/user-api/articles";

      let res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.message === "articles") {
        setArticles(res.data.payload);
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
  }, [currentUser.role]); // Re-fetch when role changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <div className="row">
        {articles.map((article) => (
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
        ))}
      </div>
    </div>
  );
}

export default Articles;
