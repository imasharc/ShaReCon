// Comment.js
import React from 'react';
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';

const Comment = ({ post, comment }) => {
  const [cookies] = useCookies(['token']);

  const handleDeleteComment = async (commentId) => {
    try {
      console.log("DELETE?");
      const authToken = cookies.token;

      if (authToken) {
        const response = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "comment": {
                "comment_id": commentId,
                "token": authToken
              }
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to delete comment: ${response.status}`);
        }
        // Reload the page after successful deletion
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comment-container">
      <p className="comment-author"><Link to={`/${comment.username}`}>{comment.username}</Link></p>
      <p className="comment-text">{post.id}</p>
      <p className="comment-text">{comment.text_content}</p>
      <p className="comment-created-at">{comment.created_at}</p>
      {cookies.token && (
        <button className="delete-button" onClick={() => handleDeleteComment(comment.id)}>Delete Comment</button>
      )}
    </div>
  );
};

export default Comment;
