import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography } from '@mui/material';

const CreateAcademicYear = () => {
    const { user } = useContext(AuthContext);

    const initialFormData = {
        year: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.authTokens || !user.authTokens.access) {
            alert('User is not logged in or auth token is missing');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/academicyears/create-academicyear/', formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Academic Year created successfully');
            setFormData(initialFormData); // Clear the form after successful submission
        } catch (error) {
            console.error('Error creating academic year:', error);
            setError('Failed to create academic year');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6">Create Academic Year</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="year"
                label="Academic Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                autoFocus
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
            >
                Create Academic Year
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default CreateAcademicYear;
