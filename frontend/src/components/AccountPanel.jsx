import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

function AccountPanel() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    profile_picture: '',
  });
  const [selectedFile, setSelectedFile] = useState(null); // New state for the selected file
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
        // console.log(data); // Update the state with fetched user data
        setUserData({
          firstName: data.account.firstname,
          lastName: data.account.lastname,
          username: data.account.username,
          email: data.account.email,
          profile_picture: data.account.profile_picture,
        }); // Update the state with fetched user data
        // console.log(userData);
        if (data.account.token) {
          // console.log("This shit works!");
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

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  // console.log(selectedFile)

  // Function to handle image upload
  const handleImageUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }
    const formData = new FormData();
    formData.append('profile_picture', selectedFile);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }    // Make an API request to update the user's profile image
    await fetch(`http://localhost:3001/api/users/uploadPfp/${username}`, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      // Update the userData state with the new profile image URL
      userData.profile_picture = data.updatedUser.profile_picture;
    })
    .catch(error => console.error('Error:', error));
    console.log(userData)

  };

  return (
    <div>
      <h2>Account Settings</h2>
      <div>
        <h3>Profile</h3>
        <img src={`http://localhost:3001/assets/${userData.profile_picture.split('/').pop()}`} alt="User Profile" />
        <input type="file" onChange={handleFileChange} />
        {selectedFile && <button onClick={handleImageUpload}>Upload Image</button>}
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
