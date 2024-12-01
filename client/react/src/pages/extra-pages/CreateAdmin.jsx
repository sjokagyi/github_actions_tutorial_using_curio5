// CreateAdmin.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import AdminForm from 'components/forms/dashboard/AdminCreationForm';

const CreateAdmin = () => {
    return (
        <MainCard title="Create Admin">
            <Typography variant="body2" sx={{ mb: 2 }}>
                Use the form below to create a new admin and associate them with your current school.
            </Typography>
            <AdminForm />
        </MainCard>
    );
};

export default CreateAdmin;
