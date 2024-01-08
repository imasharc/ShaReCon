import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from './Post';
import "../styles/Profile.css";

const Profile = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [validOwner, setValidOwner] = useState(false);

  const verifyOwner = async () => {
    const token = document.cookie.split('=')[1];
    try {
      const response = await fetch(`http://localhost:3001/api/users/${username}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      const accountData = await response.json();
      // console.log(userData);
      if (accountData.account.token === token) {
        setValidOwner(true)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/acc/${username}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }

        const userData = await response.json();
        // console.log(userData);
        setUserProfile(userData.account);
        console.log(userData.account);
        verifyOwner();
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [username]);

  return (
    <div className="profile-container">
      {userProfile && (
        <>
          <div className="user-profile-header">
            <div className="main-user-picture">
              <img src={`http://localhost:3001/assets/${userProfile.profile_picture}`} alt="User Profile" />
            </div>
            <h2>{userProfile.username}'s Profile
              {validOwner && (
              <a href="http://localhost:3000/account/mike" onClick={verifyOwner}>(edit) 🖉</a>
              )}
            </h2>
          </div>
            <div className="user-posts">
              <h3>Posts by {userProfile.username}</h3>
              {userProfile.posts.map((post) => (
                <Post key={post.id} post={post}/>
              ))}
            </div>
        </>
      )}
    </div>
  );
};

export default Profile;
