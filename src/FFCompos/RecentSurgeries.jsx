import * as React from 'react';
import { Typography } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const timelineData = [
    { title: "Consult", description: "Because health matters", color: "inherit" },
    { title: "Code", description: "Because it's awesome!", color: "primary" },
    { title: "Sleep", description: "Because you need rest", color: "primary", outlined: true },
    { title: "Repeat", description: "Because this is the life you love!", color: "secondary" }
];

export default function RecentSurgeries() {
    return (
        <>
            <h3>ניתוחים אחרונים</h3>
            <Timeline className="horizontal" style={{ direction: "ltr" }}>
                {timelineData.map((item, index) => (
                    <TimelineItem key={index}>
                        <TimelineContent sx={{ py: '10px', px: 2 }} style={{ textAlign: "right" }} >
                            <Typography variant="h6" component="span">
                                {item.title}
                            </Typography>
                            <Typography>{item.description}</Typography>
                        </TimelineContent>
                        <TimelineSeparator>
                            <TimelineConnector />
                            <TimelineDot color={item.color} variant={item.outlined ? "outlined" : undefined}>
                                <EventAvailableIcon />
                            </TimelineDot>
                            <TimelineConnector sx={{ bgcolor: index === timelineData.length - 1 ? 'transparent' : 'secondary.main' }} />
                        </TimelineSeparator>
                    </TimelineItem>
                ))}
            </Timeline>
        </>
    );
}
