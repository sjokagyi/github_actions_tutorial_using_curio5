// src/pages/extra-pages/StudentAnswers.jsx
import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const StudentAnswers = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/student-answers/create">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Student Answers
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/student-answers/edit">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Student Answers
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/student-answers/delete">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Student Answers
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/student-answers/view">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                View Student Answers
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default StudentAnswers;
