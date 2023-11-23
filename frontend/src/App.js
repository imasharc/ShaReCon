import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import AccountPanel from "./components/AccountPanel";
import { CookiesProvider, useCookies } from "react-cookie";
import PrivateRoute from "./components/PrivateRoute";
import PostPrompt from "./components/PostPrompt";
import MainFeed from './components/MainFeed';
import Profile from "./components/Profile";
import "../src/App.css";

function Home({ isHome, handlePromptSubmit }) {
  console.log('isHome:', isHome);
  return (
    <div className="greeting-container">
      <h1 className="greeting-text">Welcome to the Home</h1>
      {isHome && <PostPrompt onPromptSubmit={handlePromptSubmit} />}
    </div>
  );
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const history = useHistory(); // Initialize useHistory
  const [cookie, setCookie, removeCookie] = useCookies(); // Replace 'token' with your cookie name
  const [promptText, setPromptText] = useState('');
  const [posts, setPosts] = useState([]);

  const handlePromptSubmit = async (text) => {
    try {
      console.log('Prompt submitted:', text);
      await fetchPosts();
      setPromptText('');
    } catch (error) {
      console.error('Error handling prompt submission:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/posts');
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const fetchedData = await response.json();
      const fetchedPosts = fetchedData.posts;
      console.log(fetchedPosts);
      
      // Sort posts by created_at in descending order
      const sortedPosts = fetchedPosts.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setPosts(sortedPosts);

      } catch (error) {
        console.error('Error fetching posts:', error);
      }
  };

  const handleLogout = () => {
    console.log(cookie.token);
    // setCookie("token", null, { path: "/" });
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const handleAuth = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/isValid/${cookie.token}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.account.token === cookie.token) {
          console.log(data.account.username);
          console.log(cookie.token);
          console.log(history);
          history.push(`/account/${data.account.username}`);
          window.location.href = window.location.href;
        } else {
          console.error("Authorization failed");
        }
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log("works?")
    fetchPosts();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <div className="nav-container">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/login" onClick={handleAuth}>
            Login
          </Link>
          <Link className="nav-link" to="/" onClick={handleLogout}>
            Log out
          </Link>
        </div>

        <Switch>
          <Route path="/login" component={LoginForm} />
          {/* <Route
            path="/login"
            render={() => <LoginForm handleAuth={handleAuth} />}
          /> */}
          <Route path="/signup" component={SignupForm} />
          <PrivateRoute path="/account/:username" component={AccountPanel} />
          <Route path="/:username" component={Profile} />
          <Route
            path="/"
            render={() => (
              <>
                <Home isHome={isHome} handlePromptSubmit={handlePromptSubmit} />
                <MainFeed posts={posts} />
              </>
            )}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
