// src/pages/extra-pages/DeleteAdminSearch.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Pagination } from '@mui/material';

const DeleteAdminSearch = () => {
    const { user } = useContext(AuthContext);
    const [admins, setAdmins] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (user) {
            fetchAdmins();
        }
    }, [user, page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchAdmins();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchAdmins = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/users/admins-by-school/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    search: search
                }
            });

            setAdmins(response.data);
        } catch (error) {
            setError('Failed to fetch admins');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this admin?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/accounts/users/${id}/delete-admin/`, {
                    headers: {
                        'Authorization': `Bearer ${user.authTokens.access}`
                    }
                });
                fetchAdmins(); // Refresh the list after deletion
            } catch (error) {
                setError('Failed to delete admin');
                console.error('Error deleting admin:', error);  // Debugging line
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
                            <TableCell>User School ID</TableCell>
                            <TableCell>Index Number</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>College</TableCell>
                            <TableCell>Faculty</TableCell>
                            <TableCell>Programme</TableCell>
                            <TableCell>User Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {admins.length > 0 ? (
                            admins.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell>{admin.user_school_id}</TableCell>
                                    <TableCell>{admin.index_number}</TableCell>
                                    <TableCell>{`${admin.first_name} ${admin.middle_name ? admin.middle_name + ' ' : ''}${admin.last_name}`}</TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>{admin.college ? admin.college.name : 'N/A'}</TableCell>
                                    <TableCell>{admin.faculty ? admin.faculty.name : 'N/A'}</TableCell>
                                    <TableCell>{admin.programme ? admin.programme.name : 'N/A'}</TableCell>
                                    <TableCell>{admin.user_type}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteClick(admin.id)} color="secondary">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <Typography align="center">No admins found</Typography>
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

export default DeleteAdminSearch;
