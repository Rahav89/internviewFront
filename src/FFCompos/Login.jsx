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

    //פונקציה הבודקת את הולידציה של שם משתמש
    function validateUserName(userName) {
        const regex = /^[0-9]+$/; // תבנית של מספרים בלבד
        // אם המחרוזת עומדת בתנאי התווים של התבנית ואינה מחרוזת ריקה, מחזיר true
        return regex.test(userName) && userName != '';
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
        let currentUser;

        loginUser(formData.userName, formData.password)
            .then((data) => {
                currentUser = data;
                console.log("Current user:", currentUser);

                if (currentUser) {
                    // Save the user in sessionStorage if found
                    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                    // props.putLoggedUser(currentUser);
                    // Show a success message that the user has logged in successfully
                    Swal.fire("Logged in successfully", "Welcome back!", "success").then((result) => {
                        if (result.isConfirmed) {
                            // props.LoggedIn(true); // Show the profile
                            // props.LoggedInAdmin(false); // Hide the admin
                        }
                    });
                } else {
                    // The user failed to log in - incorrect username or password
                    Swal.fire({
                        icon: 'error',
                        title: 'Login failed',
                        text: 'Username or Password is incorrect.',
                    });
                }
            })
            .catch((error) => {
                console.error("Error logging in:", error);
            });
    }


    //פונקציה המקבלת שם משתמש וסיסמה ובודקת אם קיים משתמש שפרטיו זהים
    const loginUser = (username, password) => {
        const userObject = {
            Id: username,
            Password_i: password,
            First_name: "",
            Last_name: "",
            Interns_year: "",
            Interns_rating: 0
        };

        return fetch('https://localhost:7220/api/Intenrs/LogInIntern', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            }),
            body: JSON.stringify(userObject)
        })
            .then(response => {
                console.log('res.status', res.status);
                console.log('res.ok', res.ok);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                console.log("fetch result = ", result);
                return result;
            })
            .catch(error => {
                console.error("Error in loginUser: ", error);
                throw error; // Rethrow the error so it can be handled by the caller
            });
    };


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
                    {/* <Grid container>
            <Grid item>
              <Link href="#" variant="body2" onClick={changePageToRegister}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid> */}
                    {/* </Grid> */}
                </Box>
            </Box>
            
        </Container>

    );
}


