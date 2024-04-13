import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import doctorImageIcon from '/src/Image/DoctorIcon.png';
//------------------------------------------------------
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

export default function InternshipYearTimeLine() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    //של שנות ההתמחות של המתמחה כמספר enum
    const InternshipYears = {
        א: 1,
        ב: 2,
        ג: 3,
        ד: 4,
        ה: 5,
        ו: 6
    };

    //  המרה של שנת ההתמחות מהמשתמש הנוכחי למספר
    const currentYearNumeric = InternshipYears[currentUser.interns_year];
    console.log(currentYearNumeric)

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                p: 2,
            }}
        >
            <Box sx={{ width: '100%' }}>
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        mb: 2,
                    }}
                >
                    צפה בהתקדמות שלך
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        {Array.from({ length: 6 }).map((_, index) => (
                            <React.Fragment key={index}>
                                {index + 1 <= currentYearNumeric ? (
                                    <Avatar
                                        sx={{
                                            width: 25,
                                            height: 25,
                                            mb: 1,
                                            border: '2px solid',
                                            borderColor: index + 1 === currentYearNumeric ? theme.palette.primary.main : 'green',
                                            mx: 0.5,
                                            bgcolor: 'white',
                                        }}
                                        src={index + 1 === currentYearNumeric ? doctorImageIcon : undefined}
                                    >
                                        {index + 1 < currentYearNumeric && <CheckCircleIcon style={{ color: 'green' }} />}
                                    </Avatar>
                                ) : (
                                    <Avatar
                                        sx={{
                                            width:25,
                                            height: 25,
                                            mb: 1,
                                            border: '2px solid',
                                            borderColor: 'black',
                                            mx:0.5,
                                            bgcolor: 'GhostWhite'
                                        }}
                                    />
                                )}
                                {index < 5 && (
                                    <Box
                                        sx={{
                                            height: '2px',
                                            bgcolor: 'text.primary',
                                            width: 6,
                                            display: 'inline-block',
                                            verticalAlign: 'middle',
                                            marginLeft: '-4px',
                                            marginRight: '-4px',
                                        }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
