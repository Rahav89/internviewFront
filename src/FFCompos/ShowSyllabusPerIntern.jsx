import React, { useEffect, useState } from "react";
import MenuLogo from "./MenuLogo";
import { Autocomplete, TextField, Box, Typography } from "@mui/material";
import { GetCountProceduresByIntern } from "./Server.jsx";
import DetailedSyllabusTable from "./TableFullSyllabus.jsx";
//---------------------------------------------------------------

export default function ShowSyllabusPerIntern() {
  const [data, setData] = useState([]); // נתונים המגיעים מהשרת
  const [selectedInternId, setSelectedInternId] = useState(null); // Changed to null for better null-checking
  const [selectedInternDetails, setSelectedInternDetails] = useState(null); // פרטי המתמחה הנבחר
  const [currentUserId, setCurrentUserId] = useState(null); // פרטי המשתמש הנוכחי המחובר לאתר

  useEffect(() => {
    // Fetch data from the server
    async function fetchData() {
      const result = await GetCountProceduresByIntern();
      setData(result);
    }
    fetchData();
  }, []);

  return (
    <>
      <MenuLogo />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight={600}>
          צפייה בסילבוס של מתמחה
        </Typography>
        <Autocomplete
          options={data.map(
            (option) => `${option.firstName} ${option.lastName}`
          )}
          renderInput={(params) => (
            <TextField {...params} label="בחר מתמחה" variant="outlined" />
          )}
          sx={{ width: 300, m: 2, direction: 'rtl' }}
          onChange={(event, value) => {
            if (value === null) {
              setSelectedInternId(null);
              setSelectedInternDetails(null);
            } else {
              const selectedIntern = data.find(
                (intern) => `${intern.firstName} ${intern.lastName}` === value
              );
              if (selectedIntern) {
                setSelectedInternId(selectedIntern.internId);
                setSelectedInternDetails(selectedIntern);
              }
            }
          }}
        />
      </Box>
      {selectedInternDetails && (
        <>
          {/* Commenting out the intern's details display box */}
          {/* <Box sx={{ m: 2, display: "flex", justifyContent: "center" }}>
            <Typography variant="h5">
              התקדמות של {selectedInternDetails.firstName} {selectedInternDetails.lastName} בסילבוס הניתוחים
            </Typography>
          </Box> */}
          <Box
            sx={{
              m: 4,
              display: "flex",
              justifyContent: "center",
              marginTop: -20,
            }}
          >
            <DetailedSyllabusTable internIdFromView={selectedInternId} />
          </Box>
        </>
      )}
    </>
  );
}
