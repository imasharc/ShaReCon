import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import '../styles/PostPrompt.css';

const PostPrompt = ({ onPromptSubmit, authToken }) => {
  const [text, setText] = useState('');
  // Get the 'token' cookie
  const [cookies] = useCookies(['token']);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const authToken = cookies.token;
      // Add logic to handle the prompt submission (including auth token)
      await onPromptSubmit({ text, authToken });
      // Clear the input
      setText('');
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return (
    <div className="post-prompt-container">
      <form onSubmit={handlePromptSubmit}>
          <input
          type="text"
          name="prompt"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}/>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostPrompt;
