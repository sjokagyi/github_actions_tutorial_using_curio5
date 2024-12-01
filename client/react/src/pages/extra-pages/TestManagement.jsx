// src/pages/extra-pages/TestManagement.jsx
import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const TestManagement = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/tests">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Tests
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage tests.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/questions">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Questions
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage test questions.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/test-sessions">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Test Sessions
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage student test sessions.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/student-answers">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Student Answers
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage student test answers.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default TestManagement;
