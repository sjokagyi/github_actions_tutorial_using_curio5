// src/pages/extra-pages/Tests.jsx
import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Tests = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-test">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Tests
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/edit-test">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Tests
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/tests/mark">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Mark Tests
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/tests/delete">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Tests
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/view-test">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                View Tests
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Tests;
