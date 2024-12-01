import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const AcademicYear = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/create-academic-year">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Academic Year
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create a new academic year.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/edit-academicyear">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Edit Academic year
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Edit an existing academic year.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardActionArea component={Link} to="/dashboard/delete-academicyear">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Delete Academic Year
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Delete an existing academic year.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AcademicYear;
