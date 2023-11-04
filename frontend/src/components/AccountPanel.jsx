import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

function AccountPanel() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });
  const { username } = useParams();
  const history = useHistory(); // Initialize useHistory

  // Function to fetch user data
  const fetchUserData = async () => {
    // Make an API request to fetch user data
    await fetch(`http://localhost:3001/api/users/${username}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch user data');
        }
      })
      .then((data) => {
        console.log(data); // Update the state with fetched user data
        setUserData({
          firstName: data.account.firstname,
          lastName: data.account.lastname,
          username: data.account.username,
          email: data.account.email,
        }); // Update the state with fetched user data
        // console.log(userData);
        if (data.account.token) {
          console.log("This shit works!");
        }
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

  return (
    <div>
      <h2>Account Settings</h2>
      <div>
        <h3>Profile</h3>
        <p>Username: {userData.username}</p>
        <p>First Name: {userData.firstName}</p>
        <p>Last Name: {userData.lastName}</p>
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
