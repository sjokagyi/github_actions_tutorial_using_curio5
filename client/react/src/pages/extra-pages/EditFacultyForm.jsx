import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const EditFacultyForm = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({});
    const [programmes, setProgrammes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchFaculty();
            fetchProgrammes();
        }
    }, [user]);

    const fetchFaculty = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/faculties/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching faculty:', error);
            setError('Failed to fetch faculty');
        } finally {
            setLoading(false);
        }
    };

    const fetchProgrammes = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/programmes/', {
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
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFacultiesChange = (event) => {
        setFormData({ ...formData, programmes: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:8000/api/accounts/faculties/${id}/edit-faculty/`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Faculty updated successfully');
        } catch (error) {
            console.error('Error updating faculty:', error);
            alert('Error updating faculty');
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
            <Typography variant="h6">Edit Faculty</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Faculty Name"
                name="name"
                value={formData.name || ''}
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
                    value={formData.programmes || []}
                    onChange={handleChange}
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
            >
                Update Faculty
            </Button>
        </Box>
    );
};

export default EditFacultyForm;
