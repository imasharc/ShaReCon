import React from 'react';
import Post from './Post';
import "../styles/MainFeed.css";

const MainFeed = ({ posts }) => {
  return (
    <div className="main-feed-container">
      <h2>Main Feed</h2>
      {Array.isArray(posts) && posts.map((post) => (
        <Post key={post.id} post={post}/>
      ))}
    </div>
  );
};

export default MainFeed;
