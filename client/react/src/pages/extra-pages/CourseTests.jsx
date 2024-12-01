import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';

const CourseTests = () => {
    const { courseId } = useParams();
    const { user } = useContext(AuthContext);
    const [tests, setTests] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchTests();
        }
    }, [user, courseId]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTests();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchTests = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/questions/tests/`, {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    course: courseId,
                    search: search
                }
            });

            if (response.data && response.data.results) {
                setTests(response.data.results);
            } else {
                console.error('Error: Response data does not contain results', response.data);
                setTests([]); // Set to an empty array if the response does not contain results
            }
        } catch (error) {
            setError('Failed to fetch tests');
        } finally {
            setLoading(false);
        }
    };

    const handleViewClick = (id) => {
        navigate(`/dashboard/test-session/${id}`);
    };

    return (
        <div>
            <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                variant="outlined"
                fullWidth
                margin="normal"
            />

            {loading ? <CircularProgress /> : (
                <>
                    {error && <Typography color="error">{error}</Typography>}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Lecturer</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Start Time</TableCell>
                                    <TableCell>End Time</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tests.map((test) => (
                                    <TableRow key={test.id}>
                                        <TableCell>{test.title}</TableCell>
                                        <TableCell>{test.author}</TableCell>
                                        <TableCell>{test.max_time} mins</TableCell>
                                        <TableCell>{new Date(test.start_time).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(test.end_time).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleViewClick(test.id)}>Attempt Test</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </div>
    );
};

export default CourseTests;
