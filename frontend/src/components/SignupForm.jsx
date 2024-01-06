import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/SignupForm.css'

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$/;
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function SignupForm() {
  const userRef = useRef();
  const errRef = useRef(); 

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [availableUsername, setAvailableUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchingPassword, setMatchingPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchingPasswordFocus, setMatchingPasswordFocus] = useState(false);

  const [error, setError] = useState('');

  const history = useHistory();

  // set the focus when the component loads
  useEffect(() => {
    // Check if the input element exists before trying to focus on it
    if (userRef.current) {
      userRef.current.focus();
    }
  }, [])

  // validate email
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
  }, [email])

  // validate username
  useEffect(() => {
    const result = USER_REGEX.test(username);

    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${username}`);
        console.log(`firstname: ${firstName}, lastname: ${lastName}, email: ${email}, username: ${username}, password: ${password}`);

        if (response.ok) {
          setAvailableUsername(false);
        } else {
          setAvailableUsername(true);
        }
      } catch (error) {
        setError('Username Already Taken.');
      }
    }
    fetchData();
    
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

  const handleSignup = async (e) => {
    e.preventDefault();

    // prevent submitting invalid form (via JS hack) by revalidating the regexes
    const v1 = EMAIL_REGEX.test(email);
    const v2 = USER_REGEX.test(username);
    const v3 = PWD_REGEX.test(password);
    if (!v1 || !v2 || !v3) {
        setError("Invalid Entry");
        return;
    }

    if (!username || !firstName || !lastName || !email || !password) {
        setError('All fields are required');
        return;
      }

      try {
        // Send a POST request to your '/signup' endpoint with the signup data
        fetch('http://localhost:3001/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "account": {
                "firstname": firstName,
                "lastname": lastName,
                "email": email,
                "username": username,
                "password": password
            }
        }),
        })
          .then((response) => {
            
            if (response.ok) {
              // Handle successful signup (e.g., navigate to a different page)
              console.log(`firstname: ${firstName}, lastname: ${lastName}, email: ${email}, username: ${username}, password: ${password}`);
              console.log('Signup successful');
              setError(null); // Reset the error state
    
              // Redirect to the login page (or any other page)
              history.push(`/`);
            } else {
              // Handle signup error (e.g., show an error message)
              setError('Signup failed');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            setError('No Server Response');
          });
      } catch (err) {
        if (!err?.response) {
          setError('No Server Response');
        } else if (err.response?.status === 409) {
          setError('Username Taken');
        } else {
          setError('Registration Failed');
        }
        errRef.current.focus();
      }
  };

  return (
    <section className='SignupForm'> 
      <p ref={errRef} className={error ? "errmsg" : "offscreen"} aria-live="assertive">{error}</p>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
      <label htmlFor='username'>
          First Name:
          {/* <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"} />
          <FontAwesomeIcon icon={faTimes} className={validUsername || !username ? "hide" : "invalid"} /> */}
        </label>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor='username'>
          Last Name:
          {/* <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"} />
          <FontAwesomeIcon icon={faTimes} className={validUsername || !username ? "hide" : "invalid"} /> */}
        </label>
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label htmlFor='email'>
          Email:
          <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
          <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
        </label>
        <input
          type='email'
          id='email'
          placeholder='Email'
          ref={userRef}
          autoComplete='off'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-invalid={validEmail ? 'false' : 'true'}
          aria-describedby='emailnote'
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
        />
        <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle} />
          {/* 4 to 24 characters.<br /> */}
          Must be a valid email.<br />
        </p>
        
        <label htmlFor='username'>
          Username:
          <FontAwesomeIcon icon={faCheck} className={(validUsername && availableUsername) ? "valid" : "hide"} />
          <FontAwesomeIcon icon={faTimes} className={(validUsername && availableUsername) || !username ? "hide" : "invalid"} />
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
        <p id="uidnote" className={usernameFocus && username && !availableUsername ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle} />
          username is already taken.<br />
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

        <button disabled={!validUsername || !validPassword || !validMatch ? true : false}>Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in here</Link>.
      </p>
    </section>
  );
}

export default SignupForm;
