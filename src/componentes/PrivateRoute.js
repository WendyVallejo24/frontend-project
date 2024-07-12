import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    if (exp * 1000 < Date.now()) {
      return false; // Token expirado
    }
    return true; // Token válido
  } catch (error) {
    return false; // Error al decodificar token
  }
};

const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  console.log('Token:', token);

  if (!isTokenValid(token)) {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
