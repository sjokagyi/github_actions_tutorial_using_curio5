import React, { useEffect, useState, useContext } from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, CircularProgress, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext'; // Import the AuthContext

const StudentTest = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { authTokens } = useContext(AuthContext); // Get the auth tokens from AuthContext

    useEffect(() => {
        const fetchCourses = async () => {
            if (!authTokens) {
                console.error('User is not authenticated');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/accounts/users/student_courses/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                setCourses(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, [authTokens]);

    const handleCourseClick = (courseId) => {
        navigate(`/dashboard/courses/${courseId}/tests`);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCourses = courses.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <TextField
                label="Search Courses"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <Grid container spacing={3}>
                {filteredCourses.map(course => (
                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                        <Card>
                            <CardActionArea onClick={() => handleCourseClick(course.id)}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {course.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {course.code}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default StudentTest;
