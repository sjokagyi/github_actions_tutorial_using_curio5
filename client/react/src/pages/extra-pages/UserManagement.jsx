// src/pages/extra-pages/UserManagement.jsx
import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const UserManagement = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/admin">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Admin
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage admin accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/staff">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Staff
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage staff accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/student">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Student
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage student accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default UserManagement;
