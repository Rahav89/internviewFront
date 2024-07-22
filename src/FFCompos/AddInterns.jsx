import React from "react";
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
import FloatingChatButton from "./FloatingChatButton";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
// --------------------------------------------------
export default function AddInterns() {
  const [currentUser, setCurrentUser] = useState(null);
  // הגדרת הטופס עם הנתונים הנוכחיים של המשתמש
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email_i: "",
    internId: "",
    InternshipDate: "",
  });

  //   useEffect(() => {
  //     const internID = JSON.parse(sessionStorage.getItem("currentUserID"));
  //     GetInternByID(internID) // Call GetInternByID to fetch intern data
  //       .then((data) => {
  //         setCurrentUser(data);
  //         //console.log(data)
  //         setFormData((prevData) => ({
  //           ...prevData,
  //           password_i: data.password_i,
  //           first_name: data.first_name,
  //           last_name: data.last_name,
  //           email_i: data.email_I,
  //           internId:data.internId,
  //           InternshipDate: data.InternshipDate,
  //         }));
  //       })
  //       .catch((error) => {
  //         console.error("Error in GetInternByID: ", error);
  //       });
  //   }, []); // Empty dependency array ensures this runs only once after the initial render

  const navigate = useNavigate();

  // Function to handle button click
  const handleCancelClick = () => {
    navigate("/MangerPage"); // Navigate to the intern page
  };

  // ניהול שגיאות בטופס
  const [formErrors, setFormErrors] = useState({
    first_name: false,
    last_name: false,
    email_i: false,
    internId: false,
    InternshipDate: false,
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

    if (name === "internId") {
      const isValidId = validateId(value);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        internId: !isValidId,
      }));
    }

    if (name === "InternshipDate") {
      const isValidDate = validateDate(value);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        InternshipDate: !isValidDate,
      }));
    }
  };

  // ולידציה לטקסט בלבד
  const validateTextOnly = (value) => {
    return /^[a-zA-Zא-ת ]*$/.test(value) && value !== "";
  };

  // פונקציה לבדיקת תקינות כתובת מייל
  function validateEmail(email) {
    console.log(email);
    const regex = /^[a-zA-Z0-9.+_-]+@gmail\.com$/;
    return regex.test(email);
  }

  function validateId(id) {
    const regex = /^\d{9}$/;
    return regex.test(id);
  }

  function validateDate(date) {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    return selectedDate <= currentDate;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const isFirstNameValid = validateTextOnly(formData.first_name);
    const isLastNameValid = validateTextOnly(formData.last_name);
    const isEmailIValid = validateEmail(formData.email_i);
    const isIdValid = validateId(formData.internId);
    const isDateValid = validateDate(formData.InternshipDate);

    console.log(isFirstNameValid, isLastNameValid, isEmailIValid);
    setFormErrors({
      first_name: !isFirstNameValid,
      last_name: !isLastNameValid,
      email_i: !isEmailIValid,
      internId: !isIdValid,
      InternshipDate: !isDateValid,
    });

    // אם כל הולידציות תקינות - שלח עדכון לשרת
    if (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailIValid &&
      isIdValid &&
      isDateValid
    ) {
      // Perform the submit logic here
      console.log("All validations passed. Form can be submitted.");
      // For example, call an API to submit the form data
      // submitForm(formData);
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PersonAddAlt1Icon
                      sx={{
                        fontSize: "inherit",
                        width: "100px",
                        height: "40px",
                      }}
                    />
                  </Box>
                </Box>

                <Typography
                  component="h1"
                  variant="h6"
                  fontWeight="bold"
                  textAlign="center"
                >
                  הוספת מתמחה
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
                        name="internId"
                        id="internId"
                        label="תעודת זהות"
                        autoComplete="תעודת זהות"
                        value={formData.internId}
                        onChange={handleChange}
                        error={formErrors.internId}
                        helperText={
                          formErrors.internId
                            ? "תעודת זהות חייבת להכיל 9 ספרות"
                            : ""
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
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
                          shrink: true,
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
                        InputLabelProps={{
                          style: { textAlign: "right", direction: "rtl" },
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="date"
                        name="InternshipDate"
                        id="InternshipDate"
                        label="שנת התמחות"
                        autoComplete="given-name"
                        value={formData.InternshipDate}
                        onChange={handleChange}
                        error={formErrors.InternshipDate}
                        helperText={
                          formErrors.InternshipDate
                            ? "התאריך לא יכול להיות גדול מהתאריך הנוכחי"
                            : ""
                        }
                        InputLabelProps={{
                          style: { textAlign: "right", direction: "rtl" },
                          shrink: true,
                        }}
                        InputProps={{
                          style: { textAlign: "right", direction: "rtl" },
                        }}
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
                      הוספה
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
