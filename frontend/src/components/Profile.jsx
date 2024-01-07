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
              <img src="https://imgs.search.brave.com/I8zySyfdpB3tHk9GWmI2lcNkb5eiE7HqEyIgKvUOrNI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi91cy12/aWNlLXByZXNpZGVu/dC1taWtlLXBlbmNl/LWhlcnNoZXktcGEt/dXNhLWRlY2VtYmVy/LXVzLXZpY2UtcHJl/c2lkZW50LW1pa2Ut/cGVuY2Utc3BlYWtp/bmctcG9saXRpY2Fs/LXJhbGx5LXVzLTE2/NjUzNzg2NS5qcGc" alt="User Profile" />
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
