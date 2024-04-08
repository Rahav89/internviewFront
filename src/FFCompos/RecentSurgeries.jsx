import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Card, CardContent, Button } from '@mui/material';
import RecentAnalysesTimeline from '../FFCompos/RecentSurgeries';
import FullSyllabus from '../FFCompos/FullSyllabus';
import { Menu } from '@mui/icons-material';

export default function InternPage() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    console.log('Current user:', currentUser);

    const handleBackToLogin = () => {
        navigate('/');
    };

    return (
        <Grid container spacing={2} direction="column" alignItems="center" sx={{ p: 2 }}>
            <Menu />
            <Typography variant="h4" sx={{ mb: 5 }}>
                👋 ברוך הבא, {currentUser ? currentUser.first_name : 'Guest'}
            </Typography>

            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Card sx={{ width: '100%', mb: 3, backgroundColor: '#FFFAF0', overflowX: 'auto' }}>
                    <CardContent>
                        <FullSyllabus />
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={10} md={8} lg={6}>
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
