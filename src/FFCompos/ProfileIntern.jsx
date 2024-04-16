import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Card, CardContent, CardActions } from '@mui/material';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuLogo from './MenuLogo';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/Visibility';
import { Container } from '@mui/material';

//------------------------------------------------------------------

export default function ProfileIntern(props) {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Function to handle button click
  const handleCancelClick = () => {
    navigate('/intern'); // Navigate to the intern page
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleNewShowPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  // קבלת המשתמש הנוכחי מאחסון הפעילות (session storage)
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  // הגדרת הטופס עם הנתונים הנוכחיים של המשתמש
  const [formData, setFormData] = useState({
    ...currentUser
  });

  // ניהול שגיאות בטופס
  const [formErrors, setFormErrors] = useState({
    password_i: false,
    passwordConfirmation: false,
    first_name: false,
    last_name: false,
  });

  // טיפול בשינויים בשדות הטופס
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //פונקציה הבודקת את הולידציה של הסיסמא החדשה
  function validateNewPassword(password) {
    //בודק שהסיסמא מכילה לפחות אות גדולה אחת ומספר אחד
    const uppercaseLetter = /[A-Z]/;
    const digit = /[0-9]/;
    return (
      uppercaseLetter.test(password) && digit.test(password)
    );
  }

  //פונקציה הבודקת את הולידציה של הסיסמא
  function validatePassword(password) {
    //בודק שהסיסמה שהכניס היא הסיסמה הנוכחית שלו
    if (formData.currentPassword) {
      return (
        currentUser.password_i == formData.currentPassword
      );
    }
  }

  // ולידציה לטקסט בלבד
  const validateTextOnly = (value) => {
    return (/^[a-zA-Zא-ת ]*$/.test(value) && value !== '');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isPasswordValid = validatePassword(formData.password_i_form);
    const isPasswordConfirmationValid = validateNewPassword(formData.password_i);
    const isFirstNameValid = validateTextOnly(formData.firstName);
    const isLastNameValid = validateTextOnly(formData.lastName);
    console.log(isPasswordValid, isFirstNameValid, isLastNameValid);
    setFormErrors({
      password_i: !isPasswordValid,
      passwordConfirmation: !isPasswordConfirmationValid,
      firstName: !isFirstNameValid,
      lastName: !isLastNameValid,
    });

    if (isPasswordConfirmationValid && isPasswordValid && isFirstNameValid && isLastNameValid) {
      submitFormData(); // Call the function that handles the submission
    }

  };

  const submitFormData = async () => {
    console.log(formData);
    try {
      // Simulating an API call
      console.log('Submitting form data:', formData);

      const response = await fetch(`https://localhost:7220/api/Interns/updateIntern-${formData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Check if the HTTP response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Submission successful:', data);

      // Use SweetAlert for success notification
      Swal.fire({
        title: 'Success!',
        text: 'פרטיך עודכנו בהצלחה',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      // Storing some part of response in sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(formData));

    } catch (error) {
      console.error('Submission failed:', error);

      // Use SweetAlert for error notification
      Swal.fire({
        title: 'Error!',
        text: 'העדכון נכשל. אנא נסה שוב.',
        icon: 'error',
        confirmButtonText: 'Close'
      });
    }
  }


  return (
    <ThemeProvider theme={createTheme()}>
      <MenuLogo />
      <Container component="main" dir='rtl'>
        <CssBaseline />
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ mt: 8, width: '100%' }}>
              <CardContent>
                <Typography component="h1" variant="h5" fontWeight="bold" textAlign="center">
                  עדכון פרטים
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="InternID"
                        label="תעודת זהות"
                        value={currentUser.id}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="currentPassword"
                        label="סיסמה נוכחית"
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleToggleShowPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password_i"
                        label="סיסמה חדשה"
                        type={showNewPassword ? 'text' : 'password'}
                        onChange={handleChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleToggleNewShowPassword}
                                edge="end"
                              >
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="first_name"
                        label="שם פרטי"
                        value={currentUser.first_name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="last_name"
                        label="שם משפחה"
                        value={currentUser.last_name}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  <CardActions>
                    <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 , ml:2}}>
                      אישור
                    </Button>
                    <Button fullWidth onClick={handleCancelClick} variant="contained" sx={{mb: 2, backgroundColor: 'CornflowerBlue', color: 'white', '&:hover': { backgroundColor: 'DeepSkyBlue' } }}>
                      חזרה לדף הראשי
                    </Button>
                  </CardActions>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

