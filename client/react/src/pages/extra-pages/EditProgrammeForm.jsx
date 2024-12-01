import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const EditProgrammeForm = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({});
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchProgramme();
            fetchCourses();
        }
    }, [user]);

    const fetchProgramme = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/programmes/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching programme:', error);
            setError('Failed to fetch programme');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/courses/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    school: user.school.id
                }
            });
            setCourses(response.data.results);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to fetch courses');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:8000/api/accounts/programmes/${id}/edit-programme/`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Programme updated successfully');
        } catch (error) {
            console.error('Error updating programme:', error);
            alert('Error updating programme');
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
            <Typography variant="h6">Edit Programme</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Programme Name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                autoFocus
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="courses-label">Courses</InputLabel>
                <Select
                    labelId="courses-label"
                    id="courses"
                    name="courses"
                    multiple
                    value={formData.courses || []}
                    onChange={handleChange}
                >
                    {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                            {course.name}
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
                Update Programme
            </Button>
        </Box>
    );
};

export default EditProgrammeForm;
