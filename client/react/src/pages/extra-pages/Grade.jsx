import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Grade = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-grade">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Grade
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create a new grade.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/edit-grade">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Grade
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Edit an existing grade.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-grade">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Grade
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete an existing grade.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Grade;
