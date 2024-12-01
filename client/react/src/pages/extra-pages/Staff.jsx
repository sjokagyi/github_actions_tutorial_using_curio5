import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Staff = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-staff">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Staff Accounts
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create new staff accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-staff-bulk">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Staff Accounts in Bulk
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create multiple staff accounts at once.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/edit-staff">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Staff Accounts
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Edit existing staff accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-staff">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Staff Accounts
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete existing staff accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-staff-bulk">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Staff Accounts in Bulk
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete existing staff accounts in bulk.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Staff;
