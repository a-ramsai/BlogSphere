import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserAuthorContextObj } from "../../context/userAuthorContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdRestore } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import "bootstrap/dist/css/bootstrap.min.css";

function ArticleByID() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { currentUser } = useContext(UserAuthorContextObj);
  const [article, setArticle] = useState(location.state);
  const [commentStatus, setCommentStatus] = useState("");
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const enableEdit = () => setEditArticleStatus(true);

  const onSave = async (modifiedArticle) => {
    const token = await getToken();
    const updatedArticle = {
      ...article,
      ...modifiedArticle,
      dateOfModification: new Date().toLocaleDateString()
    };

    let res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/author-api/article/${article.articleId}`,
      updatedArticle,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.message === "article modified") {
      setEditArticleStatus(false);
      navigate(`/author-profile/articles/${article.articleId}`, { state: res.data.payload });
    }
  };

  const addComment = async (commentObj) => {
    commentObj.nameOfUser = currentUser.firstName;
    let res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/user-api/comment/${article.articleId}`,
      commentObj
    );
    if (res.data.message === "comment added") {
      setCommentStatus("Comment added successfully!");
      setArticle((prev) => ({ ...prev, comments: [...prev.comments, commentObj] }));
      reset();
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 p-4">
        {editArticleStatus ? (
          <form onSubmit={handleSubmit(onSave)}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input type="text" className="form-control" defaultValue={article.title} {...register("title")} />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" defaultValue={article.category} {...register("category")}>
                <option value="programming">Programming</option>
                <option value="AI&ML">AI & ML</option>
                <option value="database">Database</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea className="form-control" rows="8" defaultValue={article.content} {...register("content")} />
            </div>
            <button type="submit" className="btn btn-success w-100">Save</button>
          </form>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold">{article.title}</h1>
              {currentUser.role === "author" && (
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-warning" onClick={enableEdit}><FaEdit /></button>
                  <button className="btn btn-outline-danger" onClick={() => {}}><MdDelete /></button>
                </div>
              )}
            </div>
            <p className="text-muted">Created on: {article.dateOfCreation} | Last modified: {article.dateOfModification}</p>
            <p className="lead" style={{ whiteSpace: "pre-line" }}>{article.content}</p>
            
            {/* Comments Section */}
            <div className="mt-5">
              <h4>Comments</h4>
              {article.comments?.length ? (
                article.comments.map((comment, index) => (
                  <div key={index} className="border-bottom py-2">
                    <p className="fw-bold mb-1">{comment.nameOfUser}</p>
                    <p className="mb-0">{comment.comment}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>

            {/* Add Comment Form */}
            {currentUser.role === "user" && (
              <form onSubmit={handleSubmit(addComment)} className="mt-4">
                <input type="text" {...register("comment")} className="form-control mb-2" placeholder="Write a comment..." />
                <button className="btn btn-success">Add Comment</button>
              </form>
            )}
            {commentStatus && <p className="text-success mt-2">{commentStatus}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default ArticleByID;
