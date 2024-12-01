import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CreateCollege = () => {
    const { user } = useContext(AuthContext);

    const initialFormData = {
        name: '',
        faculties: [] // Add faculties to the form data
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [faculties, setFaculties] = useState([]); // State to hold faculties

    useEffect(() => {
        if (user) {
            fetchFaculties();
        }
    }, [user]);

    const fetchFaculties = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/faculties/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    school: user.school.id // Fetch faculties for the user's school
                }
            });
            setFaculties(response.data.results); // Assuming the faculties are in the results key
        } catch (error) {
            console.error('Error fetching faculties:', error);
            setError('Failed to fetch faculties');
        } finally {
            setLoading(false);
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
        if (!user || !user.authTokens || !user.authTokens.access) {
            alert('User is not logged in or auth token is missing');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/colleges/create-college/', {
                ...formData,
                school: user.school.id  // Include the school ID in the request
            }, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('College created successfully');
            setFormData(initialFormData); // Clear the form after successful submission
        } catch (error) {
            console.error('Error creating college:', error);
            setError('Failed to create college');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6">Create College</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="College Name"
                name="name"
                value={formData.name}
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
                    value={formData.faculties}
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
                disabled={loading}
            >
                Create College
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default CreateCollege;
