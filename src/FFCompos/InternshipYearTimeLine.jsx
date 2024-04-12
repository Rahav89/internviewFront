import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import doctorImageIcon from '/src/Image/DoctorIcon .png'
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
//-------------------------------------------

export default function InternshipYearTimeLine() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const currentYear = 4;

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
                            flexDirection: 'row', // Changed to 'row' for left to right layout
                            alignItems: 'center',
                        }}
                    >
                        {Array.from({ length: 6 }).map((_, index) => (
                            <React.Fragment key={index}>
                                {index + 1 <= currentYear ? (
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            mb: 1,
                                            border: '2px solid',
                                            borderColor: index + 1 === currentYear ? theme.palette.primary.main : 'green',
                                            mx: 0.5,
                                            bgcolor: 'white', // Background color set to white
                                        }}
                                        src={index + 1 === currentYear ? doctorImageIcon : undefined}
                                    >
                                        {index + 1 < currentYear && <CheckCircleIcon style={{ color: 'green' }} />}
                                    </Avatar>
                                ) : (
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            mb: 1,
                                            border: '2px solid',
                                            borderColor: 'black',
                                            mx: 0.5,
                                            bgcolor: 'white'
                                        }}
                                    />
                                )}
                                {index < 5 && (
                                    <Box
                                        sx={{
                                            height: '2px',
                                            bgcolor: 'text.primary',
                                            width: 30,
                                            display: 'inline-block',
                                            verticalAlign: 'middle',
                                            marginLeft: '-5px',
                                            marginRight: '-5px',
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