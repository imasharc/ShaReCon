import React from 'react';
import '../styles/PostPrompt.css';

const PostPrompt = ({ onPromptSubmit }) => {
  const handlePromptSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle the prompt submission
    onPromptSubmit(e.target.elements.prompt.value);
  };

  return (
    <div className="post-prompt-container">
      <form onSubmit={handlePromptSubmit}>
          <input type="text" name="prompt" placeholder="What's on your mind?"/>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostPrompt;
