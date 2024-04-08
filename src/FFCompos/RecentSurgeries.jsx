import React from 'react';
import { Typography } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';

function RecentAnalysesTimeline() {
    return (
        <Timeline position="right">
            <Typography variant="h6" align="center" gutterBottom >
                <b>ניתוחים אחרונים</b>
            </Typography>
            <TimelineItem>
                <TimelineContent sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" component="span">
                        Consult
                    </Typography>
                    <Typography>Because health matters</Typography>
                </TimelineContent>
                <TimelineSeparator>
                    <TimelineDot>
                        <LocalHospitalIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
            </TimelineItem>
            <TimelineItem>
                <TimelineContent sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" component="span">
                        Code
                    </Typography>
                    <Typography>Because it&apos;s awesome!</Typography>
                </TimelineContent>
                <TimelineSeparator>
                    <TimelineDot color="primary">
                        <LaptopMacIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
            </TimelineItem>
            <TimelineItem>
                <TimelineContent sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" component="span">
                        Sleep
                    </Typography>
                    <Typography>Because you need rest</Typography>
                </TimelineContent>
                <TimelineSeparator>
                    <TimelineDot color="primary" variant="outlined">
                        <HotelIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
            </TimelineItem>
            <TimelineItem>
                <TimelineContent sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" component="span">
                        Repeat
                    </Typography>
                    <Typography>Because this is the life you love!</Typography>
                </TimelineContent>
                <TimelineSeparator>
                    <TimelineDot color="secondary">
                        <RepeatIcon />
                    </TimelineDot>
                </TimelineSeparator>
            </TimelineItem>
        </Timeline>
    );
}

export default RecentAnalysesTimeline;
