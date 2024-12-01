import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { CircularProgress, Typography, Grid, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentAssessmentAnalytics = () => {
    const { user } = useContext(AuthContext);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/analytics/student-analytics/', {
                    headers: {
                        'Authorization': `Bearer ${user.authTokens.access}`
                    }
                });
                setAnalyticsData(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch analytics data');
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [user]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper style={{ padding: 16 }}>
                    <Typography variant="h5">Assessment Analytics</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={analyticsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="test_id" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="average_score" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
            {/* Add more charts and tables as needed */}
        </Grid>
    );
};

export default StudentAssessmentAnalytics;
