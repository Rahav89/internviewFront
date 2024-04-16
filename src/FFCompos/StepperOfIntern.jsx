import React from 'react';
import { Stepper, Step, StepLabel, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For completed steps
import '../App.css';

// Map Hebrew years to step indices
const yearToStepIndex = {
    'א': 0,
    'ב': 1,
    'ג': 2,
    'ד': 3,
    'ה': 4,
    'ו': 5
};

function getSteps() {
    return ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];
}

function StepIconComponent({ active, completed, icon }) {
    const iconStyle = {
        width: '20px', // גודל העיגול
        height: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%', // עיגול
        color: 'white',
        background: completed ? 'green' : 'gray' // רקע ירוק לשלבים שהושלמו, אפור לאחרים
    };

    if (completed) {
        return <CheckCircleIcon style={{ color: 'green' ,}} />;
    }

    if (active) {
        return (
            <div style={{ position: 'relative' }}>
                {active && <img src={'src/Image/doctorForStepper.png'}
                    style={{
                        position: 'absolute',
                        top: '-60px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '57px',
                        height: '52px'
                    }} />}
                <div style={{ ...iconStyle }}> {/* רקע כחול לשלב הנוכחי */}
                    <Typography variant="body1" component="div">
                        {icon}
                    </Typography>
                </div>
            </div>
        );
    }
    return (
        <div style={iconStyle}>
            <Typography variant="body1" component="div">
                {icon}
            </Typography>
        </div>
    );
}

export default function CustomStepper() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const steps = getSteps();

    // Determine active step from currentUser's year
    const activeStep = yearToStepIndex[currentUser.interns_year];

    return (
        <>
            <Typography
                variant="h6"
                component="h3"
                sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    mb: 8,
                }}
            >
                צפה בהתקדמות שלך
            </Typography>

            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step
                            key={label}
                            completed={index < activeStep}
                            className="slide-in"
                        >
                            <StepLabel StepIconComponent={(props) => (
                                <StepIconComponent
                                    active={index === activeStep}
                                    completed={index < activeStep}
                                    icon={index + 1}  // Displaying step number
                                />
                            )}>
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </>
    );
}
