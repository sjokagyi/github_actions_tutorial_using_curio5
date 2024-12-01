import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Admin = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-admin">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Admin Accounts
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create new admin accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-admin-bulk">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Admin Accounts in Bulk
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create new admin accounts in bulk.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/edit-admin">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Admin Accounts
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Edit existing admin accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-admin">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Admin Accounts
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete existing admin accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-admin-bulk">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Admin Accounts in Bulk.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete existing admin accounts in bulk.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Admin;
