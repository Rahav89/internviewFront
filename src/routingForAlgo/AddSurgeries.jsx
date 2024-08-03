import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Grid, Container, Button, Typography, Link } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import MenuLogo from "../FFCompos/MenuLogo";

// Create a styled component for visually hidden inputs
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

export default function AddSurgeries() {
  const navigate = useNavigate();
  const [dataObjects, setDataObjects] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assuming the first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert the sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Map each row to an object, skipping the header row
      const objects = jsonData.slice(1).map(row => ({
        caseNumber: row[0],     
        patientAge: row[1],     
        surgeryDateTime: row[2], 
        componentsUsed: row[3], 
        hospital: row[4],      
        productionCodes: row[5] 
      }));

      setDataObjects(objects);
      console.log(JSON.stringify(objects));
    };

    reader.readAsArrayBuffer(file);
  };

  const handleNavigate = () => {
    navigate("/new-page"); // Update the path to the new page
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
              שים ❤️️ - על האקסל להיות בפורמט המתאים
            </Typography>
            <Link
              href="/exelFormat.xlsx" // Ensure the file is in the public directory
              download
              underline="none"
              sx={{ mt: 1, display: "block", textAlign: "center" }}
            >
              [<b>לחץ</b> על מנת לעבוד על אקסל בפורמט]
            </Link>
          </Grid>

          <Grid item>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                width: "300px", // Set fixed width
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
              <VisuallyHiddenInput type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </Button>
          </Grid>

          <Grid item>
            <Typography variant="h6" align="center">
              נתונים שהועלו:
            </Typography>
            <ul>
              {dataObjects.map((obj, index) => (
                <li key={index}>
                  <strong>מספר מקרה:</strong> {obj.caseNumber}, <strong>גיל מטופל:</strong> {obj.patientAge}, <strong>תאריך ושעת הניתוח:</strong> {obj.surgeryDateTime}, <strong>רמת מורכבות:</strong> {obj.componentsUsed}, <strong>בית חולים:</strong> {obj.hospital}, <strong>קודי הפרוצדורות:</strong> {obj.productionCodes}
                </li>
              ))}
            </ul>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
