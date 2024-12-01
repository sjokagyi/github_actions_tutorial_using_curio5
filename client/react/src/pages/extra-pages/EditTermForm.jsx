import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography } from '@mui/material';

const EditTermForm = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchTerm();
        }
    }, [user]);

    const fetchTerm = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/terms/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching term:', error);
            setError('Failed to fetch term');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:8000/api/accounts/terms/${id}/edit-term/`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Term updated successfully');
        } catch (error) {
            console.error('Error updating term:', error);
            alert('Error updating term');
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6">Edit Term</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="term"
                label="Term"
                name="term"
                value={formData.term || ''}
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
                value={formData.start_date || ''}
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
                value={formData.end_date || ''}
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
            >
                Update Term
            </Button>
        </Box>
    );
};

export default EditTermForm;
