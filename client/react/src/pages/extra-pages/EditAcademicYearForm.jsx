import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography } from '@mui/material';

const EditAcademicYearForm = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchAcademicYear();
        }
    }, [user]);

    const fetchAcademicYear = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/academicyears/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching academic year:', error);
            setError('Failed to fetch academic year');
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
            await axios.put(`http://127.0.0.1:8000/api/accounts/academicyears/${id}/edit-academic-year/`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Academic Year updated successfully');
        } catch (error) {
            console.error('Error updating academic year:', error);
            alert('Error updating academic year');
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
            <Typography variant="h6">Edit Academic Year</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="year"
                label="Academic Year"
                name="year"
                value={formData.year || ''}
                onChange={handleChange}
                autoFocus
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Update Academic Year
            </Button>
        </Box>
    );
};

export default EditAcademicYearForm;
