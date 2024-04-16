import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Container } from '@mui/material';
import RecentSurgeries from '../FFCompos/RecentSurgeries';
import FullSyllabus from '../FFCompos/FullSyllabus';
import MenuLogo from '../FFCompos/MenuLogo';
import InternshipYearTimeLine from './InternshipYearTimeLine';
import StepperOfIntern from './StepperOfIntern';
import TableChartIcon from '@mui/icons-material/TableChart';
import VisibilityIcon from '@mui/icons-material/Visibility';
//--------------------------------------------------------

export default function InternPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  const handleViewFullSyllabus = () => {
    navigate('/TableFullSyllabus');
  };

  const handleViewIntern = () => {
    navigate('/ViewInterns');
  };
  
  return (
    <>
   
      <MenuLogo />
      <Container maxWidth="lg" sx={{ mt: 8, mb: 3 }}>
        <Grid container spacing={3} alignItems="center" dir={'rtl'}>

          {/* Welcome message */}
          <Grid item xs={12}  >
            <Typography variant="h6" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
              ברוך הבא, {currentUser.first_name + " " + currentUser.last_name}👋
            </Typography>
          </Grid>

          {/* Internship Timeline
          <Grid item xs={12} >
            <InternshipYearTimeLine />
           
          </Grid> */}
          </Grid>
      </Container>
      <StepperOfIntern />
      <Container maxWidth="lg" sx={{ mt: 8, mb: 3 }}>
        <Grid container spacing={3} alignItems="center" dir={'rtl'}>
          {/* Full Syllabus View */}
          <Grid item xs={12}>
            <FullSyllabus />
          </Grid>

          {/* Full Syllabus Button */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <Button variant="contained" onClick={handleViewFullSyllabus} sx={{ width: '100%', maxWidth: 300,backgroundColor: 'SkyBlue','&:hover': {
                  backgroundColor: 'SteelBlue' 
                } }}>
              צפייה בסילבוס המלא
              <TableChartIcon sx={{ mr: 1 }} />
            </Button>
          </Grid>

          {/* Check if variable equals 1 before rendering the button */}
          {currentUser.isManager === 1 && (
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button variant="contained" onClick={handleViewIntern} sx={{
                width: '100%',
                maxWidth: 300,
                backgroundColor: 'MediumPurple', 
                '&:hover': {
                  backgroundColor: 'RebeccaPurple' 
                }
              }}>
                צפייה בהתקדמות המתמחים
                <VisibilityIcon sx={{ mr: 0.5 }} />
              </Button>
            </Grid>
          )}

          {/* Recent Surgeries */}
          <Grid item xs={12}>
            <RecentSurgeries />
          </Grid>

        </Grid>
      </Container>
     
    </>
  );
}
