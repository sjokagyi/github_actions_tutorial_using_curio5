import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Pagination } from '@mui/material';

const DeleteStudentSearch = () => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchStudents();
        }
    }, [user, page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchStudents();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/users/students-by-school/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    search: search
                }
            });

            setStudents(response.data);
        } catch (error) {
            setError('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/accounts/users/${id}/delete-student/`, {
                    headers: {
                        'Authorization': `Bearer ${user.authTokens.access}`
                    }
                });
                fetchStudents(); // Refresh the list after deletion
            } catch (error) {
                setError('Failed to delete student');
                console.error('Error deleting student:', error);  // Debugging line
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
                        {students.length > 0 ? (
                            students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.user_school_id}</TableCell>
                                    <TableCell>{student.index_number}</TableCell>
                                    <TableCell>{`${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.last_name}`}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{student.college ? student.college.name : 'N/A'}</TableCell>
                                    <TableCell>{student.faculty ? student.faculty.name : 'N/A'}</TableCell>
                                    <TableCell>{student.programme ? student.programme.name : 'N/A'}</TableCell>
                                    <TableCell>{student.user_type}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteClick(student.id)} color="secondary">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <Typography align="center">No students found</Typography>
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

export default DeleteStudentSearch;
