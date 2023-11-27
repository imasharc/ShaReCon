// Comment.js
import React from 'react';
import { Link } from "react-router-dom";

const Comment = ({ post, comment }) => {
  return (
    <div className="comment-container">
      <p className="comment-author"><Link to={`/${comment.username}`}>{comment.username}</Link></p>
      <p className="comment-text">{post.id}</p>
      <p className="comment-text">{comment.text_content}</p>
      <p className="comment-created-at">{comment.created_at}</p>
      {console.log(comment)}
    </div>
  );
};

export default Comment;
