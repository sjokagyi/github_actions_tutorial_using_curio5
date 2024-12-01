import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CreateProgramme = () => {
    const { user } = useContext(AuthContext);

    const initialFormData = {
        name: '',
        courses: []
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (user) {
            fetchCourses();
        }
    }, [user]);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/courses/`, {
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
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCoursesChange = (event) => {
        setFormData({ ...formData, courses: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.authTokens || !user.authTokens.access) {
            alert('User is not logged in or auth token is missing');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/programmes/create-programme/', formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Programme created successfully');
            setFormData(initialFormData);
        } catch (error) {
            console.error('Error creating programme:', error);
            setError('Failed to create programme');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6">Create Programme</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Programme Name"
                name="name"
                value={formData.name}
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
                    value={formData.courses}
                    onChange={handleCoursesChange}
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
                disabled={loading}
            >
                Create Programme
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default CreateProgramme;
