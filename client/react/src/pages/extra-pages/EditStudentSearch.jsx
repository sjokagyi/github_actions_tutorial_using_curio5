import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditStudentSearch = () => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchStudents();
        }
    }, [user]);

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

    const handleEditClick = (id) => {
        navigate(`/dashboard/edit-student/${id}`);
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
                        {students.map((student) => (
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
                                    <Button onClick={() => handleEditClick(student.id)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default EditStudentSearch;
