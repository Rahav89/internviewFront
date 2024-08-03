import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Grid, Container, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import MenuLogo from "../FFCompos/MenuLogo";
import excelImage from "../Image/exelPhoto.png"; // Update the path accordingly

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

function convertExcelTimeToReadableTime(excelTime) {
  const totalMinutes = Math.round(excelTime * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export default function AddSurgeries() {
  const [surgeries, setSurgeries] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

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

      let hasIncomplete = false;
      const objects = jsonData.slice(1).filter((row) => {
        // Check if the row is not completely empty
        const hasData = row.some((cell) => cell !== undefined && cell !== null && cell !== "");
        if (!hasData) return false; // Skip completely empty rows

        // Check if the row has all necessary data
        const isComplete = row[0] && row[1] && row[2] && row[3] && row[4] && row[5];
        if (!isComplete) {
          hasIncomplete = true;
        }
        return isComplete;
      }).map((row) => ({
        caseNumber: row[0],
        patientAge: row[1],
        surgeryDate: row[2],
        surgeryTime: convertExcelTimeToReadableTime(row[3]),
        Difficulty_level: row[4],
        productionCodes: row[5],
      }));

      setOpenDialog(hasIncomplete);
      setSurgeries(objects);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownload = (event) => {
    event.preventDefault(); // Prevent the default link behavior
    // Trigger the download
    const link = document.createElement("a");
    link.href = "/exelFormat.xlsx"; // Make sure this path is correct
    link.download = "exelFormat.xlsx"; // Optional: specify a filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <MenuLogo />
      <Container maxWidth="lg" sx={{ mt: 5, mb: 3 }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item>
            <Typography variant="h6" align="center">
              כאן ניתן להעלות ניתוחים בעזרת אקסל <br />
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
              />
            </Button>
          </Grid>

          <Grid item>
            <Typography variant="h6" align="center">
              נתונים שהועלו:
            </Typography>
            <ul>
              {surgeries.map((obj, index) => (
                <li key={index}>
                  <strong>מספר מקרה:</strong> {obj.caseNumber},{" "}
                  <strong>גיל מטופל:</strong> {obj.patientAge},{" "}
                  <strong>תאריך הניתוח:</strong> {obj.surgeryDate},{" "}
                  <strong>שעת הניתוח:</strong> {obj.surgeryTime},{" "}
                  <strong>רמת מורכבות:</strong> {obj.Difficulty_level},{" "}
                  <strong>קודי הפרוצדורות:</strong> {obj.productionCodes}
                </li>
              ))}
            </ul>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Some rows have missing data. Are you sure you want to upload the file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
