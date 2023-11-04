import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [cookies] = useCookies(["token"]); // Replace 'token' with your cookie name

  return (
    <Route
      {...rest}
      render={(props) =>
        cookies.token ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
