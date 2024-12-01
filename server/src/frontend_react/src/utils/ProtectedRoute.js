// ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, userType, requiredUserType }) => {
  const accessToken = localStorage.getItem('access_token');
  const storedUserType = localStorage.getItem('user_type');

  if (!accessToken || storedUserType !== requiredUserType) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
