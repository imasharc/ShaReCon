import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import AccountPanel from "./components/AccountPanel";
import { CookiesProvider, useCookies } from "react-cookie";
import PrivateRoute from "./components/PrivateRoute";
import "../src/App.css";

function Home() {
  return (
    <div className="greeting-container">
      <h1 className="greeting-text">Welcome to the Home</h1>
    </div>
  );
}

function App() {
  const history = useHistory(); // Initialize useHistory
  const [cookie, setCookie, removeCookie] = useCookies(); // Replace 'token' with your cookie name

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

  // useEffect(() => {
  //   handleAuth();
  // }, []);

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
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
