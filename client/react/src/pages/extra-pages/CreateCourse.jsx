import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CreateCourse = () => {
    const { user } = useContext(AuthContext);

    const initialFormData = {
        name: '',
        code: '',
        grade: '',
        term: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [grades, setGrades] = useState([]); // Initialize as an empty array
    const [terms, setTerms] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchGradesAndTerms();
        }
    }, [user]);

    const fetchGradesAndTerms = async () => {
        setLoading(true);
        setError(null);
        try {
            const gradesResponse = await axios.get(`http://127.0.0.1:8000/api/accounts/grades/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    school: user.school.id
                }
            });

            console.log("Grades response:", gradesResponse.data);

            const termsResponse = await axios.get(`http://127.0.0.1:8000/api/accounts/terms/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    school: user.school.id
                }
            });

            console.log("Terms response:", termsResponse.data);

            setGrades(Array.isArray(gradesResponse.data) ? gradesResponse.data : []); // Ensure it's an array
            setTerms(Array.isArray(termsResponse.data) ? termsResponse.data : []); // Ensure it's an array
        } catch (error) {
            console.error('Error fetching grades or terms:', error);
            setError('Failed to fetch grades or terms');
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
        if (!user || !user.authTokens || !user.authTokens.access) {
            alert('User is not logged in or auth token is missing');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/courses/create-course/', formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Course created successfully');
            setFormData(initialFormData);
        } catch (error) {
            console.error('Error creating course:', error);
            setError('Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6">Create Course</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Course Name"
                name="name"
                value={formData.name}
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
                value={formData.code}
                onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="grades-label">Grades</InputLabel>
                <Select
                    labelId="grades-label"
                    id="grades"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                >
                    {Array.isArray(grades) && grades.map((grade) => (
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
                    name="term"
                    value={formData.term}
                    onChange={handleChange}
                >
                    {Array.isArray(terms) && terms.map((term) => (
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
                disabled={loading}
            >
                Create Course
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default CreateCourse;
