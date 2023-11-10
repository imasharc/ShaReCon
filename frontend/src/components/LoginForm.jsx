import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom'; // Import the Link component
import { CookiesProvider, useCookies } from "react-cookie";
import '../styles/LoginForm.css'

function LoginForm() {
  const userRef = useRef();
  const errRef = useRef(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory(); // Initialize useHistory

  const [cookies, setCookie] = useCookies(["token"]);
  
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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setUsername('');
      setPassword('');
      // Send a POST request to your '/login' endpoint with the username and password
      fetch(`http://localhost:3001/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false,
        body: JSON.stringify({
          "account": {
              "username": username,
              "password": password
          }
      }),
      })
        .then((response) => {
          if (response.ok) {
            // Assuming the response data is in JSON format, you can parse it
            return response.json();
          } else {
            // Handle login error and set error message
            setError('Login or password incorrect');
          }
        })
        .then((data) => {
          // 'data' will contain the response data, which includes "auth" and "token"
          // console.log(data);
          if(data) {
            // Now you can access the "auth" and "token" properties
            const { auth, token, result } = data;
            // Handle the data as needed
            if (auth) {
              // Authentication was successful, and you can use the 'token'
              // Set the 'token' in your React state or cookies
              setCookie("token", token, { path: "/", maxAge: 60 });
              // console.log(cookies);
  
              history.push(`/account/${username}`);
            }
          } else {
            setError('No Account Found');
            // Authentication failed
            // Handle the error or show a message to the user
            console.log("Login failed");
          }
        })
    } catch (err) {
      if (!err?.response) {
        setError('No Server Response');
      } else if (err.response?.status === 400) {
        setError('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setError('Unauthorized');
      } else {
        setError('Login Failed');
      }
      errRef.current.focus();
    }
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