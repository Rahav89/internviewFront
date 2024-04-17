import React from 'react';
import { Stepper, Step, StepLabel, Typography, Box, StepIcon } from '@mui/material';
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

// Custom step icon component
function StepIconComponent({ active, completed, icon }) {
    if (completed) {
        return <CheckCircleIcon style={{ color: 'green' }} />;
    }
    if (active) {
        return (
            <div style={{ position: 'relative' }}>
                {/* Only render the image if this step is the current step */}
                {active && <img src={'src/Image/doctorForStepper.png'} 
                                style={{ 
                                    position: 'absolute',
                                    top: '-60px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '57px',
                                     height: '52px' }} />}
                <StepIcon icon={icon} />
            </div>
        );
    }
    return <StepIcon icon={icon} />;
}

export default function CustomStepper() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const steps = getSteps();
    const activeStep = yearToStepIndex[currentUser.interns_year];
   
   
// Add a unique animation name for each step
const stepAnimations = steps.map((_, index) => `step-enter-animation-${index}`);

// Inline styles for animations
const stepAnimationStyles = steps.map((_, index) => ({
    animation: `${stepAnimations[index]} 1s ease forwards`,
    animationDelay: `${index * 0.5}s`, // each step will start animating after the previous one
}));

// Function to create keyframes for animation
const createStepKeyframes = () => {
    return steps.map((_, index) => (
        <style key={index}>
            {`@keyframes ${stepAnimations[index]} {
                from { opacity: 0; transform: translateX(-100%); }
                to { opacity: 1; transform: translateX(0); }
            }`}
        </style>
    ));
};
    return (
        <>
        <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        textAlign: 'center',                       
                        mb: 7,
                    }}
                >
                    צפה בהתקדמות שלך
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