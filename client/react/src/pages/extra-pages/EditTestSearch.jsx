import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditTestSearch = () => {
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
    }, [user]);

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
            const response = await axios.get('http://127.0.0.1:8000/api/questions/tests/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    search: search
                }
            });

            const results = response.data.results;

            // Fetch related data
            const courseIds = results.map(test => test.course).filter(id => id);
            const authorIds = results.map(test => test.author).filter(id => id);

            const [coursesResponse, authorsResponse] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/accounts/courses/', { headers: { 'Authorization': `Bearer ${user.authTokens.access}` }, params: { ids: courseIds.join(',') } }),
                axios.get('http://127.0.0.1:8000/api/accounts/users/', { headers: { 'Authorization': `Bearer ${user.authTokens.access}` }, params: { ids: authorIds.join(',') } }),
            ]);

            const courses = Array.isArray(coursesResponse.data.results) ? coursesResponse.data.results : [];
            const authors = Array.isArray(authorsResponse.data.results) ? authorsResponse.data.results : [];

            const enrichedTests = results.map(test => ({
                ...test,
                course: courses.find(course => course.id === test.course) || { code: 'Unknown', name: 'Unknown' },
                author: authors.find(author => author.id === test.author) || { username: 'Unknown' },
            }));

            setTests(enrichedTests);
        } catch (error) {
            console.error('Error fetching tests:', error);
            setError('Failed to fetch tests');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (id) => {
        navigate(`/dashboard/edit-test/${id}`);
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

            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Type of Test</TableCell>
                            <TableCell>Max Time</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Date Created</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tests.map((test) => (
                            <TableRow key={test.id}>
                                <TableCell>{test.title}</TableCell>
                                <TableCell>{`${test.course.code} | ${test.course.name}`}</TableCell>
                                <TableCell>{test.author.username}</TableCell>
                                <TableCell>{test.test_type}</TableCell>
                                <TableCell>{test.max_time}</TableCell>
                                <TableCell>{new Date(test.start_time).toLocaleString()}</TableCell>
                                <TableCell>{new Date(test.end_time).toLocaleString()}</TableCell>
                                <TableCell>{new Date(test.date_created).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEditClick(test.id)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default EditTestSearch;
