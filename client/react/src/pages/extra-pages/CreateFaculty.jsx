import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CreateFaculty = () => {
    const { user } = useContext(AuthContext);

    const initialFormData = {
        name: '',
        programmes: []
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [programmes, setProgrammes] = useState([]);

    useEffect(() => {
        if (user) {
            fetchProgrammes();
        }
    }, [user]);

    const fetchProgrammes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/programmes/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    school: user.school.id
                }
            });
            setProgrammes(response.data.results);
        } catch (error) {
            console.error('Error fetching programmes:', error);
            setError('Failed to fetch programmes');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProgrammesChange = (event) => {
        setFormData({ ...formData, programmes: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.authTokens || !user.authTokens.access) {
            alert('User is not logged in or auth token is missing');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/faculties/create-faculty/', formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Faculty created successfully');
            setFormData(initialFormData);
        } catch (error) {
            console.error('Error creating faculty:', error);
            setError('Failed to create faculty');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6">Create Faculty</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Faculty Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoFocus
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="programmes-label">Programmes</InputLabel>
                <Select
                    labelId="programmes-label"
                    id="programmes"
                    name="programmes"
                    multiple
                    value={formData.programmes}
                    onChange={handleProgrammesChange}
                >
                    {programmes.map((programme) => (
                        <MenuItem key={programme.id} value={programme.id}>
                            {programme.name}
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
                Create Faculty
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default CreateFaculty;
