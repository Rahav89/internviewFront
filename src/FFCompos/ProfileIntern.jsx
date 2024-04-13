import React, { useState, useEffect } from 'react';
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

export default function ProfileIntern(props) {

  const navigate = useNavigate();

  // Function to handle button click
  const handleCancelClick = () => {
    navigate('/intern'); // Navigate to the intern page
  };

  // קבלת המשתמש הנוכחי מאחסון הפעילות (session storage)
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  console.log(currentUser);

  // הגדרת הטופס עם הנתונים הנוכחיים של המשתמש
  const [formData, setFormData] = useState({
    ...currentUser,
    password_i: '',          // Assuming this is your initial password field
    passwordConfirmation: '' // Adding a new field for the password confirmation
  });

  // ניהול שגיאות בטופס
  const [formErrors, setFormErrors] = useState({
    InternID: false,
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

  function validateInternId(internId) {
    const regex = /^[0-9]+$/; // תבנית של מספרים בלבד
    // אם המחרוזת עומדת בתנאי התווים של התבנית ואינה מחרוזת ריקה, מחזיר true
    return regex.test(internId) && internId != '';
  }

  //פונקציה הבודקת את הולידציה של הסיסמא
  function validatePassword(password) {
    //בודק שהסיסמא מכילה לפחות אות גדולה אחת ומספר אחד
    const uppercaseLetter = /[A-Z]/;
    const digit = /[0-9]/;
    return (
      uppercaseLetter.test(password) && digit.test(password)
    );
  }

  // ולידציה לטקסט בלבד
  const validateTextOnly = (value) => {
    return (/^[a-zA-Zא-ת ]*$/.test(value) && value !== '');
  };

  
  const submitFormData = async () => {
    try {
      // Simulating an API call
      console.log('Submitting form data:', formData);
      // You would typically use fetch or axios here:
      // const response = await fetch('https://your-api-endpoint', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();
      // console.log('Submission successful:', data);

      // For now, simulate a successful submission:
      alert('פרטיך עודכנו בהצלחה!');
    } catch (error) {
      console.error('Submission failed:', error);
      alert('העדכון נכשל. אנא נסה שוב.');
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const isInternIdValid = validateInternId(formData.internId);
    const isPasswordValid = validatePassword(formData.password_i);
    const isPasswordConfirmationValid = formData.password_i === formData.passwordConfirmation;
    const isFirstNameValid = validateTextOnly(formData.firstName);
    const isLastNameValid = validateTextOnly(formData.lastName);

    setFormErrors({
      InternID: !isInternIdValid,
      password_i: !isPasswordValid,
      passwordConfirmation: !isPasswordConfirmationValid,
      firstName: !isFirstNameValid,
      lastName: !isLastNameValid,
    });

    if (isInternIdValid && isPasswordValid && isPasswordConfirmationValid && isFirstNameValid && isLastNameValid) {
      // Proceed with form submission or further actions
      submitFormData(); // Call the function that handles the submission
    }

  };

  return (
    <>
      <MenuLogo />
      <ThemeProvider theme={createTheme()}>
        <Container component="main" maxWidth="xs" dir='rtl'>
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
                    required
                    fullWidth
                    name="InternID"
                    id="InternID"
                    label="תעודת זהות"
                    autoComplete="תעודת זהות"
                    value={formData.id}
                    onChange={handleChange}
                    error={formErrors.id}
                    helperText={formErrors.id ? "תעודת זהות חיייבת להכיל רק ספרות" : ''}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    id="password"
                    label="סיסמה"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password_i}
                    onChange={handleChange}
                    error={formErrors.password_i}
                    helperText={formErrors.password_i ? "הסיסמה חייבת להכיל לפחות אות גדולה וספרות" : ''}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="passwordConfirmation"
                    id="passwordConfirmation"
                    label="אימות סיסמה"
                    type="password"
                    autoComplete="new-password-confirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleChange}
                    error={formErrors.passwordConfirmation}
                    helperText={formErrors.passwordConfirmation ? "הסיסמאות אינן תואמות" : ''}
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
                    value={formData.first_name}
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
                    value={formData.last_name}
                    onChange={handleChange}
                    error={formErrors.last_name}
                    helperText={formErrors.last_name ? 'יכול להכיל רק אותיות.' : ""}

                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    name="interns_year"
                    id="interns_year"
                    label="שנת התמחות"
                    autoComplete="given-name"
                    value={formData.interns_year}
                    onChange={handleChange}
                    error={formErrors.interns_year}
                    helperText={formErrors.interns_year ? 'יכול להכיל רק אותיות' : ""}
                    InputLabelProps={{ style: { textAlign: 'right', direction: 'rtl' } }}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 1 }}
                  >
                    עדכון פרטים
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
