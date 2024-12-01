import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const ViewTestSession = () => {
    const { user } = useContext(AuthContext);
    const { testId } = useParams();  // Get testId from the route parameters
    const [testSessions, setTestSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchTestSessions();
        }
    }, [user]);

    const fetchTestSessions = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/questions/studenttestsession/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    test_id: testId  // Pass testId as a query parameter
                }
            });
            console.log('Test sessions response:', response.data); // Debug log
            setTestSessions(response.data.results);  // Access the results array
        } catch (error) {
            console.error('Error fetching test sessions:', error);
            setError('Failed to fetch test sessions');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!Array.isArray(testSessions)) {
        return <Typography color="error">Unexpected data format</Typography>;
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Test Sessions
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Student</TableCell>
                            <TableCell>Test</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Total Marks</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {testSessions.map((session) => (
                            <TableRow key={session.id}>
                                <TableCell>{session.student.username}</TableCell>
                                <TableCell>{session.test.title}</TableCell>
                                <TableCell>{new Date(session.start_time).toLocaleString()}</TableCell>
                                <TableCell>{session.end_time ? new Date(session.end_time).toLocaleString() : 'In Progress'}</TableCell>
                                <TableCell>{session.total_marks}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ViewTestSession;