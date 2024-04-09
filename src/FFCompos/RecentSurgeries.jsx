import * as React from 'react';
import { Typography } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

export default function RecentSurgeries() {
    return (
        <>
            <h3>ניתוחים אחרונים</h3>
            <Timeline className="horizontal">
                <TimelineItem>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span">
                            Consult
                        </Typography>
                        <Typography>Because health matters</Typography>
                    </TimelineContent>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot>
                            <EventAvailableIcon />
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                </TimelineItem>
                <TimelineItem>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span">
                            Code
                        </Typography>
                        <Typography>Because it&apos;s awesome!</Typography>
                    </TimelineContent>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot color="primary">
                            <EventAvailableIcon />
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                </TimelineItem>
                <TimelineItem>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span">
                            Sleep
                        </Typography>
                        <Typography>Because you need rest</Typography>
                    </TimelineContent>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot color="primary" variant="outlined">
                            <EventAvailableIcon />
                        </TimelineDot>
                        <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                    </TimelineSeparator>
                </TimelineItem>
                <TimelineItem>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span">
                            Repeat
                        </Typography>
                        <Typography>Because this is the life you love!</Typography>
                    </TimelineContent>
                    <TimelineSeparator>
                        <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                        <TimelineDot color="secondary">
                            <EventAvailableIcon />
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                </TimelineItem>
            </Timeline>
        </>
    );
}
