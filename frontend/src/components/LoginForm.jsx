import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom'; // Import the Link component
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/LoginForm.css'

function LoginForm() {
  const userRef = useRef();
  const errRef = useRef(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory(); // Initialize useHistory
  
  // set the focus when the component loads
  useEffect(() => {
    // Check if the input element exists before trying to focus on it
    if (userRef.current) {
      userRef.current.focus();
    }
  }, [])

  // clear out the error message everytime any of the state pieces from dependency array change
  useEffect(() => {
    setError('');
  }, [username, password])

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
    <section className='LoginForm'>
      <p ref={errRef} className={error ? 'errmsg' : 'offscreen'} aria-live='assertive'>{error}</p>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor='username'>
            Username:
        </label>
        <input
          type='text'
          id='username'
          placeholder='Username'
          ref={userRef}
          autoComplete='off'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor='password'>
          Password:
        </label>
        <input
          type='password'
          id='password'
          placeholder='Password'
          autoComplete='off'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button>Login</button>
        {/* {error && <div className='error-message'>{error}</div>} */}
      </form>
      <p>
        Don't have an account yet? <Link to='/signup'>Sign up here</Link>.
      </p>
    </section>
  );
}

export default LoginForm;