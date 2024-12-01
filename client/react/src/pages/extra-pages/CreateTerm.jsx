import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography } from '@mui/material';

const CreateTerm = () => {
    const { user } = useContext(AuthContext);

    const initialFormData = {
        term: '',
        start_date: '',
        end_date: '',
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
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/terms/create-term/', formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Term created successfully');
            setFormData(initialFormData); // Clear the form after successful submission
        } catch (error) {
            console.error('Error creating term:', error);
            setError('Failed to create term');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6">Create Term</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="term"
                label="Term"
                name="term"
                value={formData.term}
                onChange={handleChange}
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="start_date"
                label="Start Date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="end_date"
                label="End Date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
            >
                Create Term
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default CreateTerm;
