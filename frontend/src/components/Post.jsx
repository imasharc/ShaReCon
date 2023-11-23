// Post.js
import React from "react";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  return (
    <div className="tweet-container">
      <p className="tweet-user"><Link to={`/${post.username}`}>{post.username}</Link></p>
      <p className="tweet-text">{post.text_content}</p>
      <p className="tweet-text">{post.created_at}</p>
    </div>
  );
};

export default Post;
