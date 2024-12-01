import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const SchoolManagement = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/college">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                College
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage college information.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/faculty">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Faculty
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage faculty information.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/programme">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Programme
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage programme information.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/course">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Course
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage course information.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/academic-year">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Academic Year
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage academic year information.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/grade">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Grade
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage grade information.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/term">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Term
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage term information.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default SchoolManagement;
