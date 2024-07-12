import React from 'react';
import { Stepper, Step, StepLabel, Typography, Box, StepIcon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For completed steps
import '../App.css';
import doctorPic from '/src/Image/doctorForStepper.png';

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

// Custom step icon component
function StepIconComponent({ active, completed, icon }) {
    if (completed) {
        return <CheckCircleIcon style={{ color: 'green' }} />;
    }
    if (active) {
        return (
            <div style={{ position: 'relative' }}>
                <img src={doctorPic}
                    alt="Doctor Icon"
                    style={{
                        position: 'absolute',
                        top: '-60px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '57px',
                        height: '52px'
                    }} />
                <StepIcon icon={icon} />
            </div>
        );
    }
    return <StepIcon icon={icon} />;
}

export default function CustomStepper() {
    const currentUserYear = JSON.parse(sessionStorage.getItem('currentUserYear'));
    const activeStep = yearToStepIndex[currentUserYear];
    const steps = getSteps();
    
    return (
        <>
            <Typography
                variant="h6"
                component="h3"
                sx={{
                    textAlign: 'center',
                    fontWeight:'bold',
                    mb: 10,
                    mt:11,
                }}
            >
                צפייה בהתקדמות שלך
            </Typography>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step
                            key={label}
                            completed={index < activeStep - 1}
                            className="slide-in"
                            style={{ animationDelay: `${index * 0.2}s` }} // Delay animation based on index
                        >
                            <StepLabel StepIconComponent={(props) => (
                                <StepIconComponent
                                    active={index === activeStep}
                                    completed={index < activeStep}
                                    icon={props.icon}
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