// src/utils/auth.js

import axios from 'axios';

export const logout = () => {
  const refreshToken = localStorage.getItem('refresh_token');

  if (refreshToken) {
    axios.post('http://127.0.0.1:8000/api/accounts/users/logout/', { refresh_token: refreshToken })
      .then(response => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      })
      .catch(error => {
        console.error('There was an error logging out!', error);
        // Clear tokens even if there was an error logging out on the backend
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      });
  } else {
    window.location.href = '/login';
  }
};
