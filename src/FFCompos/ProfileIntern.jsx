import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuLogo from './MenuLogo';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import '../App.css';

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
    <>
      <MenuLogo />
      <ThemeProvider theme={createTheme()}>
        <Container component="main" maxWidth="xs" dir='rtl' >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>

            <Box sx={{ width: '20%' }}>
              <img width="100%" src="src/Image/IconUpdate.png" alt="Update Icon" />
            </Box>

            <Typography component="h1" variant="h5" fontWeight={'bold'}>
              עדכון פרטים 
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="InternID"
                    id="InternID"
                    label="תעודת זהות"
                    autoComplete="תעודת זהות"
                    value={currentUser.id}
                    error={formErrors.id}
                    helperText={formErrors.id ? "תעודת זהות חיייבת להכיל רק ספרות" : ''}
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
                    id="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    error={formErrors.password_i}
                    helperText={formErrors.password_i ? "הסיסמה לא תואמת לסיסמה הנוכחית" : ''}
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
                    label="סיסמה חדשה "
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    autoComplete="new-password"
                    onChange={handleChange}
                    error={formErrors.passwordConfirmation}
                    helperText={formErrors.passwordConfirmation ? "הסיסמה חייבת להכיל לפחות אות גדולה וספרות" : ''}
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


                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    name="first_name"
                    id="first_name"
                    label="שם פרטי"
                    autoComplete="given-name"
                    value={currentUser.first_name}
                    onChange={handleChange}
                    error={formErrors.first_name}
                    helperText={formErrors.first_name ? 'יכול להכיל רק אותיות' : ""}
                    InputLabelProps={{ style: { textAlign: 'right', direction: 'rtl' } }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    name="last_name"
                    id="last_name"
                    label="שם משפחה"
                    autoComplete="family-name"
                    value={currentUser.last_name}
                    onChange={handleChange}
                    error={formErrors.last_name}
                    helperText={formErrors.last_name ? 'יכול להכיל רק אותיות.' : ""}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="interns_year"
                    id="interns_year"
                    label="שנת התמחות"
                    autoComplete="given-name"
                    value={currentUser.interns_year}
                    disabled
                  />
                </Grid>



                {/* צאקבוס אימות הצג סיסמא
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showPassword}
                        onChange={handleToggleShowPassword}
                        name="showPassword"
                      />
                    }
                    label="הצגת סיסמה"
                  />
                </Grid> */}

                <Grid item xs={12} sm={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 1 }}
                  >
                    אישור
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    onClick={handleCancelClick} // Set the onClick handler
                    variant="contained"
                    sx={{ mt: 2, mb: 2, backgroundColor: 'CornflowerBlue', color: 'white', '&:hover': { backgroundColor: 'DeepSkyBlue' } }}
                  >
                    חזרה לדף הראשי
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
