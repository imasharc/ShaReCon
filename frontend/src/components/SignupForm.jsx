import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignupForm() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = () => {
    if (!name || !surname || !username || !email || !password) {
        setError('All fields are required');
        return;
      }
    // Send a POST request to your '/signup' endpoint with the signup data
    fetch('http://localhost:3001/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, surname, username, email, password }),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful signup (e.g., navigate to a different page)
          console.log('Signup successful');
          setError(null); // Reset the error state
        } else {
          // Handle signup error (e.g., show an error message)
          setError('Signup failed');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An error occurred while signing up');
      });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Surname"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
      {error && <div className="error-message">{error}</div>}
      <p>
        Already have an account? <Link to="/login">Log in here</Link>.
      </p>
    </div>
  );
}

export default SignupForm;
