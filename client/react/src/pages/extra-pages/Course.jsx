import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Course = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-course">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Course
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create a new course.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/edit-course">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Course
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Edit an existing course.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-course">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Course
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete an existing course.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Course;
