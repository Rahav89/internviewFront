import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';




export default function InternPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  console.log('Current user:', currentUser);

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 5 }}>
        👋 ברוך הבא,  {currentUser ? currentUser.first_name : 'Guest'}
      </Typography>
    
      <button onClick={handleBackToLogin}>Back to Login</button>
    </div>
  );
}
