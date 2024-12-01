import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditTermSearch = () => {
    const { user } = useContext(AuthContext);
    const [terms, setTerms] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchTerms();
        }
    }, [user]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTerms();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchTerms = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/terms/', {
                headers: {
                    'Authorization': `Bearer ${user.authTokens.access}`
                },
                params: {
                    search: search,
                    school: user.school.id
                }
            });

            setTerms(response.data.results);
        } catch (error) {
            setError('Failed to fetch terms');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (id) => {
        navigate(`/dashboard/edit-term/${id}`);
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
                            <TableCell>Term</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {terms.map((term) => (
                            <TableRow key={term.id}>
                                <TableCell>{term.term}</TableCell>
                                <TableCell>{term.start_date}</TableCell>
                                <TableCell>{term.end_date}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEditClick(term.id)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default EditTermSearch;
