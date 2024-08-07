import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import * as XLSX from "xlsx";
import MenuLogo from "../FFCompos/MenuLogo";
import excelImage from "../Image/exelPhoto.png";
import { styled } from "@mui/material/styles";
import { InsertSurgery, GetAllProcedure } from "../FFCompos/Server.jsx";
import Swal from "sweetalert2";

const VisuallyHiddenInput = styled("input")({
  position: "absolute",
  left: "-9999px",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  opacity: 0,
  pointerEvents: "none",
});

function convertExcelTimeToReadableTime(excelTime) {
  const totalMinutes = Math.round(excelTime * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function convertExcelDateToJSDate(excelDate) {
  if (typeof excelDate === "string" && excelDate.includes(".")) {
    const parts = excelDate.split(".");
    if (parts.length !== 3) {
      return excelDate;
    }
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
  const year = jsDate.getUTCFullYear();
  const month = (jsDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = jsDate.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AddSurgeries() {
  const [loadedSurgeries, setLoadedSurgeries] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSingleForm, setOpenSingleForm] = useState(false);
  const [hasIncomplete, setHasIncomplete] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [newSurgery, setNewSurgery] = useState({
    caseNumber: "",
    patientAge: "",
    surgeryDate: "",
    surgeryTime: "",
    difficultyLevel: "",
    productionCodes: [],
  });
  const [procedures, setProcedures] = useState([]);

  useEffect(() => {
    GetAllProcedure()
      .then((data) => {
        setProcedures(data);
      })
      .catch((error) => {
        console.error("Error fetching procedures: ", error);
      });
  }, []);

  const handleSingleFormChange = (event) => {
    const { name, value } = event.target;
    setNewSurgery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      let incomplete = false;
      const objects = jsonData
        .slice(1)
        .filter((row, index) => {
          if (!Array.isArray(row)) {
            console.error(`Row ${index + 1} is not an array:`, row);
            return false;
          }

          const hasData = row.some(
            (cell) => cell !== undefined && cell !== null && cell !== ""
          );
          if (!hasData) return false;

          const isComplete =
            row.length >= 6 &&
            row[0] &&
            row[1] &&
            row[2] &&
            row[3] &&
            row[4] &&
            row[5];
          if (!isComplete) {
            incomplete = true;
            console.warn(`Incomplete data on row ${index + 1}:`, row);
          }
          return isComplete;
        })
        .map((row) => ({
          caseNumber: row[0],
          patientAge: row[1],
          surgeryDate: convertExcelDateToJSDate(row[2]),
          surgeryTime: convertExcelTimeToReadableTime(row[3]),
          difficultyLevel: row[4],
          productionCodes: row[5],
        }));

      setHasIncomplete(incomplete);
      setLoadedSurgeries(objects);
      setOpenDialog(true);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownload = (event) => {
    event.preventDefault();
    const link = document.createElement("a");
    link.href = "/exelFormat.xlsx";
    link.download = "exelFormat.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleContinueDialog = async () => {
    let successfulSurgeries = [];

    await Promise.all(
      loadedSurgeries.map(async (surgery) => {
        try {
          if (new Date(surgery.surgeryDate) < new Date()) {
            Swal.fire({
              icon: "error",
              title: "תאריך לא תקין",
              text: "לא ניתן לקבוע תאריך ניתוח לפני התאריך הנוכחי.",
            });
            return;
          }

          const response = await InsertSurgery({
            surgery_id: 0,
            case_number: surgery.caseNumber,
            patient_age: surgery.patientAge,
            surgery_date:
              surgery.surgeryDate + "T" + surgery.surgeryTime + ":00",
            difficulty_level: surgery.difficultyLevel,
            production_codes: surgery.productionCodes,
            hospital_name: "",
          });

          console.log("Surgery inserted:", response);

          if (response !== -1 && response !== -2) {
            successfulSurgeries.push(surgery);
          } else {
            let errorMsg = "";

            if (response === -1) {
              errorMsg = `קיים ניתוח חופף בזמנים בתאריך הניתן`;
            } else if (response === -2) {
              errorMsg = "קיימים כבר 2 ניתוחים בתאריך הניתן";
            }

            Swal.fire({
              icon: "warning",
              title: "הוספת ניתוח אחד או יותר נכשלה",
              text: errorMsg,
            });
          }
        } catch (error) {
          console.error("Error inserting surgery:", error);
        }
      })
    );

    setSurgeries(successfulSurgeries);
    setOpenDialog(false);
    setIsConfirmed(true);
  };

  const handleOpenSingleForm = () => {
    setOpenSingleForm(true);
  };

  const handleCloseSingleForm = () => {
    setOpenSingleForm(false);
    setNewSurgery({
      caseNumber: "",
      patientAge: "",
      surgeryDate: "",
      surgeryTime: "",
      difficultyLevel: "",
      productionCodes: [],
    });
  };

  const handleSingleFormSubmit = async () => {
    try {
      // Validate the surgery date
      if (new Date(newSurgery.surgeryDate) < new Date()) {
        Swal.fire({
          icon: "error",
          title: "תאריך לא תקין",
          text: "לא ניתן לקבוע תאריך ניתוח לפני התאריך הנוכחי.",
        });
        return;
      }

      const response = await InsertSurgery({
        surgery_id: 0,
        case_number: newSurgery.caseNumber,
        patient_age: newSurgery.patientAge,
        surgery_date:
          newSurgery.surgeryDate + "T" + newSurgery.surgeryTime + ":00",
        difficulty_level: newSurgery.difficultyLevel,
        production_codes: newSurgery.productionCodes.join(", "),
        hospital_name: "הלל יפה",
      });

      console.log("Single surgery inserted:", response);

      if (response !== -1 && response !== -2) {
        setSurgeries([newSurgery]);
        setIsConfirmed(true);
      } else {
        let errorMsg = "";

        if (response === -1) {
          errorMsg = `קיים ניתוח חופף בזמנים בתאריך ${newSurgery.surgeryDate}`;
        } else if (response === -2) {
          errorMsg = "תאריך זה כבר קיים במערכת";
        }

        Swal.fire({
          icon: "error",
          title: "הוספת ניתוח נכשלה",
          text: errorMsg,
        });
      }
    } catch (error) {
      console.error("Error inserting single surgery:", error);
    }

    handleCloseSingleForm();
  };

  return (
    <>
      <MenuLogo />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 3 }}>
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
              onClick={handleOpenSingleForm}
              startIcon={<ContentPasteIcon />}
              sx={{
                width: "300px",
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
              העלאת ניתוח בודד
            </Button>
          </Grid>

          <Grid item>
            <Typography variant="h6" align="center">
              ניתן להעלות גם ניתוחים בעזרת אקסל <br />
              שים ❤️️ - על האקסל להיות <b> בפורמט המתאים</b>
            </Typography>
            <img
              src={excelImage}
              alt="Excel Format"
              style={{ cursor: "pointer", width: "100px" }}
              onClick={handleDownload}
            />
            <Typography
              variant="body1"
              align="center"
              sx={{ mt: -1.5, color: "green" }}
              onClick={handleDownload}
            >
              לחץ על התמונה על מנת לעבוד <b> בפורמט</b>
            </Typography>
          </Grid>

          <Grid item>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                width: "300px",
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
              העלאת ניתוחים בקובץ אקסל
              <VisuallyHiddenInput
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                aria-label="Upload Excel file"
                tabIndex="-1"
              />
            </Button>
          </Grid>

          {isConfirmed && (
            <Grid item>
              {surgeries.length > 0 ? (
                <>
                  <Typography variant="h6" align="center">
                    :ניתוחים שהועלו מקובץ האקסל
                  </Typography>
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table sx={{ direction: "rtl"}}>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "rgb(25 118 210)" ,color:'white',textAlign:'center'}}>
                          <TableCell align="right" sx={{ color: 'white' }}>מספר מקרה</TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>גיל מטופל</TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>תאריך הניתוח</TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>שעת הניתוח</TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>רמת מורכבות</TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>קודי הפרוצדורות</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {surgeries.map((obj, index) => (
                          <TableRow key={index}>
                            <TableCell>{obj.caseNumber}</TableCell>
                            <TableCell>{obj.patientAge}</TableCell>
                            <TableCell>{obj.surgeryDate}</TableCell>
                            <TableCell>{obj.surgeryTime}</TableCell>
                            <TableCell>{obj.difficultyLevel}</TableCell>
                            <TableCell>{obj.productionCodes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Typography variant="h6" align="center">
                  לא הועלה אף ניתוח למערכת
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {hasIncomplete
              ? "Some rows have missing data. Are you sure you want to upload the file?"
              : "Are you sure you want to upload the selected data?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleContinueDialog} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSingleForm} onClose={handleCloseSingleForm}>
        <DialogTitle>הכנס ניתוח בודד</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="מספר מקרה"
            name="caseNumber"
            fullWidth
            value={newSurgery.caseNumber}
            onChange={handleSingleFormChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="גיל מטופל"
            name="patientAge"
            type="number"
            fullWidth
            value={newSurgery.patientAge}
            onChange={handleSingleFormChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="תאריך הניתוח"
            name="surgeryDate"
            type="date"
            fullWidth
            value={newSurgery.surgeryDate}
            onChange={handleSingleFormChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="שעת הניתוח"
            name="surgeryTime"
            type="time"
            fullWidth
            value={newSurgery.surgeryTime}
            onChange={handleSingleFormChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="רמת מורכבות"
            name="difficultyLevel"
            select
            fullWidth
            value={newSurgery.difficultyLevel}
            onChange={handleSingleFormChange}
          >
            {[1, 2, 3, 4, 5].map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
          <FormControl fullWidth margin="dense">
            <InputLabel id="procedure-code-label">קודי הפרוצדורות</InputLabel>
            <Select
              labelId="procedure-code-label"
              name="productionCodes"
              value={newSurgery.productionCodes}
              onChange={(event) =>
                setNewSurgery((prevState) => ({
                  ...prevState,
                  productionCodes: event.target.value,
                }))
              }
              label="קודי הפרוצדורות"
              multiple
            >
              {procedures.map((procedure) => (
                <MenuItem
                  key={procedure.procedure_Id}A
                  value={procedure.procedure_Id}
                >
                  {procedure.procedure_Id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSingleForm} color="primary">
            ביטול
          </Button>
          <Button onClick={handleSingleFormSubmit} color="primary">
            הוספת ניתוח
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
