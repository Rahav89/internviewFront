import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Card, CardContent, Button } from '@mui/material';
// import RecentAnalysesTimeline from '../FFCompos/RecentSurgeries';
import FullSyllabus from '../FFCompos/FullSyllabus';
import { Menu } from '@mui/icons-material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // Import the doctor icon
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';


export default function RecentAnalysesTimeline() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    console.log('Current user:', currentUser);

    const handleBackToLogin = () => {
        navigate('/');
    };

    return (<Timeline className="horizontal">
        <TimelineItem>
            <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                variant="body2"
                color="text.secondary"
            >
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot>
                    <LocalHospitalIcon /> {/* Use the doctor icon here */}
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Typography variant="h6" component="span">
                    Consult
                </Typography>
                <Typography>Because health matters</Typography>
            </TimelineContent>
        </TimelineItem>
        <TimelineItem>
            <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                variant="body2"
                color="text.secondary"
            >
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="primary">
                    <LaptopMacIcon />
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Typography variant="h6" component="span">
                    Code
                </Typography>
                <Typography>Because it&apos;s awesome!</Typography>
            </TimelineContent>
        </TimelineItem>
        <TimelineItem>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="primary" variant="outlined">
                    <HotelIcon />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Typography variant="h6" component="span">
                    Sleep
                </Typography>
                <Typography>Because you need rest</Typography>
            </TimelineContent>
        </TimelineItem>
        <TimelineItem>
            <TimelineSeparator>
                <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                <TimelineDot color="secondary">
                    <RepeatIcon />
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Typography variant="h6" component="span">
                    Repeat
                </Typography>
                <Typography>Because this is the life you love!</Typography>
            </TimelineContent>
        </TimelineItem>
    </Timeline>

    );
}
