// CreateStaff.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import TeacherForm from 'components/forms/dashboard/TeacherCreationForm';

const CreateStaff = () => {
    return (
        <MainCard title="Create Staff">
            <Typography variant="body2" sx={{ mb: 2 }}>
                Use the form below to create a new teacher and associate them with your current school.
            </Typography>
            <TeacherForm />
        </MainCard>
    );
};

export default CreateStaff;
