import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/" />;
  }

  // Return the component if authenticated
  return <Component {...rest} />;
};

export default PrivateRoute;
