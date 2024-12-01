import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditGradeSearch = () => {
    const { user } = useContext(AuthContext);
    const [grades, setGrades] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchGrades();
        }
    }, [user]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchGrades();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchGrades = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/grades/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    search: search,
                    school: user.school.id
                }
            });

            setGrades(response.data.results);
        } catch (error) {
            setError('Failed to fetch grades');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (id) => {
        navigate(`/dashboard/edit-grade/${id}`);
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
                            <TableCell>Grade</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {grades.map((grade) => (
                            <TableRow key={grade.id}>
                                <TableCell>{grade.grade}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEditClick(grade.id)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default EditGradeSearch;
