import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Programme = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-programme">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Programme
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create a new programme.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/edit-Programme">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Programme
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Edit an existing programme.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-programme">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete programme
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete an existing programme.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Programme;
