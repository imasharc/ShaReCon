import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from './Post';
import "../styles/Profile.css";

const Profile = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);

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
          <h2>{userProfile.username}'s Profile</h2>
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
