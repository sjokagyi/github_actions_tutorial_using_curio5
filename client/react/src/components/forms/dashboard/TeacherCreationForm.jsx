import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const TeacherForm = () => {
    const { user, loginUser } = useContext(AuthContext);

    const initialFormData = {
        username: '',
        email: '',
        password: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        user_school_id: '',
        index_number: '',
        college: '',
        faculty: '',
        programme: '',
        courses: [],
        primary_contact: '',
        secondary_contact: '',
        residence: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [colleges, setColleges] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchColleges();
        }
    }, [user]);

    const fetchColleges = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/colleges/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    school: user.school.id
                }
            });
            if (response.data && Array.isArray(response.data.results)) {
                setColleges(response.data.results);
            } else {
                setError('Unexpected response format for colleges');
            }
        } catch (error) {
            setError('Failed to fetch colleges');
        } finally {
            setLoading(false);
        }
    };

    const fetchFaculties = async (collegeId) => {
        if (!user) return;
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/colleges/${collegeId}/faculties/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            if (response.data && Array.isArray(response.data)) {
                setFaculties(response.data);
            } else {
                setError('Unexpected response format for faculties');
            }
        } catch (error) {
            setError('Failed to fetch faculties');
        }
    };

    const fetchProgrammes = async (facultyId) => {
        if (!user) return;
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/faculties/${facultyId}/programmes/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            if (response.data && Array.isArray(response.data)) {
                setProgrammes(response.data);
            } else {
                setError('Unexpected response format for programmes');
            }
        } catch (error) {
            setError('Failed to fetch programmes');
        }
    };

    const fetchCourses = async (programmeId) => {
        if (!user) return;
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/programmes/${programmeId}/courses/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            if (response.data && Array.isArray(response.data)) {
                setCourses(response.data);
            } else {
                setError('Unexpected response format for courses');
            }
        } catch (error) {
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

    const handleCoursesChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormData({ ...formData, courses: typeof value === 'string' ? value.split(',') : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.authTokens || !user.authTokens.access) {
            alert('User is not logged in or auth token is missing');
            return;
        }

        try {
            const decodedToken = jwtDecode(user.authTokens.access);
            if (decodedToken.exp * 1000 < Date.now()) {
                const newTokens = await loginUser(user.email, user.password);
                if (newTokens) {
                    user.authTokens.access = newTokens.access;
                } else {
                    alert('Session expired. Please log in again.');
                    return;
                }
            }

            const response = await axios.post('http://127.0.0.1:8000/api/accounts/users/create-teacher/', formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            alert('Teacher created successfully');
            setFormData(initialFormData);
        } catch (error) {
            if (error.response && error.response.data) {
                alert('Error creating teacher: ' + JSON.stringify(error.response.data));
            } else {
                alert('Error creating teacher: ' + error.message);
            }
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
            <Typography variant="h6">Create Teacher</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={formData.username}
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
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="first_name"
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="middle_name"
                label="Middle Name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="user_school_id"
                label="Staff ID"
                name="user_school_id"
                value={formData.user_school_id}
                onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="college-label">College</InputLabel>
                <Select
                    labelId="college-label"
                    id="college"
                    name="college"
                    value={formData.college}
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
                    value={formData.faculty}
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
                    value={formData.programme}
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
                    value={formData.courses}
                    onChange={handleCoursesChange}
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
                value={formData.primary_contact}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="secondary_contact"
                label="Secondary Contact"
                name="secondary_contact"
                value={formData.secondary_contact}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="residence"
                label="Residence"
                name="residence"
                value={formData.residence}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="index_number"
                label="Index Number"
                name="index_number"
                value={formData.index_number}
                onChange={handleChange}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Create Teacher
            </Button>
        </Box>
    );
};

export default TeacherForm;
