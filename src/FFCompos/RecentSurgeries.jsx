import * as React from 'react';
import { Typography, Box } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';


//----------------------------------------------------------

// קומפוננטת הניתוחים האחרונים
export default function RecentSurgeries() {
    // קבלת המשתמש הנוכחי מאחסון הפעילות (session storage)
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    // מערך שמאחסן את הנתונים שיוצגו בציר הזמן
    const [timelineData, setTimelineData] = React.useState([]);

    // טעינת הנתונים מהשרת כאשר הקומפוננטה מוטענת לראשונה
    React.useEffect(() => {
        // קבלת מזהה המתמחה מהמשתמש הנוכחי
        const internId = currentUser.id;
        // בקשת גאט לשרת כדי לקבל את חמשת הניתוחים האחרונים
        fetch(`https://localhost:7220/api/Interns/FiveRecentInternSurgeries?internId=${internId}`, {
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
                // עיבוד הנתונים שהתקבלו כדי להפריד בין התאריך לשעה
                setTimelineData(data.map(item => {
                    const [date, time] = item.surgery_date.split('T');
                    const [year, month, day] = date.split('-');
                    return { ...item, surgeryDate: `${day}-${month}-${year}` }; // Reformat the date
                }));
            })
            .catch(error => {
                console.error("Error in List 5 Recent Surgeries: ", error);
            });
    }, []);
    const getColor = (index) => {
        const colors = ['Plum', 'blue', 'green', 'SkyBlue', 'orange', 'yellow'];
        return colors[index % colors.length];  // Cycle through colors
    };

    // רינדור של הקומפוננטה עם ציר הזמן והנתונים
    return (
        <>
            <h3>ניתוחים אחרונים</h3>
            <Box display="flex" justifyContent="flex-end" textAlign="right">
                <Timeline position="left">
                    {timelineData.map((item, index) => (
                        <TimelineItem key={index}>
                            <TimelineContent sx={{ py: '1px', px: 1 }}>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{
                                        fontSize: '1rem',
                                    }}
                                >
                                    {item.procedureName}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{
                                        fontSize: '1rem',
                                    }}
                                >{item.surgeryDate}</Typography>
                            </TimelineContent>
                            <TimelineItem key={index}>
                                <TimelineSeparator>
                                    <TimelineConnector />
                                    <TimelineDot style={{ backgroundColor: getColor(index) }} />
                                    {index < timelineData.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                            </TimelineItem>
                        </TimelineItem>
                    ))}
                </Timeline>
            </Box >
        </>
    );
};
