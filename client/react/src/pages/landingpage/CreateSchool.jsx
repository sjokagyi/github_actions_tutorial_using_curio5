// src/pages/landingpage/CreateSchool.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import axios from 'axios';
import { Container, Box, Typography } from '@mui/material';
import SchoolCreationForm from 'components/forms/landingpage/SchoolCreationForm';

const CreateSchool = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (formData) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/schools/create-school/', formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            console.log(response.data);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response ? err.response.data : 'Something went wrong');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create School
                </Typography>
                <SchoolCreationForm onSubmit={handleSubmit} error={error} />
            </Box>
        </Container>
    );
};

export default CreateSchool;
