import * as React from 'react';
import { Typography } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
//-------------------------------------------------------------------------
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

const RecentSurgeries = () => {
    const [timelineData, setTimelineData] = React.useState([]);

    React.useEffect(() => {
        const internId = currentUser.id;
        fetch(`https://localhost:7220/api/Intenrs/FiveRecentInternSurgeries?internId=${internId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setTimelineData(data);
            })
            .catch(error => {
                console.error("Error in List 5 Recent Surgeries: ", error);
            });
    }, []); // Empty dependency array means this effect runs once after the initial render

    return (
        <>
            <h3>ניתוחים אחרונים</h3>
            <Timeline position='right'>
                {timelineData.map((item, index) => (
                    <TimelineItem key={index}>
                        <TimelineSeparator>
                            <TimelineConnector />
                            <TimelineDot color="primary" variant="outlined">
                                <EventAvailableIcon />
                            </TimelineDot>
                            {/* Remove the last connector */}
                            {index < timelineData.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: '10px', px: 2 }} align="right">
                            <Typography variant="h6" component="span">
                                {item.procedureName}
                            </Typography>
                            <Typography>{item.surgery_date}</Typography>
                        </TimelineContent>

                    </TimelineItem>
                ))}
            </Timeline>
        </>
    );
};

export default RecentSurgeries;
