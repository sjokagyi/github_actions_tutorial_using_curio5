import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from 'contexts/auth-reducer/AuthContext';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Pagination } from '@mui/material';

const DeleteTermSearch = () => {
    const { user } = useContext(AuthContext);
    const [terms, setTerms] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (user) {
            fetchTerms();
        }
    }, [user, page]);

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
                    school: user.school.id,
                    page: page
                }
            });

            setTerms(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            setError('Failed to fetch terms');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this term?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/accounts/terms/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${user.authTokens.access}`
                    }
                });
                fetchTerms(); // Refresh the list after deletion
            } catch (error) {
                setError('Failed to delete term');
                console.error('Error deleting term:', error);  // Debugging line
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
                        {terms.length > 0 ? (
                            terms.map((term) => (
                                <TableRow key={term.id}>
                                    <TableCell>{term.name}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteClick(term.id)} color="secondary">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography align="center">No terms found</Typography>
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

export default DeleteTermSearch;
