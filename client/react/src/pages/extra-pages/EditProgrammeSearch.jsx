import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditProgrammeSearch = () => {
    const { user } = useContext(AuthContext);
    const [programmes, setProgrammes] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchProgrammes();
        }
    }, [user]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProgrammes();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchProgrammes = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/programmes/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    search: search,
                    school: user.school.id
                }
            });

            setProgrammes(response.data.results);
        } catch (error) {
            setError('Failed to fetch programmes');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (id) => {
        navigate(`/dashboard/edit-programme/${id}`);
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
                        {programmes.map((programme) => (
                            <TableRow key={programme.id}>
                                <TableCell>{programme.name}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEditClick(programme.id)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default EditProgrammeSearch;
