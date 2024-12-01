import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditStaffSearch = () => {
    const { user } = useContext(AuthContext);
    const [staffs, setStaffs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchStaffs();
        }
    }, [user]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchStaffs();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchStaffs = async () => {
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

            setStaffs(response.data);
        } catch (error) {
            setError('Failed to fetch staffs');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (id) => {
        navigate(`/dashboard/edit-staff/${id}`);
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
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>User Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staffs.map((staff) => (
                            <TableRow key={staff.id}>
                                <TableCell>{staff.user_school_id}</TableCell>
                                <TableCell>{`${staff.first_name} ${staff.middle_name ? staff.middle_name + ' ' : ''}${staff.last_name}`}</TableCell>
                                <TableCell>{staff.email}</TableCell>
                                <TableCell>{staff.user_type}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEditClick(staff.id)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default EditStaffSearch;
