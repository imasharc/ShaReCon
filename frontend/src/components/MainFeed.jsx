import React from 'react';
import "../styles/MainFeed.css";

const MainFeed = ({ posts }) => {
  return (
    <div className="main-feed-container">
      <h2>Main Feed</h2>
      {Array.isArray(posts) && posts.map((post) => (
        <div key={post.id} className="tweet-container">
            <p className="tweet-user">{post.account.username}</p>
            <p className="tweet-text">{post.text_content}</p>
        </div>
      ))}
    </div>
  );
};

export default MainFeed;
