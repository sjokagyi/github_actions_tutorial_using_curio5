// src/pages/extra-pages/DeleteFacultySearch.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Pagination } from '@mui/material';

const DeleteFacultySearch = () => {
    const { user } = useContext(AuthContext);
    const [faculties, setFaculties] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (user) {
            fetchFaculties();
        }
    }, [user, page]);

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

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this faculty?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/accounts/faculties/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${user.authTokens.access}`
                    }
                });
                fetchFaculties(); // Refresh the list after deletion
            } catch (error) {
                setError('Failed to delete faculty');
                console.error('Error deleting faculty:', error);  // Debugging line
            }
        }
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
                        {faculties.length > 0 ? (
                            faculties.map((faculty) => (
                                <TableRow key={faculty.id}>
                                    <TableCell>{faculty.name}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteClick(faculty.id)} color="secondary">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography align="center">No faculties found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(event, value) => setPage(value)} 
                sx={{ marginTop: 2 }} 
            />
        </div>
    );
};

export default DeleteFacultySearch;
