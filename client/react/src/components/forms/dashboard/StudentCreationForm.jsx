import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const StudentForm = () => {
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
        primary_contact: '',
        secondary_contact: '',
        residence: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [colleges, setColleges] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            console.log("User found, fetching colleges...");
            fetchColleges();
        } else {
            console.log("User not found, user data:", user);
        }
    }, [user]);

    const fetchColleges = async () => {
        setLoading(true);
        setError(null);
        console.log("Fetching colleges for user:", user);

        if (!user || !user.authTokens || !user.authTokens.access || !user.school) {
            console.error("User or required data is missing.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/colleges/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    school: user.school.id  // Add school ID as a parameter
                }
            });
            console.log('Colleges response:', response.data); // Debugging line
            if (response.data && Array.isArray(response.data.results)) {
                setColleges(response.data.results);
            } else {
                setError('Unexpected response format for colleges');
            }
        } catch (error) {
            console.error('Error fetching colleges:', error);
            setError('Failed to fetch colleges');
        } finally {
            setLoading(false);
        }
    };

    const fetchFaculties = async (collegeId) => {
        console.log("Fetching faculties for collegeId:", collegeId);

        if (!user || !user.authTokens || !user.authTokens.access) {
            console.error("User or auth token is missing.");
            return;
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/colleges/${collegeId}/faculties/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            console.log('Faculties response:', response.data); // Debugging line
            if (response.data && Array.isArray(response.data)) {
                setFaculties(response.data);
            } else {
                setError('Unexpected response format for faculties');
            }
        } catch (error) {
            console.error('Error fetching faculties:', error);
            setError('Failed to fetch faculties');
        }
    };

    const fetchProgrammes = async (facultyId) => {
        console.log("Fetching programmes for facultyId:", facultyId);

        if (!user || !user.authTokens || !user.authTokens.access) {
            console.error("User or auth token is missing.");
            return;
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/faculties/${facultyId}/programmes/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            console.log('Programmes response:', response.data); // Debugging line
            if (response.data && Array.isArray(response.data)) {
                setProgrammes(response.data);
            } else {
                setError('Unexpected response format for programmes');
            }
        } catch (error) {
            console.error('Error fetching programmes:', error);
            setError('Failed to fetch programmes');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(`Form field changed: ${name} = ${value}`);

        if (name === 'college') {
            setFaculties([]);
            setProgrammes([]);
            fetchFaculties(value);
        } else if (name === 'faculty') {
            setProgrammes([]);
            fetchProgrammes(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);

        if (!user || !user.authTokens || !user.authTokens.access) {
            alert('User is not logged in or auth token is missing');
            return;
        }

        try {
            const decodedToken = jwtDecode(user.authTokens.access);
            if (decodedToken.exp * 1000 < Date.now()) {
                // Token has expired, attempt to refresh
                const newTokens = await loginUser(user.email, user.password);
                if (newTokens) {
                    user.authTokens.access = newTokens.access;
                } else {
                    alert('Session expired. Please log in again.');
                    return;
                }
            }

            const response = await axios.post('http://127.0.0.1:8000/api/accounts/users/create-student/', formData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });
            console.log(response.data);
            alert('Student created successfully');
            setFormData(initialFormData); // Clear the form after successful submission
        } catch (error) {
            console.error('Error creating student:', error);

            if (error.response && error.response.data) {
                alert('Error creating student: ' + JSON.stringify(error.response.data));
            } else {
                alert('Error creating student: ' + error.message);
            }
        }
    };

    if (loading) {
        console.log("Loading state: true");
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        console.error("Error state:", error);
        return <Typography color="error">{error}</Typography>;
    }

    console.log("Rendering form with data:", formData);

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6">Create Student</Typography>
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
                label="Student ID"
                name="user_school_id"
                value={formData.user_school_id}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="index_number"
                label="Index Number"
                name="index_number"
                value={formData.index_number}
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
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Create Student
            </Button>
        </Box>
    );
};

export default StudentForm;
