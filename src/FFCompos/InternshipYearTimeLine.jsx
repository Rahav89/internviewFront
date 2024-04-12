import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person'; // Assuming PersonIcon as a doctor icon
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//-------------------------------------------------------------

// const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

export default function InternshipYearTimeLine() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row-reverse',
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
                            flexDirection: 'row-reverse',
                        }}
                    >
                        {Array.from({ length: 6 }).map((_, index) => (
                            <React.Fragment key={index}>
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.action.main,
                                        mx: 1,
                                        border: '2px solid', // Outline effect
                                        borderColor: 'secondary' // Customizable color
                                    }}
                                >
                                    <PersonIcon />
                                </Avatar>
                                {index < 5 && (
                                    <Box
                                        sx={{
                                            height: '5px', // Increased height for visibility
                                            bgcolor: 'text.primary',
                                            margin: 'auto',
                                            width: 20, // Increased width to balance the design
                                            display: 'inline-block',
                                            verticalAlign: 'middle',
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
