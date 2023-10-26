import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; // Import the Link component
import '../styles/LoginForm.css'

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory(); // Initialize useHistory

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Send a POST request to your '/login' endpoint with the username and password
    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful login
          console.log('Login successful');
          setError(null); // Reset the error state on success
          
          // Redirect to the account page with the username
          history.push(`/account/${username}`);
        } else {
          // Handle login error and set error message
          setError('Login or password incorrect');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An error occurred while logging in');
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <div className="error-message">{error}</div>}

      <p>
        Don't have an account yet? <Link to="/signup">Sign up here</Link>.
      </p>
    </div>
  );
}

export default LoginForm;