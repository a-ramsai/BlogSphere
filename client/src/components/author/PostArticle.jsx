import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserAuthorContextObj } from "../../context/UserAuthorContext";
import { useAuth } from '@clerk/clerk-react';

export default function PostArticle() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserAuthorContextObj);
  const { getToken } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiError, setApiError] = useState("");

  async function postArticle(articleObj) {
    if (!currentUser || !currentUser.email) {
      setApiError("User not authenticated.");
      return;
    }

    articleObj.authorData = {
      nameOfAuthor: currentUser.firstName,
      email: currentUser.email,
      profileImageUrl: currentUser.profileImageUrl
    };

    articleObj.articleId = Date.now();
    let currentDate = new Date();
    articleObj.dateOfCreation = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()} ${currentDate.toLocaleTimeString("en-US", { hour12: true })}`;
    articleObj.dateOfModification = articleObj.dateOfCreation;
    articleObj.comments = [];
    articleObj.isArticleActive = true;

    try {
      let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/author-api/article`, articleObj);
      if (res.status === 201) {
        navigate(`/author-profile/${currentUser.email}/articles`);
      } else {
        setApiError("Error posting article!");
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError("Failed to post article. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(postArticle)}>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient bg-dark text-light">
        <div className="card bg-black text-light w-50 p-5 rounded-4 shadow-lg border border-warning">
          <h2 className="text-center text-warning mb-4 fw-bold">📝 Write an Article</h2>

          {apiError && <p className="text-danger text-center">{apiError}</p>}

          <div className="mb-3">
            <label htmlFor="title" className="form-label fw-semibold">Title</label>
            <input
              type="text"
              className="form-control bg-dark text-light border border-warning rounded-pill px-3 py-2 shadow-sm"
              placeholder="Enter an engaging title..."
              id="title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-danger">{errors.title.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label fw-semibold">Select a category</label>
            <select 
              className="form-select bg-dark text-light border border-warning rounded-pill px-3 py-2 shadow-sm" 
              id="category"
              {...register("category", { required: "Category is required" })}
            >
              <option value="">-- Choose Category --</option>
              <option value="Machine Learning">🤖 ML</option>
              <option value="Web Development">💻 Web Dev</option>
              <option value="Software Development">🛠️ Software Dev</option>
            </select>
            {errors.category && <p className="text-danger">{errors.category.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="content" className="form-label fw-semibold">Content</label>
            <textarea
              {...register("content", { required: "Content is required" })}
              className="form-control bg-dark text-light border border-warning rounded-3 px-3 py-2 shadow-sm"
              placeholder="Share your thoughts..."
              rows="5"
            ></textarea>
            {errors.content && <p className="text-danger">{errors.content.message}</p>}
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-bold text-dark rounded-pill shadow-lg py-2">🚀 Post</button>
        </div>
      </div>
    </form>
  );
}
