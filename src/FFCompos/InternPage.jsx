import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Paper, Container } from '@mui/material';
import RecentSurgeries from '../FFCompos/RecentSurgeries';
import FullSyllabus from '../FFCompos/FullSyllabus';
import MenuLogo from '../FFCompos/MenuLogo';
import InternshipYearTimeLine from './InternshipYearTimeLine';

export default function InternPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  const handleViewFullSyllabus = () => {
    navigate('/TableFullSyllabus');
  };

  return (
    <>
      <MenuLogo />
      <Container maxWidth="lg" sx={{ mt: 8, mb: 3 }}>
        <Grid container spacing={3} alignItems="center" dir={'rtl'}> 

          {/* Welcome message */}
          <Grid item xs={12}  >
            <Paper sx={{ p: 2, backgroundColor: '#FFFAFA' }}>
              <Typography variant="h6" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                 ברוך הבא, {currentUser.first_name}👋
              </Typography>
            </Paper>
          </Grid>

          {/* Internship Timeline */}
          <Grid item xs={12} >
            <Paper sx={{ p: 2, backgroundColor: '#FFFAFA' }}>
              <InternshipYearTimeLine />
            </Paper>
          </Grid>

          {/* Full Syllabus View */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: '#FFFAFA' }}>
              <FullSyllabus />
            </Paper>
          </Grid>

          {/* Full Syllabus Button */}
          <Grid item xs={12}  display="flex" justifyContent="center">
            <Button variant="contained" onClick={handleViewFullSyllabus} sx={{ width: '100%', maxWidth: 300 }}>
              צפייה בסילבוס המלא
            </Button>
          </Grid>

          {/* Recent Surgeries */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: '#FFFAFA' }}>
              <RecentSurgeries />
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </>
  );
}
