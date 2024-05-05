import React, { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const generateCalendar = (month) => {
    
    const startOfTheMonth = month.startOf('month').startOf('week');  // Start the calendar from the start of the week of the first day of the month
    const endOfTheMonth = month.endOf('month').endOf('week');  // End the calendar at the end of the week of the last day of the month
    const days = [];

    let day = startOfTheMonth;

    while (day.isSameOrBefore(endOfTheMonth)) {
        days.push(day);
        day = day.add(1, 'day');
    }

    return days;
};

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(dayjs('2024-05'));
    const [events] = useState({
        '2024-05-07': 'Birthday'
    });

    const handlePrevMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, 'month'));
    };

    const days = generateCalendar(currentMonth);

    return (
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ textAlign: 'left', flexGrow: 1 }}>{currentMonth.format('MMMM YYYY')}</Typography>
                <Button onClick={handlePrevMonth}>PREV</Button>
                <Button onClick={handleNextMonth}>NEXT</Button>
            </Box>
            <Grid container spacing={1}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Grid item xs={1.714} key={day} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {day}
                    </Grid>
                ))}
                 {days.map((day, index) => (
          <Grid item xs={1.714} key={index} sx={{ textAlign: 'center', height: 100 }}>
            <Button sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 1 }}>
              <Typography variant="caption" sx={{ fontSize: 14, color: currentMonth.isSame(day, 'month') ? 'text.primary' : 'grey.500' }}>
                {day ? day.format('D') : ''}
              </Typography>
              {day && events[day.format('YYYY-MM-DD')] &&
                <Typography variant="body2" sx={{ color: 'blue', mt: 0.5 }}>
                  {events[day.format('YYYY-MM-DD')]}
                </Typography>
              }
            </Button>
          </Grid>
        ))}
            </Grid>
        </Box>

    );
}
