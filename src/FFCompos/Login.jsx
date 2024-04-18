import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import doctorHomePic from '/src/Image/doctorHomePic.png'
import logoHomePic from '/src/Image/InternView.png';
import Swal from 'sweetalert2';
import { LogInIntern } from './Server.jsx';
//--------------------------------------------------

export default function Login(props) {
    //מעבר בין דפים דרך הראוטר
    const navigate = useNavigate();

    //צאק בוקס של צפייה בסיסמא - useState
    const [showPassword, setShowPassword] = React.useState(false);

    // אובייקט של הטופס - useState 
    const [formData, setFormData] = React.useState({
        internId: '',
        password: '',
    });

    // אובייקט של שגיאות הטופס - useState 
    const [formErrors, setFormErrors] = React.useState({
        internId: false,
        password: false,
    });

    // פונקציה המטפלת בצ'אק בוקס של הסיסמא - בכל לחיצה נשנה מאמת לשקר ולהפך
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    //פונקציה הבודקת את הולידציה של שם משתמש
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
        const isInternIdValid = validateInternId(formData.internId);
        const isPasswordValid = validatePassword(formData.password);

        setFormErrors((prevErrors) => ({
            ...prevErrors,
            internId: !isInternIdValid,
            password: !isPasswordValid,
        }));

        if (!isInternIdValid || !isPasswordValid) { return };

        //בדיקה האם המשתמש קיים
        let currentUser;
        LogInIntern(formData.internId, formData.password)
            .then((data) => {
                currentUser = data;
                //console.log("Current user:", currentUser);

                if (currentUser) {
                    // Save the user in sessionStorage if found
                    sessionStorage.setItem('currentUserID', JSON.stringify(currentUser.id));
                    sessionStorage.setItem('currentUserYear', JSON.stringify(currentUser.interns_year));
                    // Show a toast message that the user has logged in successfully
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1000, // Adjust the time as needed
                        timerProgressBar: true,
                    });
                    Toast.fire({
                        icon: 'success',
                        title: 'Logged in successfully'
                    });
                    // Automatically navigate to '/intern' after the toast message
                    setTimeout(() => {
                        navigate('/intern');
                    }, 1000); // Match this time with the timer above
                }
            })
            .catch((error) => {
                // The user failed to log in - incorrect username or password
                Swal.fire({
                    icon: 'error',
                    title: 'Login failed',
                    text: 'intern Id or Password is incorrect.',
                });
                console.error("Error logging in:", error);
            });
    }


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: '100vh', // Take at least full height of the viewport
                    justifyContent: 'flex-start', // Align content to the top
                    pt: 1, // Add padding top to push content down a bit
                }}
            >
                <img className="logoImage" src={logoHomePic} alt="Logo" />
                <Avatar sx={{ width: 300, height: 300, mb: 1 }} src={doctorHomePic} />
                <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
                    Login in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                autoFocus
                                name="internId"
                                id="internId"
                                label="intern Id"
                                autoComplete="internId"
                                error={formErrors.internId}
                                helperText={formErrors.internId ? 'The ID must contain nine digits.' : ""}
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
                                helperText={formErrors.password ? "The password must contain capital letters and numbers" : ''}
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
                        sx={{ mt: 2, mb: 2 }}
                    >
                        LogIn
                    </Button>
                </Box>
            </Box>
        </Container>

    );
}


