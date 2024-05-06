import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import MenuLogo from "./MenuLogo.jsx";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import TodayIcon from '@mui/icons-material/Today';

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
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [events] = useState({
        '2024-05-07': ['ניתוח בהלל יפ בח בחה', 'ניתוח בהלל יפ בח בחה', 'ניתוח בהלל יפ בח בחה', 'חתונה לחבר']
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDayEvents, setSelectedDayEvents] = useState([]);

    const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
    const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));
    const handleToday = () => setCurrentMonth(dayjs()); // Function to set to current day
    const handleDayClick = (day) => {
        setSelectedDayEvents(events[day.format('YYYY-MM-DD')] || []);
        setOpenDialog(true);
    };

    const days = generateCalendar(currentMonth);

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
                            height: 120, border: '0.1px solid #ccc', overflowY: 'scroll',
                            '&:hover': { overflowY: 'auto' },
                            '&::-webkit-scrollbar': { display: 'none' }
                        }}>
                            <Button dir="rtl" sx={{ width: '100%', height: '100%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                                onClick={() => handleDayClick(day)}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: 14,
                                        color: currentMonth.isSame(day, 'month') ? 'text.primary' : 'grey.500',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1, // Ensure it stays above other elements                 
                                    }}
                                >
                                    {day.format('D')}
                                </Typography>

                                {day && events[day.format('YYYY-MM-DD')] &&
                                    events[day.format('YYYY-MM-DD')].map((event, i) => (
                                        <Typography key={i} variant="body2" sx={{ color: 'blue', mt: 0.5, whiteSpace: 'nowrap', textOverflowY: 'ellipsis' }}>
                                            {event}
                                        </Typography>
                                    ))
                                }
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle dir="rtl">אירועים</DialogTitle>
                    <DialogContent>
                        {selectedDayEvents.length > 0 ? (
                            selectedDayEvents.map((event, index) => (
                                <Typography key={index} dir="rtl" paragraph>
                                    {event}
                                </Typography>
                            ))
                        ) : (
                            <Typography dir="rtl">No events</Typography>
                        )}
                    </DialogContent>
                </Dialog>

            </Box>
        </>
    );
}
