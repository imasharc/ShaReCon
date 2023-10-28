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
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchingPassword, setMatchingPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchingPasswordFocus, setMatchingPasswordFocus] = useState(false);

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
      setValidPassword(result);
      const match = password === matchingPassword;
      setValidMatch(match);
    }, [password, matchingPassword])

    // clear out the error message everytime any of the state pieces from dependency array change
    useEffect(() => {
      setError('');
    }, [username, firstName, lastName, email, password, matchingPassword])

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
    <section className='SignupForm'> 
      <h1>Sign Up</h1>
      <form>
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
        
        <label htmlFor="password">
            Password:
            <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
        </label>
        <input
          type='password'
          id='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-invalid={validPassword ? 'false' : 'true'}
          aria-describedby='pwdnote'
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
        <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.<br />
            Must include uppercase and lowercase letters,<br />
            a number and a special character.<br />
            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
        </p>

        <label htmlFor="confirm_pwd">
            Confirm Password:
            <FontAwesomeIcon icon={faCheck} className={validMatch && matchingPassword ? "valid" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchingPassword ? "hide" : "invalid"} />
        </label>
        <input
            type="password"
            id="confirm_password"
            placeholder='Password'
            value={matchingPassword}
            onChange={(e) => setMatchingPassword(e.target.value)}
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchingPasswordFocus(true)}
            onBlur={() => setMatchingPasswordFocus(false)}
        />
        <p id="confirmnote" className={matchingPasswordFocus && !validMatch ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
            Must match the first password input field.
        </p>
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
