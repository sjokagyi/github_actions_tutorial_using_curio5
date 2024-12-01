// src/pages/extra-pages/TestSessions.jsx
import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const TestSessions = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/test-sessions/create">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Test Sessions
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/test-sessions/edit">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Test Sessions
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/test-sessions/delete">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Test Sessions
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/test-sessions/view">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                View Test Sessions
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default TestSessions;
