// src/pages/extra-pages/ResultsPage.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { CircularProgress, Typography, Grid, Paper, Box } from '@mui/material';

const ResultsPage = () => {
    const { test_session_id } = useParams(); // Updated to use test_session_id
    const { user } = useContext(AuthContext);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/questions/test-sessions/${test_session_id}/test-result/`, {
                    headers: {
                        'Authorization': `Bearer ${user.authTokens.access}`
                    }
                });
                setResults(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch test results');
                setLoading(false);
            }
        };

        fetchResults();
    }, [test_session_id, user]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Test Results
            </Typography>
            <Grid container spacing={3}>
                {results.map((result, index) => (
                    <Grid item xs={12} key={result.id}>
                        <Paper style={{ padding: 16 }}>
                            <Typography variant="h6">
                                {index + 1}. {result.content}
                            </Typography>
                            <Box>
                                <Typography variant="subtitle1">
                                    Your Answer: {result.student_answer ? result.student_answer.text_answer || result.student_answer.selected_choice.content : 'No answer'}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Correct Answer: {result.correct_answer}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ResultsPage;
