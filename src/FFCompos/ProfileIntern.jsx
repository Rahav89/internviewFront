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
import { Container, Box } from '@mui/material';
import { updateIntern } from './Server.jsx';
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
    password_i: '',
    first_name: '',
    last_name: '',
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


  //פונקציה הבודקת את הולידציה של הסיסמא
  function validatCurrentePassword(password) {
    //בודק שהסיסמה שהכניס היא הסיסמה הנוכחית שלו
    return (currentUser.password_i == password);
  }

  // ולידציה לטקסט בלבד
  const validateTextOnly = (value) => {
    return (/^[a-zA-Zא-ת ]*$/.test(value) && value !== '');
  };
  
  //פונקציה הבודקת את הולידציה של הסיסמא החדשה
  function validateNewPassword(password) {
    //בודק שהסיסמא מכילה לפחות אות גדולה אחת ומספר אחד
    const uppercaseLetter = /[A-Z]/;
    const digit = /[0-9]/;
    return (password != '' && uppercaseLetter.test(password) && digit.test(password));
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const isPasswordValid = validatCurrentePassword(formData.currentPassword);
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
      updateIntern(formData)
        .then((data) => {
          console.log('Submitting form data:', data);
          if (data) {

            Swal.fire({
              title: 'Success!',
              text: 'פרטיך עודכנו בהצלחה',
              icon: 'success',
              confirmButtonText: 'OK'
            });

            // Storing some part of response in sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(formData));
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: 'העדכון נכשל. אנא נסה שוב.',
              icon: 'error',
              confirmButtonText: 'Close'
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

  };




  return (
    <ThemeProvider theme={createTheme()}>
      <MenuLogo />
      <Container component="main" dir='rtl'>
        <CssBaseline />
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <Card sx={{ mt: 7, mb: 1, width: '100%' }}>
              <CardContent>

                <Box
                  sx={{
                    marginTop: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>

                  <Box sx={{ width: '20%' }}>
                    <img width="100%" src="src/Image/IconUpdate.png" alt="Update Icon" />
                  </Box>
                </Box>

                <Typography component="h1" variant="h5" fontWeight="bold" textAlign="center">
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

                  </Grid>
                  <CardActions>
                    <Button type="submit" fullWidth variant="contained" sx={{ mb: 2, ml: 2 }}>
                      אישור
                    </Button>
                    <Button fullWidth onClick={handleCancelClick} variant="contained" sx={{
                      mb: 2,
                      backgroundColor: 'CornflowerBlue',
                      color: 'white',
                      '&:hover': { backgroundColor: 'DeepSkyBlue' }
                    }}>
                      חזרה לדף הראשי
                    </Button>
                  </CardActions>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

