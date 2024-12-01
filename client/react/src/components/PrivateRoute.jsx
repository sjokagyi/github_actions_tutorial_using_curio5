// src/components/PrivateRoute.jsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/auth-reducer/AuthContext';

const PrivateRoute = ({ component: Component, userTypes, ...rest }) => {
  const { isLoggedIn, user } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (userTypes && !userTypes.includes(user.user_type)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
