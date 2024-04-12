import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Paper, Container, } from '@mui/material';
import RecentSurgeries from '../FFCompos/RecentSurgeries';
import FullSyllabus from '../FFCompos/FullSyllabus';
import MenuLogo from '../FFCompos/MenuLogo';
import InternshipYearTimeLine from './InternshipYearTimeLine';
import '/src/CSS/InternPageStyles.css';
//-----------------------------------------
export default function InternPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));


  const handleViewFullSyllabus = () => {
    navigate('/TableFullSyllabus');
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <>
      <MenuLogo />
      <Container sx={{ maxWidth: '100%', mb: 3, mt: 8 }} >
        <Grid container spacing={2} alignItems="center">
          <Paper className="welcomePaper">
            <Typography variant="h6" style={{ marginBottom: 16, textAlign: 'right', fontWeight: 'bold' }}>
              👋 ברוך הבא, {currentUser.first_name}
            </Typography>
          </Paper>

          <Paper className="welcomePaper">
            <InternshipYearTimeLine />
          </Paper>

          <Paper className="welcomePaper">
            <FullSyllabus />
          </Paper>

          <Button variant="contained" onClick={handleViewFullSyllabus} style={{ margin: "auto" }} >
            צפייה בסילבוס המלא
          </Button>

          <Paper className="welcomePaper">
            <RecentSurgeries />
          </Paper>

          <Button variant="contained" onClick={handleBackToLogin} style={{ margin: "auto" }}>
            Back to Login
          </Button>
        </Grid>
      </Container >
    </>
  );
}
