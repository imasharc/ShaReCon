import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

function AccountPanel() {
  const [userData, setUserData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const { username } = useParams();
  const history = useHistory(); // Initialize useHistory

  // Function to fetch user data
  const fetchUserData = () => {
    // Make an API request to fetch user data
    fetch(`http://localhost:3001/user/${username}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch user data');
        }
      })
      .then((data) => {
        setUserData(data); // Update the state with fetched user data
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle the error (e.g., display an error message)
      });
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    fetchUserData();
  }, []);

    // Check if the user session is active
    useEffect(()=> {
      fetch(`http://localhost:3001/check-session`)
        .then((response) => {
          if (response.ok) {
            return response.json(response);
          }
        })
        .catch((error) => {
          history.push(`/login`);
          console.error('Error:', error);
          // Handle the error (e.g., display an error message)
        });
    });

  useEffect(() => {
    // Use a setTimeout to wait for userData to be fetched
    const delay = 1000; // 1 second (adjust as needed)
    const timer = setTimeout(() => {
      // Actions that should occur after userData is fetched
      // For example, you can access userData.firstName here
      console.log('Fetched user data:', userData);
    }, delay);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [userData]); // Include userData in the dependency array

  return (
    <div>
      <h2>Account Settings</h2>
      <div>
        <h3>Profile</h3>
        <p>Username: {userData.username}</p>
        <p>First Name: {userData.firstname}</p>
        <p>Last Name: {userData.lastname}</p>
        <p>Email: {userData.email}</p>
      </div>
      <div>
        <h3>Password Change</h3>
        {/* Include a password change form here */}
      </div>
    </div>
  );
}

export default AccountPanel;
