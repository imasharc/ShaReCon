import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import "../src/App.css";

function Home() {
  return (
    <div className="greeting-container">
      <h1 className="greeting-text">Welcome to the Home</h1>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <Router>
        <div className="nav-container">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </div>

        <Switch>
          <Route path="/login" component={LoginForm} />
          <Route path="/signup" component={SignupForm} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
