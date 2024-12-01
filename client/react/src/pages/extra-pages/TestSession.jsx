import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import {
    CircularProgress, Typography, Button, Grid, Paper, Radio, RadioGroup,
    FormControlLabel, Box, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TextField
} from '@mui/material';

const TestSession = () => {
    const { testId } = useParams();
    const { user } = useContext(AuthContext);
    const [testDetails, setTestDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0);
    const [initialTime, setInitialTime] = useState(0);
    const [answers, setAnswers] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const startTestSession = async () => {
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/questions/testsessions/${testId}/start_test/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${user.authTokens.access}`
                    }
                });
                setTestDetails(response.data);
                setRemainingTime(response.data.remaining_time);
                setInitialTime(response.data.remaining_time);
                setLoading(false);
            } catch (error) {
                setError('Failed to start test session');
                setLoading(false);
            }
        };

        startTestSession();
    }, [testId, user]);

    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 60000);

            return () => clearInterval(timer);
        } else if (remainingTime === 0) {
            handleSubmit();
        }
    }, [remainingTime]);

    const handleChange = (questionId, choiceId, isText = false, text = '') => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: isText ? { text_answer: text } : { choice_id: choiceId },
        }));
    };

    const handleSubmit = async () => {
        const confirmed = openDialog || window.confirm("Are you sure you want to submit the test?");
        if (!confirmed) return;

        setOpenDialog(false);

        const formattedAnswers = Object.keys(answers).map(questionId => {
            const answer = answers[questionId];
            return {
                question_sequence_number: parseInt(questionId),
                ...answer.choice_id && { choice_sequence_number: answer.choice_id },
                ...answer.text_answer && { text_answer: answer.text_answer }
            };
        });

        const submissionData = {
            test_id: testDetails.id,
            test_session_id: testDetails.test_session_id,
            answers: formattedAnswers
        };

        try {
            await axios.post('http://127.0.0.1:8000/api/questions/submittest/', submissionData, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                }
            });

            if (testDetails.auto_mark) {
                navigate(`/dashboard`);
            } else {
                alert('Test submitted successfully!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit the test.');
        }
    };

    const getRemainingTimeColor = () => {
        if (remainingTime <= initialTime / 10) {
            return 'red';
        } else if (remainingTime <= initialTime / 2) {
            return 'yellow';
        }
        return 'inherit';
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>
                    {testDetails.title}
                </Typography>
                <Typography variant="subtitle1" gutterBottom style={{ color: getRemainingTimeColor() }}>
                    Remaining Time: {remainingTime} minutes
                </Typography>
            </Box>
            <Grid container spacing={3}>
                {testDetails.questions.map((question, index) => (
                    <Grid item xs={12} key={question.id}>
                        <Paper style={{ padding: 16 }}>
                            <Typography variant="h6">
                                {index + 1}. {question.content}
                            </Typography>
                            {['MCQ', 'TF'].includes(question.question_type) ? (
                                <RadioGroup onChange={(e) => handleChange(question.sequence_number, parseInt(e.target.value))}>
                                    {question.choices.map((choice) => (
                                        <Paper key={choice.id} style={{ padding: 8, marginTop: 8 }}>
                                            <FormControlLabel
                                                value={choice.sequence_number}
                                                control={<Radio />}
                                                label={choice.content}
                                            />
                                        </Paper>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    onChange={(e) => handleChange(question.sequence_number, null, true, e.target.value)}
                                />
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
                style={{ marginTop: '20px' }}
            >
                Submit
            </Button>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to submit the test?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={handleSubmit} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TestSession;
