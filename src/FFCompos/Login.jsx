import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


export default function Login(props) {

  //צאק בוקס של צפייה בסיסמא - useState
  const [showPassword, setShowPassword] = React.useState(false);

  // אובייקט של הטופס - useState 
  const [formData, setFormData] = React.useState({
    userName: '',
    password: '',
  });

  // אובייקט של שגיאות הטופס - useState 
  const [formErrors, setFormErrors] = React.useState({
    userName: false,
    password: false,
  });


  // פונקציה המטפלת בצ'אק בוקס של הסיסמא - בכל לחיצה נשנה מאמת לשקר ולהפך
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  //פונקצית שינוי עמודים מהלוג אין לרגיסטר
  const changePageToRegister = () => {
    props.moveToLogInFlag(false);
  }

  //פונקציה הבודקת את הולידציה של שם משתמש
  function validateUserName(userName) {
    const regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;
    if (formData.userName === "admin") {
      return formData.userName;
    }
    // תבנית של אותיות לועזיות בלבד מספרים ותווים מיוחדים
    // אם האורך מתחת ל 60 תווים וגם עומד בתנאי התווים של התבנית true מחזיר
    return userName.length <= 60 && regex.test(userName) && userName != '';
  }

  //פונקציה הבודקת את הולידציה של הסיסמא
  function validatePassword(password) {
    if (formData.password === "ad12343211ad") {
      return formData.password;
    }
    //בודק שהסיסמא בין 7 ל-12 תווים
    if (password.length < 7 || password.length > 12) {
      return false;
    }
    //בודק שהסיסמא מכילה לפחות תו מיוחד אחד, אות גדולה אחת ומספר אחד
    const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    const uppercaseLetter = /[A-Z]/;
    const digit = /[0-9]/;
    return (
      specialCharacters.test(password) &&
      uppercaseLetter.test(password) &&
      digit.test(password)
    );
  }

  const handleChange = (event) => {
    //const name = event.target.name  :דרך קיצור לכתוב כמה פעמים   
    const { name, value } = event.target;

    //שמאפיין את כל שדות הטופס (עדכון של האובייקט) useState-שמירת הערך שנכתב בשדה ל  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isUserNameValid = validateUserName(formData.userName);
    const isPasswordValid = validatePassword(formData.password);

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      userName: !isUserNameValid,
      password: !isPasswordValid,
    }));

    //בדיקה האם המשתמש קיים
    let currentUser = loginUser(formData.userName, formData.password);

    if (formData.userName === "admin" && formData.password === "ad12343211ad") {
      Swal.fire("Logged in successfully", "Welcome back!", "success").then((result) => {
        // Check if the user clicked the "OK" button
        if (result.isConfirmed) {
          sessionStorage.setItem('currentUser', JSON.stringify("admin"));
          props.LoggedInAdmin(true);//תציג לי את האדמין
          props.LoggedIn(false);//אל תציג את הפרופיל
        }
      });
    } else if (currentUser && isUserNameValid && isPasswordValid) {
      //לשמור אותו בסטורג אם מצאנו אותו
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      props.putLoggedUser(currentUser);
      //הודעה שהיוזר התחבר בהצלחה
      Swal.fire("Logged in successfully", "Welcome back!", "success").then((result) => {
        // Check if the user clicked the "OK" button
        if (result.isConfirmed) {
          props.LoggedIn(true);//תציג לי את הפרופיל
          props.LoggedInAdmin(false);//אל תציג לי את האדמין
        }
      });
    }
    else {//היוזר לא הצליח להתחבר - שם או סיסמא לא נכונים
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: 'Username or Password is incorrect.',
      });
    }
  }

  
  //פונקציה המקבלת שם משתמש וסיסמה ובודקת אם קיים משתמש שפרטיו זהים
  const loginUser = (username, password) => {
    console.log(username, password);
    //רשימה שלוקחים מהאבא
    let userList = props.usersListFromApp;
    //חיפוש שם משתמש וסיסמא מתאימים 
    let foundUser = userList.find(user => user.userName === username && user.password === password);
    //בדיקה אם מצאנו את היוזר
    if (foundUser) { return foundUser; }
    return null;
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} >
              <TextField
                required
                fullWidth
                autoFocus
                name="userName"
                id="userName"
                label="User Name"
                autoComplete="username"
                error={formErrors.userName}
                helperText={formErrors.userName ? 'User Name must contain foreign letters only, numbers and special characters. No more than 60 characters. ' : ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                id="password"
                label="Password"
                autoComplete="new-password"
                error={formErrors.password}
                helperText={formErrors.password ? "Password must be 7-12 characters long and include at least one special character, one uppercase letter, and one digit." : ''}
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
              />
            </Grid>
          </Grid>

          <FormControlLabel
            control={<Checkbox checked={showPassword} onChange={handleShowPassword} color="primary" />}
            label="Show Password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="#" variant="body2" onClick={changePageToRegister}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>

  );
}


