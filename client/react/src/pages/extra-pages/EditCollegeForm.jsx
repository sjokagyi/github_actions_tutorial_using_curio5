import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const EditCollegeForm = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({});
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchCollege();
            fetchFaculties();
        }
    }, [user]);

    const fetchCollege = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/colleges/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching college:', error);
            setError('Failed to fetch college');
        } finally {
            setLoading(false);
        }
    };

    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/faculties/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    school: user.school.id
                }
            });
            setFaculties(response.data.results);
        } catch (error) {
            console.error('Error fetching faculties:', error);
            setError('Failed to fetch faculties');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFacultiesChange = (event) => {
        setFormData({ ...formData, faculties: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:8000/api/accounts/colleges/${id}/edit-college/`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('College updated successfully');
        } catch (error) {
            console.error('Error updating college:', error);
            alert('Error updating college');
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
            <Typography variant="h6">Edit College</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="College Name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                autoFocus
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="faculties-label">Faculties</InputLabel>
                <Select
                    labelId="faculties-label"
                    id="faculties"
                    name="faculties"
                    multiple
                    value={formData.faculties || []}
                    onChange={handleFacultiesChange}
                >
                    {faculties.map((faculty) => (
                        <MenuItem key={faculty.id} value={faculty.id}>
                            {faculty.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Update College
            </Button>
        </Box>
    );
};

export default EditCollegeForm;
