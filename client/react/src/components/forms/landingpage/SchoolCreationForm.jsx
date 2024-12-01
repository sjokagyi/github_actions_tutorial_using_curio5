// src/components/forms/SchoolCreationForm.jsx
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const SchoolCreationForm = ({ onSubmit, error }) => {
    const [name, setName] = useState('');
    const [schoolType, setSchoolType] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ name, school_type: schoolType, address });
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="School Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="school-type-label">School Type</InputLabel>
                <Select
                    labelId="school-type-label"
                    value={schoolType}
                    onChange={(e) => setSchoolType(e.target.value)}
                    label="School Type"
                    required
                >
                    <MenuItem value="K12">K12</MenuItem>
                    <MenuItem value="Tertiary">Tertiary</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Address"
                variant="outlined"
                fullWidth
                margin="normal"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            />
            {error && (
                <Typography variant="body2" color="error" gutterBottom>
                    {error}
                </Typography>
            )}
            <Button type="submit" variant="contained" color="primary">
                Create School
            </Button>
        </form>
    );
};

export default SchoolCreationForm;
