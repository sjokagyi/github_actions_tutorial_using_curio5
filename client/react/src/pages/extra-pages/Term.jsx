import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Term = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-term">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Term
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create a new term.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/edit-term">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Term
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Edit an existing term.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-term">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Term
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete an existing term.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Term;
