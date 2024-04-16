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
        width: '30px', // Uniform size for circle
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%', // Circular shape
        color: 'white',
        background: completed ? 'green' : 'gray', // Green for completed, gray for others
        fontSize: '16px', // Font size for the number
    };

    if (completed) {
        return (
            <div style={iconStyle}>
                <CheckCircleIcon style={{ color: 'white' }} fontSize="small" />
            </div>
        );
    }

    if (active) {
        return (
            <div style={{ position: 'relative' }}>
                {active && (
                    <img src={'src/Image/doctorIconS.png'}
                        style={{
                            position: 'absolute',
                            top: '-60px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '50px',
                            height: '52px',
                        }}
                    />
                )}
                <div style={{ ...iconStyle, background: 'blue' }}> {/* Blue background for the active step */}
                    <Typography variant="body1" component="div" style={{ color: 'white' }}>
                        {icon}
                    </Typography>
                </div>
            </div>
        );
    }

    return (
        <div style={iconStyle}>
            <Typography variant="body1" component="div" style={{ color: 'white' }}>
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
