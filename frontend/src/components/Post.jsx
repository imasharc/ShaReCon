// Post.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Comment from "./Comment";
import '../styles/Post.css'

const Post = ({ post }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [cookies] = useCookies(['token']);

  const handlePromptSubmit = async (e) => {
    // e.preventDefault();
    
    try {
      const authToken = cookies.token;
      
      // Check if there's text before making the request
      if (!commentText) {
        console.error('Please enter some text.');
        return;
      }

      const response = await fetch('http://localhost:3001/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "comment": {
            "text_content": commentText,
            "post_id": post.id,
            "token": authToken
        }
    }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit post: ${response.status}`);
    }

    // Assuming your backend returns the newly created post
    const newComment = await response.json();

    // Add logic to handle the new post (e.g., update state, refresh posts, etc.)
    // For now, let's log the new post
    console.log('New Comment:', newComment);

    await fetchComments(post.id);

    // Clear the input
    setCommentText('');

    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/comments/post/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
  
      const data = await response.json();
      setComments(data.post.comments)
      console.log('Comments:', comments);
  
      // Handle the comments, update state, etc.
  
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = (postId) => {
    console.log(`Comment submitted for post ${post.id}: ${commentText}`);

    // For simplicity, let's clear the comment text after submission
    setCommentText('');
  };

  const handleShowCommentsClick = async (postId) => {
    await fetchComments(postId);
    setShowComments(!showComments);
    console.log(!showComments);
  };

  return (
    <div className="post-container">
      <Link to={`/${post.username}`}>
        <div className="user-picture">
          <img src="https://imgs.search.brave.com/I8zySyfdpB3tHk9GWmI2lcNkb5eiE7HqEyIgKvUOrNI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi91cy12/aWNlLXByZXNpZGVu/dC1taWtlLXBlbmNl/LWhlcnNoZXktcGEt/dXNhLWRlY2VtYmVy/LXVzLXZpY2UtcHJl/c2lkZW50LW1pa2Ut/cGVuY2Utc3BlYWtp/bmctcG9saXRpY2Fs/LXJhbGx5LXVzLTE2/NjUzNzg2NS5qcGc" alt="User Profile" />
        </div>
      </Link>
      <p className="post-user"><Link to={`/${post.username}`}>{post.username}</Link></p>
      <p className="post-text">{post.text_content}</p>
      <p className="post-created-at">{post.created_at}</p>
      
      {/* Render comments prompt and toggle button */}
      <div className="comment-prompt">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={handleCommentChange}
          onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
        />
        <button onClick={handlePromptSubmit}>Submit</button>
          
        <button onClick={() => handleShowCommentsClick(post.id)}>
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {/* Render comments if available */}
      {showComments && comments && comments.length > 0 && (
        <div className="comments-container">
          <h4>Comments:</h4>
          {comments.map((comment) => (
            comment.text_content !== null && (
              <Comment key={comment.id} post={post} comment={comment} />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
