import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const EditCourseForm = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({});
    const [grades, setGrades] = useState([]);
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchCourse();
            fetchGrades();
            fetchTerms();
        }
    }, [user]);

    const fetchCourse = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/courses/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching course:', error);
            setError('Failed to fetch course');
        } finally {
            setLoading(false);
        }
    };

    const fetchGrades = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/grades/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    school: user.school.id
                }
            });
            setGrades(response.data.results);
        } catch (error) {
            console.error('Error fetching grades:', error);
            setError('Failed to fetch grades');
        }
    };

    const fetchTerms = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/terms/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    school: user.school.id
                }
            });
            setTerms(response.data.results);
        } catch (error) {
            console.error('Error fetching terms:', error);
            setError('Failed to fetch terms');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:8000/api/accounts/courses/${id}/edit-course/`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Course updated successfully');
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Error updating course');
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
            <Typography variant="h6">Edit Course</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Course Name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="code"
                label="Course Code"
                name="code"
                value={formData.code || ''}
                onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="grades-label">Grades</InputLabel>
                <Select
                    labelId="grades-label"
                    id="grades"
                    name="grades"
                    multiple
                    value={formData.grades || []}
                    onChange={handleChange}
                >
                    {grades.map((grade) => (
                        <MenuItem key={grade.id} value={grade.id}>
                            {grade.grade}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel id="terms-label">Terms</InputLabel>
                <Select
                    labelId="terms-label"
                    id="terms"
                    name="terms"
                    multiple
                    value={formData.terms || []}
                    onChange={handleChange}
                >
                    {terms.map((term) => (
                        <MenuItem key={term.id} value={term.id}>
                            {term.term}
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
                Update Course
            </Button>
        </Box>
    );
};

export default EditCourseForm;
