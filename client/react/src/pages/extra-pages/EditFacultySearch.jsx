import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditFacultySearch = () => {
    const { user } = useContext(AuthContext);
    const [faculties, setFaculties] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchFaculties();
        }
    }, [user]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchFaculties();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchFaculties = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/faculties/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    search: search,
                    school: user.school.id
                }
            });

            setFaculties(response.data.results);
        } catch (error) {
            setError('Failed to fetch faculties');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (id) => {
        navigate(`/dashboard/edit-faculty/${id}`);
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
                            <TableCell>Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {faculties.map((faculty) => (
                            <TableRow key={faculty.id}>
                                <TableCell>{faculty.name}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEditClick(faculty.id)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default EditFacultySearch;
