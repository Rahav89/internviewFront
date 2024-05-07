import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Card, CardContent, CardActions } from "@mui/material";
import Typography from "@mui/material/Typography";
import MenuLogo from "./MenuLogo";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/Visibility";
import { Container, Box } from "@mui/material";
import { updateIntern, GetInternByID } from "./Server.jsx";
import FloatingChatButton from './FloatingChatButton';
import EditIcon from '@mui/icons-material/Edit';

//------------------------------------------------------------------

export default function ProfileIntern() {
  const [currentUser, setCurrentUser] = useState(null);
  // הגדרת הטופס עם הנתונים הנוכחיים של המשתמש
  const [formData, setFormData] = useState({
    currentPassword: "",
    password_i: "",
    first_name: "",
    last_name: "",
    email_i: ""
  });

  useEffect(() => {
    const internID = JSON.parse(sessionStorage.getItem("currentUserID"));
    GetInternByID(internID) // Call GetInternByID to fetch intern data
      .then((data) => {
        setCurrentUser(data);
        //console.log(data)
        setFormData((prevData) => ({
          ...prevData,
          password_i: data.password_i,
          first_name: data.first_name,
          last_name: data.last_name,
          email_i: data.email_I
        }));
      })
      .catch((error) => {
        console.error("Error in GetInternByID: ", error);
      });
  }, []); // Empty dependency array ensures this runs only once after the initial render

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Function to handle button click
  const handleCancelClick = () => {
    navigate("/intern"); // Navigate to the intern page
  };

  //הפונקציות הללו משמשות לשינוי מצב ההצגה של סיסמאות, ממצב מוסתר למצב מוצג ולהפך
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleNewShowPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  // ניהול שגיאות בטופס
  const [formErrors, setFormErrors] = useState({
    password_i: false,
    passwordConfirmation: false,
    first_name: false,
    last_name: false,
    email_i: false
  });

  // טיפול בשינויים בשדות הטופס
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // אם מדובר בשדה האימייל, בצע ולידציה
    if (name === "email_i") {
      const isValidEmail = validateEmail(value);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email_i: !isValidEmail,
      }));
    }
  };

  //פונקציה הבודקת את הולידציה של הסיסמא
  function validatCurrentePassword(password) {
    //לאפשר למשתמש לא להכניס סיסמאות (כדי לשנות משהו אחר)
    if (password == "" && formData.password_i == "" ||
      password == "" && formData.password_i == currentUser.password_i) {
      return true;
    }
    //בודק שהסיסמה שהכניס היא הסיסמה הנוכחית שלו
    return currentUser.password_i == password;
  }

  // ולידציה לטקסט בלבד
  const validateTextOnly = (value) => {
    return /^[a-zA-Zא-ת ]*$/.test(value) && value !== "";
  };

  //פונקציה הבודקת את הולידציה של הסיסמא החדשה
  function validateNewPassword(password) {
    //לאפשר למשתמש לא להכניס סיסמאות (כדי לשנות משהו אחר)
    if (password == "" && formData.currentPassword == "" ||
      password == currentUser.password_i && formData.currentPassword == "") {
      return true;
    }
    //בודק שהסיסמא מכילה לפחות אות גדולה אחת ומספר אחד
    const uppercaseLetter = /[A-Z]/;
    const digit = /[0-9]/;
    return (
      uppercaseLetter.test(password) && digit.test(password)
    );
  }

  // פונקציה לבדיקת תקינות כתובת מייל
  function validateEmail(email) {
    console.log(email);
    const regex = /^[a-zA-Z0-9.+_-]+@gmail\.com$/;
    return regex.test(email);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const isPasswordValid = validatCurrentePassword(formData.currentPassword);
    const isPasswordConfirmationValid = validateNewPassword(formData.password_i);
    const isFirstNameValid = validateTextOnly(formData.firstName);
    const isLastNameValid = validateTextOnly(formData.lastName);
    const isEmailIValid = validateEmail(formData.email_i);

    console.log(isPasswordValid, isFirstNameValid, isLastNameValid, isEmailIValid);
    setFormErrors({
      password_i: !isPasswordValid,
      passwordConfirmation: !isPasswordConfirmationValid,
      firstName: !isFirstNameValid,
      lastName: !isLastNameValid,
      email_i: !isEmailIValid
    });

    //אם כל הולידציות תקינות - שלח עדכון לשרת
    if (isPasswordConfirmationValid && isPasswordValid && isFirstNameValid && isLastNameValid && isEmailIValid) {
      //טיפול במקרה שלא הכניס סיסמאות - ניתן לעדכן בכל זאת עם הסיסמה הקודמת
      let newPass = formData.password_i;
      if (formData.currentPassword == "" && formData.password_i == "") { newPass = currentUser.password_i; }
      // פונקציה לעדכון פרטי המתמחה בשרת
      updateIntern(currentUser.id, formData, newPass)
        .then((data) => {
          console.log('Submitting form data:', data);
          if (data) {
            Swal.fire({
              title: "Success!",
              text: "פרטיך עודכנו בהצלחה",
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "העדכון נכשל. אנא נסה שוב.",
              icon: "error",
              confirmButtonText: "Close",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <>
      <MenuLogo />
      <Container component="main" dir="rtl">
        <CssBaseline />
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={8} lg={6}>
            <Card sx={{ mt: 7, width: "100%", mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    marginTop: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ width: "100%", height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <EditIcon sx={{ fontSize: 'inherit' }} />
                  </Box>
                </Box>

                <Typography
                  component="h1"
                  variant="h6"
                  fontWeight="bold"
                  textAlign="center"
                >
                  עדכון פרטים
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="InternID"
                        id="InternID"
                        label="תעודת זהות"
                        autoComplete="תעודת זהות"
                        value={currentUser ? currentUser.id : ""}
                        error={formErrors.id}
                        helperText={
                          formErrors.id
                            ? "תעודת זהות חיייבת להכיל רק ספרות"
                            : ""
                        }
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="email_i"
                        id="email"
                        label="כתובת אימייל"
                        autoComplete="כתובת אימייל"
                        value={formData.email_i}
                        onChange={handleChange}
                        error={formErrors.email_i}
                        helperText={
                          formErrors.email_i ? "אנא הזן כתובת אימייל תקינה" : ""
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="currentPassword"
                        label="סיסמה נוכחית"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                        error={formErrors.password_i}
                        InputLabelProps={{
                          shrink: true, // make the label always appear above the TextField
                        }}
                        helperText={
                          formErrors.password_i
                            ? "הסיסמה לא תואמת לסיסמה הנוכחית"
                            : ""
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleToggleShowPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password_i"
                        label="סיסמה חדשה "
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        autoComplete="new-password"
                        onChange={handleChange}
                        error={formErrors.passwordConfirmation}
                        InputLabelProps={{
                          shrink: true, // This will make the label always appear above the TextField
                        }}
                        helperText={
                          formErrors.passwordConfirmation
                            ? "הסיסמה חייבת להכיל לפחות אות גדולה וספרות"
                            : ""
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleToggleNewShowPassword}
                                edge="end"
                              >
                                {showNewPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
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
                        value={formData.first_name}
                        onChange={handleChange}
                        error={formErrors.first_name}
                        helperText={
                          formErrors.first_name ? "יכול להכיל רק אותיות" : ""
                        }
                        InputLabelProps={{
                          style: { textAlign: "right", direction: "rtl" },
                        }}
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
                        helperText={
                          formErrors.last_name ? "יכול להכיל רק אותיות." : ""
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        name="interns_year"
                        id="interns_year"
                        label="שנת התמחות"
                        autoComplete="given-name"
                        value={currentUser ? currentUser.interns_year : ""}
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <CardActions>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 2,
                        ml: 2,
                      }}
                    >
                      אישור
                    </Button>
                    <Button
                      fullWidth
                      onClick={handleCancelClick}
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: "CornflowerBlue",
                        color: "white",
                        "&:hover": { backgroundColor: "DeepSkyBlue" },
                      }}
                    >
                      חזרה לדף הראשי
                    </Button>
                  </CardActions>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <FloatingChatButton />
    </>
  );
}
