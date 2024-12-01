// src/pages/extra-pages/DeleteStaffSearch.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Pagination } from '@mui/material';

const DeleteStaffSearch = () => {
    const { user } = useContext(AuthContext);
    const [staff, setStaff] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (user) {
            fetchStaff();
        }
    }, [user, page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchStaff();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchStaff = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/users/teachers-by-school/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    search: search
                }
            });

            setStaff(response.data);
        } catch (error) {
            setError('Failed to fetch staff');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this staff?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/accounts/users/${id}/delete-teacher/`, {
                    headers: {
                        'Authorization': `Bearer ${user.authTokens.access}`
                    }
                });
                fetchStaff(); // Refresh the list after deletion
            } catch (error) {
                setError('Failed to delete staff');
                console.error('Error deleting staff:', error);  // Debugging line
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
                        {staff.length > 0 ? (
                            staff.map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell>{staff.user_school_id}</TableCell>
                                    <TableCell>{staff.index_number}</TableCell>
                                    <TableCell>{`${staff.first_name} ${staff.middle_name ? staff.middle_name + ' ' : ''}${staff.last_name}`}</TableCell>
                                    <TableCell>{staff.email}</TableCell>
                                    <TableCell>{staff.college ? staff.college.name : 'N/A'}</TableCell>
                                    <TableCell>{staff.faculty ? staff.faculty.name : 'N/A'}</TableCell>
                                    <TableCell>{staff.programme ? staff.programme.name : 'N/A'}</TableCell>
                                    <TableCell>{staff.user_type}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteClick(staff.id)} color="secondary">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <Typography align="center">No staff found</Typography>
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

export default DeleteStaffSearch;
