// EditStaffForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const EditStaffForm = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({});
    const [colleges, setColleges] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchStaff();
            fetchColleges();
        }
    }, [user]);

    const fetchStaff = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/users/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
            setError('Failed to fetch staff');
        } finally {
            setLoading(false);
        }
    };

    const fetchColleges = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/colleges/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    school: user.school.id
                }
            });
            setColleges(response.data.results);
        } catch (error) {
            console.error('Error fetching colleges:', error);
            setError('Failed to fetch colleges');
        }
    };

    const fetchFaculties = async (collegeId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/colleges/${collegeId}/faculties/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            setFaculties(response.data);
        } catch (error) {
            console.error('Error fetching faculties:', error);
            setError('Failed to fetch faculties');
        }
    };

    const fetchProgrammes = async (facultyId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/faculties/${facultyId}/programmes/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            setProgrammes(response.data);
        } catch (error) {
            console.error('Error fetching programmes:', error);
            setError('Failed to fetch programmes');
        }
    };

    const fetchCourses = async (programmeId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/programmes/${programmeId}/courses/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to fetch courses');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'college') {
            setFaculties([]);
            setProgrammes([]);
            setCourses([]);
            fetchFaculties(value);
        } else if (name === 'faculty') {
            setProgrammes([]);
            setCourses([]);
            fetchProgrammes(value);
        } else if (name === 'programme') {
            setCourses([]);
            fetchCourses(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:8000/api/accounts/users/${id}/edit-teacher/`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Staff updated successfully');
        } catch (error) {
            console.error('Error updating staff:', error);
            alert('Error updating staff');
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
            <Typography variant="h6">Edit Staff</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={formData.username || ''}
                onChange={handleChange}
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password || ''}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="first_name"
                label="First Name"
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="middle_name"
                label="Middle Name"
                name="middle_name"
                value={formData.middle_name || ''}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                value={formData.last_name || ''}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="user_school_id"
                label="Staff ID"
                name="user_school_id"
                value={formData.user_school_id || ''}
                onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="college-label">College</InputLabel>
                <Select
                    labelId="college-label"
                    id="college"
                    name="college"
                    value={formData.college || ''}
                    onChange={handleChange}
                >
                    {colleges.map((college) => (
                        <MenuItem key={college.id} value={college.id}>
                            {college.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel id="faculty-label">Faculty</InputLabel>
                <Select
                    labelId="faculty-label"
                    id="faculty"
                    name="faculty"
                    value={formData.faculty || ''}
                    onChange={handleChange}
                    disabled={!faculties.length}
                >
                    {faculties.map((faculty) => (
                        <MenuItem key={faculty.id} value={faculty.id}>
                            {faculty.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel id="programme-label">Programme</InputLabel>
                <Select
                    labelId="programme-label"
                    id="programme"
                    name="programme"
                    value={formData.programme || ''}
                    onChange={handleChange}
                    disabled={!programmes.length}
                >
                    {programmes.map((programme) => (
                        <MenuItem key={programme.id} value={programme.id}>
                            {programme.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel id="courses-label">Courses</InputLabel>
                <Select
                    labelId="courses-label"
                    id="courses"
                    name="courses"
                    multiple
                    value={formData.courses || []}
                    onChange={handleChange}
                    disabled={!courses.length}
                >
                    {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                            {course.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                margin="normal"
                fullWidth
                id="primary_contact"
                label="Primary Contact"
                name="primary_contact"
                value={formData.primary_contact || ''}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="secondary_contact"
                label="Secondary Contact"
                name="secondary_contact"
                value={formData.secondary_contact || ''}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="residence"
                label="Residence"
                name="residence"
                value={formData.residence || ''}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="index_number"
                label="Index Number"
                name="index_number"
                value={formData.index_number || ''}
                onChange={handleChange}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Update Staff
            </Button>
        </Box>
    );
};

export default EditStaffForm;
