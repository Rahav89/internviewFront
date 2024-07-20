import React, { useState, useEffect } from "react";
import MenuLogo from "./MenuLogo.jsx";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import FloatingChatButton from "./FloatingChatButton";
import { GetAllProcedure, GetInternSurgeriesByProcedure } from "./Server.jsx";

//-------------------------------------
export default function CardsDetailsInterns() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchHospital, setSearchHospital] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const internId = JSON.parse(sessionStorage.getItem("currentUserID")) || 0;
  const procedure_Id = location.state?.procedureId || 0;
  const theme = useTheme();
  const [procedures, setProcedures] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  useEffect(() => {
    GetAllProcedure()
      .then((data) => {
        console.log(data);
        setProcedures(data);
      })
      .catch((error) => {
        console.error("Error in GetAllProcedure: ", error);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (internId) {
      GetInternSurgeriesByProcedure(internId, procedure_Id)
        .then((fetchedData) => {
          console.log("Fetched data:", fetchedData);
          setData(fetchedData);
          setFilteredData(fetchedData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError("Failed to fetch data.");
          setLoading(false);
        });
    } else {
      setError("Invalid intern ID.");
      setLoading(false);
    }
  }, [internId, procedure_Id]);

  useEffect(() => {
    if (internId && selectedProcedure) {
      setLoading(true);
      GetInternSurgeriesByProcedure(internId, selectedProcedure.procedure_Id)
        .then((fetchedData) => {
          setData(fetchedData);
          setFilteredData(fetchedData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError("Failed to fetch data.");
          setLoading(false);
        });
    }
  }, [internId, selectedProcedure]);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        (selectedRole === "all" || item.Intern_role === selectedRole) &&
        (searchDate === "" ||
          new Date(item.Surgery_date).toLocaleDateString() ===
            new Date(searchDate).toLocaleDateString()) &&
        (searchHospital === "" || item.Hospital_name.includes(searchHospital))
    );
    setFilteredData(filtered);
  }, [searchDate, selectedRole, searchHospital, data]);

  const handleProcedureChange = (event, newValue) => {
    setSelectedProcedure(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchDate(event.target.value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleHospitalSearchChange = (event) => {
    setSearchHospital(event.target.value);
  };

  return (
    <>
      <MenuLogo />
      <Typography
        variant="h6"
        sx={{ marginTop: 8, textAlign: "center", fontWeight: "bold" }}
      >
        הצגת הניתוחים
      </Typography>
      <Box
        sx={{
          margin: "10px",
          display: "flex",
          justifyContent: "space-around",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 300 }}>
          <Autocomplete
            value={selectedProcedure}
            onChange={handleProcedureChange}
            options={procedures}
            getOptionLabel={(option) => option.procedureName || ""}
            renderInput={(params) => (
              <TextField {...params} label="בחירת שם ניתוח" fullWidth />
            )}
            isOptionEqualToValue={(option, value) =>
              option.procedureName === value.procedureName
            }
          />
        </Box>
      </Box>
      <Box
        sx={{
          margin: "10px",
          display: "flex",
          justifyContent: "space-around",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        <TextField
          type="date"
          value={searchDate}
          onChange={handleSearchChange}
          label="חפש תאריך ניתוח"
          InputLabelProps={{ shrink: true }}
          sx={{ width: "33%" }}
        />
        <TextField
          value={searchHospital}
          onChange={handleHospitalSearchChange}
          label="חפש לפי שם בית חולים"
          InputLabelProps={{ shrink: true }}
          sx={{ width: "33%", marginLeft: "3%" }}
        />
        <FormControl sx={{ width: "33%", marginLeft: "3%" }}>
          <InputLabel id="role-select-label">תפקיד בניתוח</InputLabel>
          <Select
            labelId="role-select-label"
            value={selectedRole}
            onChange={handleRoleChange}
            displayEmpty
            label="תפקיד בניתוח"
          >
            <MenuItem value="all">הכל</MenuItem>
            <MenuItem value="מנתח ראשי">מנתח ראשי</MenuItem>
            <MenuItem value="עוזר ראשון">עוזר ראשון</MenuItem>
            <MenuItem value="עוזר שני">עוזר שני</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ margin: "0 20px" }}>
          <TableContainer
            component={Paper}
            sx={{ direction: "rtl", boxShadow: 3 }}
          >
            <Table sx={{ minWidth: 550 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#1976D2" }}>
                <TableRow>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: "16px",
                    }}
                  >
                    שם הפרוצדורה
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: "16px",
                    }}
                  >
                    רמת קושי של הניתוח
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: "16px",
                    }}
                  >
                    שם בית חולים
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: "16px",
                    }}
                  >
                    תאריך הניתוח
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: "16px",
                    }}
                  >
                    תפקיד
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      אין נתונים זמינים להצגה.
                    </TableCell>
                  </TableRow>
                )}
                {filteredData.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:nth-of-type(even)": {
                        backgroundColor: "action.hover",
                      },
                      "&:hover": { backgroundColor: "action.selected" },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      align="right"
                      sx={{ fontSize: "14px" }}
                    >
                      {row.Procedure_name}
                    </TableCell>
                    <TableCell align="right">{row.Difficulty_level}</TableCell>
                    <TableCell align="right">{row.Hospital_name}</TableCell>
                    <TableCell align="right">
                      {new Date(row.Surgery_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">{row.Intern_role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        message={error}
      />
      <FloatingChatButton />
    </>
  );
}
