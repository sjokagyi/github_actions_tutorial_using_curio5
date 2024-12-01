// CreateStudent.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import StudentForm from 'components/forms/dashboard/StudentCreationForm';

const CreateStudent = () => {
    return (
        <MainCard title="Create Student">
            <Typography variant="body2" sx={{ mb: 2 }}>
                Use the form below to create a new student and associate them with your current school.
            </Typography>
            <StudentForm />
        </MainCard>
    );
};

export default CreateStudent;
