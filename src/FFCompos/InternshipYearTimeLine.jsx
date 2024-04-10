import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function InternshipYearTimeLine() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row-reverse', // This reverses the row order to match RTL layout
                p: 2, // Add padding around the component for better spacing
            }}
        >
            {/* This box wraps the entire content including the title and the timeline */}
            <Box sx={{ width: '100%' }}>
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        textAlign: isSmallScreen ? 'center' : 'right', // Center align for small screens, right align for larger screens
                        mb: 2, // Increase bottom margin for spacing
                    }}
                >
                    צפה בהתקדמות שלך
                </Typography>

                {/* This box represents the timeline itself */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center', // Center the timeline
                        flexWrap: isSmallScreen ? 'wrap' : 'nowrap', // Allow wrapping on small screens
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row-reverse', // Align for RTL layout
                        }}
                    >
                        {Array.from({ length: 6 }).map((_, index) => (
                            <React.Fragment key={index}>
                                <TripOriginIcon />
                                {/* We add the line after the icon except after the last one */}
                                {index < 5 && ( // Avoid adding a line after the last icon
                                    <Box
                                        sx={{
                                            height: '3px',
                                            bgcolor: 'text.primary',
                                            margin: 'auto',
                                            width: 10, // Fixed width for the lines
                                            mx: 1, // Margin on both sides for spacing
                                            display: 'inline-block', // Make the Box inline for centering
                                            verticalAlign: 'middle', // Align the line vertically with the icon
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
