import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const College = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-college">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create College
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create a new college.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/edit-college">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit College
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Edit an existing college.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-college">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete College
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete an existing college.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default College;
