// src/contexts/auth-reducer/AuthContext.js


import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import authReducer, { initialState } from './auth';
import { LOGIN, LOGOUT, INITIALIZE, REGISTER } from './actions';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const fetchUserProfile = async (userId, accessToken) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/users/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            return null;
        }
    };

    const refreshAccessToken = async (refreshToken) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/api/token/refresh/', { refresh: refreshToken });
            return response.data;
        } catch (error) {
            console.error("Failed to refresh access token", error);
            return null;
        }
    };

    const initialize = async () => {
        const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
        if (authTokens) {
            let decodedToken = jwtDecode(authTokens.access);
            if (decodedToken.exp * 1000 < Date.now()) {
                const newTokens = await refreshAccessToken(authTokens.refresh);
                if (newTokens) {
                    authTokens.access = newTokens.access;
                    localStorage.setItem('authTokens', JSON.stringify(authTokens));
                    decodedToken = jwtDecode(newTokens.access);
                } else {
                    dispatch({ type: LOGOUT });
                    localStorage.removeItem('authTokens');
                    return;
                }
            }

            let user = decodedToken;
            const userProfile = await fetchUserProfile(decodedToken.user_id, authTokens.access);
            user = { ...user, ...userProfile, authTokens };

            dispatch({
                type: INITIALIZE,
                payload: {
                    isLoggedIn: true,
                    user,
                    authTokens
                }
            });
        } else {
            dispatch({
                type: INITIALIZE,
                payload: {
                    isLoggedIn: false,
                    user: null,
                    authTokens: null
                }
            });
        }
    };

    useEffect(() => {
        initialize();
    }, []);

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/api/token/', { email, password });
            const data = response.data;
            const decodedToken = jwtDecode(data.access);
            let user = decodedToken;

            const userProfile = await fetchUserProfile(decodedToken.user_id, data.access);
            user = { ...user, ...userProfile, authTokens: data };

            dispatch({
                type: LOGIN,
                payload: {
                    user,
                    authTokens: data
                }
            });
            localStorage.setItem('authTokens', JSON.stringify(data));
            return user;  // Return the user object with profile details
        } catch (error) {
            console.error("Login error:", error);
            throw new Error('Invalid email or password');
        }
    };

    const registerUser = async (username, email, password, first_name, middle_name, last_name) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/users/register-school-admin/', { username, email, password, first_name, middle_name, last_name });
            const data = response.data;

            if (typeof data.access !== 'string' || typeof data.refresh !== 'string') {
                throw new Error('Invalid token format received from API');
            }

            const decodedToken = jwtDecode(data.access);
            let user = decodedToken;
            const userProfile = await fetchUserProfile(decodedToken.user_id, data.access);
            user = { ...user, ...userProfile, authTokens: data };

            dispatch({
                type: LOGIN, // Dispatch LOGIN instead of REGISTER
                payload: {
                    user,
                    authTokens: data
                }
            });

            localStorage.setItem('authTokens', JSON.stringify(data));
            return data; // Return data to handle redirection in AuthRegister.jsx
        } catch (error) {
            console.error("Error registering user:", error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const logoutUser = async () => {
        const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
        if (authTokens) {
            try {
                await axios.post('http://127.0.0.1:8000/api/accounts/users/logout/', {
                    refresh_token: authTokens.refresh
                }, {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                dispatch({
                    type: LOGOUT
                });
                localStorage.removeItem('authTokens');
            } catch (error) {
                console.error("Failed to logout", error.response ? error.response.data : error.message);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, loginUser, registerUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };

