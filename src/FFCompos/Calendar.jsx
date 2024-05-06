import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import MenuLogo from "./MenuLogo.jsx";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import TodayIcon from '@mui/icons-material/Today';
import { GetAllInternSurgeries } from './Server.jsx';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const generateCalendar = (month) => {
    const startOfTheMonth = month.startOf('month').startOf('week');
    const endOfTheMonth = month.endOf('month').endOf('week');
    const days = [];
    let day = startOfTheMonth;

    while (day.isSameOrBefore(endOfTheMonth)) {
        days.push(day);
        day = day.add(1, 'day');
    }

    return days;
};

export default function Calendar() {
    const internID = JSON.parse(sessionStorage.getItem('currentUserID')); // Adjusted if sessionStorage is used correctly
    const [events, setEvents] = useState({});
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDayEvents, setSelectedDayEvents] = useState([]);

    useEffect(() => {
        GetAllInternSurgeries(internID).then((data) => {
            let allEvents = {};
            data.forEach((surgery) => {
                const dateKey = surgery.Surgery_date.slice(0, 10);
                if (!allEvents[dateKey]) {
                    allEvents[dateKey] = [];
                }
                allEvents[dateKey].push({
                    ...surgery,
                    displayText: `ניתוח ב${surgery.Hospital_name}`,
                    isNewMatch: surgery.newMatch === 1
                });
            });
            setEvents(allEvents);
        }).catch((error) => {
            console.error("Error in GetAllInternSurgeries: ", error);
        });
    }, [internID]);

    const handleDayClick = (day) => {
        setSelectedDayEvents(events[day.format('YYYY-MM-DD')] || []);
        setOpenDialog(true);
    };

    const days = generateCalendar(currentMonth);

    const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
    const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));
    const handleToday = () => setCurrentMonth(dayjs()); // Function to set to current day
    return (
        <>
            <MenuLogo />
            <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 7 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ textAlign: 'left', flexGrow: 1 }}>{currentMonth.format('MMMM YYYY')}</Typography>
                    <Button onClick={handlePrevMonth}><KeyboardArrowLeftIcon /></Button>
                    <Button onClick={handleToday}><TodayIcon /></Button> {/* Button to navigate to today */}
                    <Button onClick={handleNextMonth}><KeyboardArrowRightIcon /></Button>
                </Box>
                <Grid container spacing={1}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <Grid item xs={1.714} key={day} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                            {day}
                        </Grid>
                    ))}
                    {days.map((day, index) => (
                        <Grid item xs={1.714} key={index} sx={{
                            height: 80, 
                            border: '0.1px solid #ccc', 
                            overflowY: 'scroll',
                            '&::-webkit-scrollbar': { display: 'none' },
                            '&:hover': { overflowY: 'auto' }, // אפשר גלילה בעת מעבר העכבר
                            overflowY: 'auto', // מאפשר גלילה אופקית
                            whiteSpace: 'nowrap' // שומר על טקסט בשורה אחת
                        }}>
                            <Button dir="rtl" sx={{ width: '100%', height: '100%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                                onClick={() => handleDayClick(day)}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mr:1,
                                        fontSize: 10,
                                        color: currentMonth.isSame(day, 'month') ? 'text.primary' : 'grey.500',
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: 'white',
                                        zIndex: 1, // מבטיח שזה נשאר מעל יתר האלמנטים     
                                        mr:2,            
                                    }}
                                >
                                    {day.format('D')}
                                </Typography>

                                {day && events[day.format('YYYY-MM-DD')] && events[day.format('YYYY-MM-DD')].map((event, i) => (
                                    <Typography key={i} variant="body2" sx={{
                                        color: 'DarkBlue',
                                        mt: 0.5, // מרווח מעל
                                        whiteSpace: 'scroll', // אין גלילה אופקית בטקסט
                                        overflow: 'hidden', // מסתיר תוכן שלא מתאים לתא
                                        textOverflow: 'ellipsis', // מוסיף נקודות קץ אם הטקסט חורג
                                        backgroundColor: event.isNewMatch ? 'Azure' : 'transparent', // רקע שונה לאירועים חדשים
                                        fontSize: '0.60rem', // קטן גודל הגופן
                                        mr: '5px' // מרווח פנימי קטן לכל צד
                                    }}>
                                        {event.displayText}
                                    </Typography>
                                ))
                                }
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                <Dialog dir="rtl" open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Events</DialogTitle>
                    <DialogContent>
                        <List>
                            {selectedDayEvents.length > 0 ? selectedDayEvents.map((event, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'pink' }}>
                                                <AssignmentIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{ textAlign: "right" }}
                                            primary={event.secondaryText}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="text.primary">
                                                        {`${(event.Surgery_date).slice(11, 16)} ,${event.Hospital_name} (${event.Intern_role})  — `}
                                                    </Typography>
                                                    {`${event.procedureName.join(', ')}`}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            )) : <Typography>No events</Typography>}
                        </List>
                    </DialogContent>
                </Dialog>
            </Box>
        </>
    );
}
