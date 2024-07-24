import React, { useEffect, useState, useMemo } from "react";
import MenuLogo from "./MenuLogo";
import { Autocomplete, TextField, Box, Typography, CircularProgress } from "@mui/material";
import { GetInterns, GetCountProceduresByIntern } from "./Server.jsx";
import DetailedSyllabusTable from "./TableFullSyllabus.jsx";

export default function ShowSyllabusPerIntern() {
  const [data, setData] = useState([]); // Data from server
  const [selectedInternId, setSelectedInternId] = useState(null);
  const [selectedInternDetails, setSelectedInternDetails] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the server
    async function fetchData() {
      try {
        const result = await GetInterns();
        setData(result);
        console.log(result)
      } catch (error) {
        setError("Failed to fetch interns");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAutocompleteChange = (event, value) => {
    if (value === null) {
      setSelectedInternId(null);
      setSelectedInternDetails(null);
    } else {
      const selectedIntern = data.find(
        (intern) => `${intern.first_name} ${intern.last_name}` === value
      );
      if (selectedIntern) {
        setSelectedInternId(selectedIntern.id);
        setSelectedInternDetails(selectedIntern);
      }
    }
  };

  const options = useMemo(
    () => data.map((option) => `${option.first_name} ${option.last_name}`),
    [data]
  );

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
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Autocomplete
            options={options}
            renderInput={(params) => (
              <TextField {...params} label="בחר מתמחה" variant="outlined" />
            )}
            sx={{ width: 300, m: 2, direction: "rtl" }}
            onChange={handleAutocompleteChange}
          />
        )}
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
