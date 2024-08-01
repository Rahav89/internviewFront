import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Grid,
  Container,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import MenuLogo from "../FFCompos/MenuLogo";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { Update_Algorithm_Weights, Get_Algorithm_Weights } from "./Server.jsx"; // Import your fetch function here
import Swal from 'sweetalert2';

///------------------------------------------------------
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function MatchingAlgo() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [difficulty, setDifficulty] = useState(0);
  const [year, setYear] = useState(0);
  const [skill, setSkill] = useState(0);
  const [syllabus, setSyllabus] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch weights from the server when the component mounts
    Get_Algorithm_Weights()
      .then((weights) => {
        console.log(weights)
        setDifficulty(weights.yearDifficulty || 25);
        setYear(weights.yearWeight || 25);
        setSkill(weights.skills || 25);
        setSyllabus(weights.syllabusWeight || 25);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "שגיאה בקבלת המשקלים",
          text: error.message,
        });
      });
  }, []); // Empty dependency array to run only once on component mount

  const handleNavigate = () => {
    navigate("/new-page"); // עדכן את הנתיב לדף החדש
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = () => {
    const total = difficulty + year + skill + syllabus;
    if (total !== 100) {
      setErrorMessage("הסכום הכולל של הערכים חייב להיות 100");
    } else {
      setErrorMessage("");
      const weights = {
        Skills: skill,
        YearWeight: year,
        YearDifficulty: difficulty,
        SyllabusWeight: syllabus,
      };

      Update_Algorithm_Weights(weights)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "!המשקלים עודכנו בהצלחה",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "שגיאה בעדכון המשקלים",
            text: error.message,
          });
        });
    }
  };

  return (
    <>
      <MenuLogo />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 3 }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item>
            <Button
              component="label"
              variant="contained"
              startIcon={<PublishedWithChangesIcon />}
              sx={{
                width: "300px", // קבע רוחב קבוע
                backgroundColor: "white",
                color: "#1976d2",
                borderColor: "#1976d2",
                borderWidth: 2,
                borderStyle: "solid",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  borderColor: "darkblue",
                },
              }}
              onClick={handleToggleForm}
            >
              בחירת משקלים לשיבוץ
            </Button>
            {showForm && (
              <Box mt={2} width="100%">
                <Typography variant="h6" fontWeight={"bold"}>
                  בחירת משקלים לשיבוץ
                </Typography>
                <TextField
                  label="רמת קושי של הניתוח"
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  fullWidth
                  margin="normal"
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                />
                <TextField
                  label="שנת ההתמחות"
                  fullWidth
                  inputProps={{ min: 0, max: 100 }}
                  type="number"
                  margin="normal"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
                <TextField
                  label="מיומנות של המתמחה"
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  fullWidth
                  margin="normal"
                  value={skill}
                  onChange={(e) => setSkill(Number(e.target.value))}
                />
                <TextField
                  label="סילבוס פר ניתוח"
                  fullWidth
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  margin="normal"
                  value={syllabus}
                  onChange={(e) => setSyllabus(Number(e.target.value))}
                />
                {errorMessage && (
                  <Typography color="error">{errorMessage}</Typography>
                )}
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#1976d2",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "darkblue",
                    },
                  }}
                  onClick={handleSubmit}
                >
                  אישור
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                width: "300px", // קבע רוחב קבוע
                backgroundColor: "white",
                color: "#1976d2",
                borderColor: "#1976d2",
                borderWidth: 2,
                borderStyle: "solid",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  borderColor: "darkblue",
                },
              }}
            >
              העלאת טבלת תורנויות
              <VisuallyHiddenInput type="file" accept=".xlsx, .xls" />
            </Button>
          </Grid>
          <Grid item>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                width: "300px", // קבע רוחב קבוע
                backgroundColor: "white",
                color: "#1976d2",
                borderColor: "#1976d2",
                borderWidth: 2,
                borderStyle: "solid",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  borderColor: "darkblue",
                },
              }}
            >
              העלאת טבלת ניתוחים עתידיים
              <VisuallyHiddenInput type="file" accept=".xlsx, .xls" />
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleNavigate}
              sx={{
                width: "300px", // קבע רוחב קבוע
                backgroundColor: "#1976d2",
                color: "white",
                "&:hover": {
                  backgroundColor: "darkblue",
                },
              }}
            >
              מצא שיבוץ
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
