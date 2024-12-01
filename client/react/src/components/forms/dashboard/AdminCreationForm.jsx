// AdminCreationForm.jsx
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography } from '@mui/material';

const AdminForm = () => {
    const { user, loginUser } = useContext(AuthContext);

    useEffect(() => {
        console.log('User from AuthContext:', user);
        if (user) {
            console.log('Auth Tokens:', user.authTokens);
        }
    }, [user]);

    const initialFormData = {
        username: '',
        email: '',
        password: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        user_school_id: '',
        primary_contact: '',
        secondary_contact: '',
        residence: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.authTokens || !user.authTokens.access) {
            alert('User is not logged in or auth token is missing');
            return;
        }

        try {
            const decodedToken = jwtDecode(user.authTokens.access);
            if (decodedToken.exp * 1000 < Date.now()) {
                // Token has expired, attempt to refresh
                const newTokens = await loginUser(user.email, user.password);
                if (newTokens) {
                    user.authTokens.access = newTokens.access;
                } else {
                    alert('Session expired. Please log in again.');
                    return;
                }
            }

            const response = await axios.post('http://127.0.0.1:8000/api/accounts/users/create-school-admin/', formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            console.log(response.data);
            alert('Admin created successfully');
            setFormData(initialFormData); // Clear the form after successful submission
        } catch (error) {
            console.error('Error creating admin:', error);

            if (error.response && error.response.data) {
                alert('Error creating admin: ' + JSON.stringify(error.response.data));
            } else {
                alert('Error creating admin: ' + error.message);
            }
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6">Create Admin</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="first_name"
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="middle_name"
                label="Middle Name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="user_school_id"
                label="Admin ID"
                name="user_school_id"
                value={formData.user_school_id}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="primary_contact"
                label="Primary Contact"
                name="primary_contact"
                value={formData.primary_contact}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="secondary_contact"
                label="Secondary Contact"
                name="secondary_contact"
                value={formData.secondary_contact}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="residence"
                label="Residence"
                name="residence"
                value={formData.residence}
                onChange={handleChange}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Create Admin
            </Button>
        </Box>
    );
};

export default AdminForm;
