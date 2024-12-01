import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Student = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-student">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Student Accounts
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create new student accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-student-bulk">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Student Accounts in Bulk
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create multiple student accounts at once.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/edit-student">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Student Accounts
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Edit existing student accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-student">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Student Accounts
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete existing student accounts.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-student-bulk">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Student Accounts in Bulk
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete existing student accounts in bulk.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Student;
