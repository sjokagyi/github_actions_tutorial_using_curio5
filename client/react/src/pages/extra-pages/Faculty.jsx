import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Faculty = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-faculty">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Faculty
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create a new faculty.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/edit-faculty">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Faculty
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Edit an existing faculty.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-faculty">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Faculty
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete an existing faculty.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Faculty;
