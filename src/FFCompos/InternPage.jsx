
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Card, CardContent, Button, useTheme, useMediaQuery } from '@mui/material';
import RecentAnalysesTimeline from '../FFCompos/RecentSurgeries';
import FullSyllabus from '../FFCompos/FullSyllabus';

export default function InternPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  console.log('Current user:', currentUser);

  const handleBackToLogin = () => {
    navigate('/');
  };


  return (
    <Grid container spacing={2} direction="column" alignItems="center" sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        👋 ברוך הבא, {currentUser ? currentUser.first_name : 'Guest'}
      </Typography>

      <Grid item xs={12} md={8} lg={6}>
        <Card sx={{ width: '100%', mb: 3, backgroundColor: '#FFFAF0', overflowX: 'auto' }}>
          <div style={{ minWidth: isMobile ? '300px' : '500px' }}>
            <CardContent>
              <FullSyllabus />
            </CardContent>
          </div>
        </Card>
      </Grid>


      <Grid item xs={12} md={8} lg={6}>
        <Card sx={{ width: '100%', mb: 3, backgroundColor: '#FFFAF0' }}>
          <CardContent>
            <RecentAnalysesTimeline />
          </CardContent>
        </Card>
      </Grid>

      <Button variant="contained" onClick={handleBackToLogin}>
        Back to Login
      </Button>
    </Grid>
  );
}