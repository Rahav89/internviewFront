import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Paper, Container, } from '@mui/material';
import RecentSurgeries from '../FFCompos/RecentSurgeries';
import FullSyllabus from '../FFCompos/FullSyllabus';
import MenuLogo from '../FFCompos/MenuLogo';
import InternshipYearTimeLine from './InternshipYearTimeLine';

export default function InternPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));


  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <>
      <MenuLogo />
      <Container sx={{ maxWidth: '100%', mb: 3, mt: 8 }} >
        <Grid container spacing={2} alignItems="center">
          <Paper sx={{
            p: 2, m: 2, backgroundColor: '#FFFAFA',
            display: 'inline-block',
            width: '100%', // Set the width to 100% to occupy the full line
          }}>
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'right' }}>
              ברוך הבא, {currentUser ? currentUser.first_name : 'Guest'}👋
            </Typography>
          </Paper>

          <Paper sx={{
            p: 2, m: 2, backgroundColor: '#FFFAFA', display: 'inline-block',
            width: '100%',
          }}>
            <InternshipYearTimeLine />
          </Paper>

          <Paper sx={{
            p: 2, m: 2, backgroundColor: '#FFFAFA',
            display: 'inline-block',
            width: '100%', // Set the width to 100% to occupy the full line
          }}>
            <FullSyllabus />
          </Paper>

          <Paper sx={{
            p: 2, m: 2, backgroundColor: '#FFFAFA',
            display: 'inline-block',
            width: '100%', // Set the width to 100% to occupy the full line
          }}>
            <RecentSurgeries />
          </Paper>

          <Button variant="contained" onClick={handleBackToLogin} style={{ margin: "auto" }} >
            Back to Login
          </Button>
        </Grid>
      </Container>
    </>
  );
}
