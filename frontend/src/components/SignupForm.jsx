import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/SignupForm.css'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function SignupForm() {
  const userRef = useRef();
  const errRef = useRef(); 

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [firstNameFocus, setfirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState('');
  const [lastNameFocus, setlastNameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  
  const [password, setPassword] = useState('');
  const [validPassword, setvalidPassword] = useState(false);
  const [passwordFocus, setpasswordFocus] = useState(false);

  const [matchPassword, setmatchPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchPasswordFocus, setmatchPasswordFocus] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  // set the focus when the component loads
  useEffect(() => {
    // Check if the input element exists before trying to focus on it
    if (userRef.current) {
      userRef.current.focus();
    }
  }, [])

  // validate username
  useEffect(() => {
    const result = USER_REGEX.test(username);
    console.log(result);
    console.log(username);
    setValidUsername(result);
  }, [username])

    // validate password
    useEffect(() => {
      const result = PWD_REGEX.test(password);
      console.log(result);
      console.log(password);
      setvalidPassword(result);
      const match = password === matchPassword;
      setValidMatch(match);
    }, [password, matchPassword])

    // clear out the error message everytime any of the state pieces from dependency array change
    useEffect(() => {
      setError('');
    }, [username, firstName, lastName, email, password, matchPassword])

  const handleSignup = () => {
    if (!username || !firstName || !lastName || !email || !password) {
        setError('All fields are required');
        return;
      }
    // Send a POST request to your '/signup' endpoint with the signup data
    fetch('http://localhost:3001/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, firstName, lastName, email, password }),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful signup (e.g., navigate to a different page)
          console.log('Signup successful');
          setError(null); // Reset the error state

          // Redirect to the login page (or any other page)
          history.push(`/account/${username}`);
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
    <section>
      <h1>Sign Up</h1>
      <form>
        <label htmlFor='username'>
          Username:
          <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"} />
          <FontAwesomeIcon icon={faTimes} className={validUsername || !username ? "hide" : "invalid"} />
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
          aria-invalid={validUsername ? 'false' : 'true'}
          aria-describedby='uidnote'
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
        />
        <p id="uidnote" className={usernameFocus && username && !validUsername ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle} />
          4 to 24 characters.<br />
          Must begin with a letter.<br />
          Letters, numbers, underscores, hyphens allowed.
        </p>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
      </form>
      <button onClick={handleSignup}>Sign Up</button>
      <p ref={errRef} className={error ? "errmsg" : "offscreen"} aria-live="assertive">{error}</p>
      <p>
        Already have an account? <Link to="/login">Log in here</Link>.
      </p>
    </section>
  );
}

export default SignupForm;
