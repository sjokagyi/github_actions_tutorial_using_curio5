// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import StudentForm from 'components/forms/dashboard/StudentCreationForm';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  return (
    <MainCard title="Sample Card">
      <Typography variant="body2" sx={{ mb: 2 }}>
        Use the form below to create a new student and associate them with your current school.
      </Typography>
      <StudentForm />
    </MainCard>
  );
}
