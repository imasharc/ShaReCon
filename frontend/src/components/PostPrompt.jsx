import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import '../styles/PostPrompt.css';

const PostPrompt = ({ onPromptSubmit, authToken }) => {
  const [text, setText] = useState('');
  // Get the 'token' cookie
  const [cookies] = useCookies(['token']);

  const handlePromptSubmit = async (e) => {
    // e.preventDefault();
    
    try {
      const authToken = cookies.token;
      
      // Check if there's text before making the request
      if (!text) {
        console.error('Please enter some text.');
        return;
      }

      const response = await fetch('http://localhost:3001/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "post": {
            "text_content": text,
            "token": authToken
        }
    }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit post: ${response.status}`);
    }

    // Assuming your backend returns the newly created post
    const newPost = await response.json();

    // Add logic to handle the new post (e.g., update state, refresh posts, etc.)
    // For now, let's log the new post
    console.log('New Post:', newPost);

    // Clear the input
    setText('');

    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return (
    <div className="post-prompt-container">
    {cookies.token && (
      <form onSubmit={handlePromptSubmit}>
          <input
          type="text"
          name="prompt"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}/>
        <button type="submit">Submit</button>
      </form>
      )}
    </div>
  );
};

export default PostPrompt;
