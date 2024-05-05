import React, { useState, useEffect } from "react";
import MenuLogo from "./MenuLogo.jsx";
import {
  Box, Card, CardHeader, CardContent,
  Avatar, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Snackbar, Autocomplete
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import surgeryDateImage from "/src/Image/surgerydate.png";
import FloatingChatButton from './FloatingChatButton';
import { GetAllNameProcedure, GetInternSurgeriesByProcedure, GetInternSurgeriesByProcedureName } from "./Server.jsx";

//-------------------------------------
export default function CardsDetailsInterns() {
  const [data, setData] = useState([]); // נתונים ראשוניים שנשלפים מהשרת
  const [filteredData, setFilteredData] = useState([]); // נתונים מסוננים בהתבסס על קריטריוני חיפוש
  const [searchDate, setSearchDate] = useState(""); // מצב לחיפוש לפי תאריך ניתוח
  const [selectedRole, setSelectedRole] = useState("all"); // מצב לסינון לפי תפקיד נבחר
  const [searchHospital, setSearchHospital] = useState(""); // מצב לחיפוש לפי שם בית חולים
  const [loading, setLoading] = useState(false); // מצב לאינדיקציה של טעינה
  const [error, setError] = useState(""); // מצב להצגת הודעות שגיאה
  const location = useLocation(); // גישה לאובייקט המיקום
  const internId = JSON.parse(sessionStorage.getItem("currentUserID")) || 0; // שליפת מזהה המתמחה מאחסון הסשן
  const procedure_Id = location.state?.procedureId; // שליפת מזהה הפרוצדורה ממצב המיקום
  const theme = useTheme(); // גישה לאובייקט העיצוב
  const [procedures, setProcedures] = useState([]); // מערך המחזיק את כל הפרוצדורות
  const [selectedProcedure, setSelectedProcedure] = useState(null); // מצביע על הפרוצדורה הנבחרת


  // הוק לשליפת כל שמות הפרוצדורות
  useEffect(() => {
    GetAllNameProcedure()
      .then((data) => {
        console.log(data); // הדפסת הנתונים לצורך דיבאגינג
        setProcedures(data); // שמירת הנתונים במערך הפרוצדורות
      })
      .catch((error) => {
        console.error("Error in GetAllNameProcedure: ", error); // הדפסת שגיאה במקרה של בעיה
      });
  }, []);

  // הוק לשליפת נתונים מהשרת בהתבסס על internId ו-procedure_Id
  useEffect(() => {
    setLoading(true);
    if (internId) {
      GetInternSurgeriesByProcedure(internId, procedure_Id)
        .then((fetchedData) => {
          setData(fetchedData);
          setFilteredData(fetchedData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError("Failed to fetch data."); // הצגת הודעת שגיאה כשלוקחים נתונים
          setLoading(false);
        });
    } else {
      setError("Invalid intern ID."); // הצגת שגיאה במקרה של מזהה מתמחה לא תקין
      setLoading(false);
    }
  }, [internId, procedure_Id]);

  // הוק לשליפת נתונים על פי הפרוצדורה שנבחרה
  useEffect(() => {
    if (internId && selectedProcedure) {
      setLoading(true);
      GetInternSurgeriesByProcedureName(internId, selectedProcedure.procedureName)
        .then((fetchedData) => {
          setData(fetchedData);
          setFilteredData(fetchedData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError("Failed to fetch data."); // הצגת שגיאה במקרה של כשל בשליפת נתונים
          setLoading(false);
        });
    }
  }, [internId, selectedProcedure]);


  // Effect to filter data based on search criteria
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

  // פונקציה שמעדכנת את הפרוצדורה הנבחרת
  const handleProcedureChange = (event, newValue) => {
    setSelectedProcedure(newValue); // עדכון הפרוצדורה הנבחרת
  };

  // Event handler for surgery date search change
  const handleSearchChange = (event) => {
    setSearchDate(event.target.value);
  };
  // Event handler for role filter change
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  // Event handler for hospital name search change
  const handleHospitalSearchChange = (event) => {
    setSearchHospital(event.target.value);
  };
  // Hospital colors object for customizing card backgrounds
  const hospitalColors = {
    'רמב"ם': "AliceBlue",
    לניאדו: "Lavender",
    "הלל יפה": "LightCyan",
    אכילוב: "LemonChiffon",
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
        {/* תיבה עבור בחירת פרוצדורה */}
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
      {/* תיבה עבור שאר הפילטרים */}
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
        <Grid container spacing={2}>
          {filteredData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={card.id || index}>
              <Card
                sx={{
                  maxWidth: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: theme.palette.grey[200],
                  marginLeft: { xs: 0, md: 1 },
                  ...(card.Hospital_name in hospitalColors && {
                    backgroundColor: hospitalColors[card.Hospital_name],
                  }),
                }}
              >
                <CardHeader
                  sx={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: "MintCream",
                        width: 50,
                        height: 50,
                      }}
                    >
                      <img
                        src={surgeryDateImage}
                        style={{ width: "70%", height: "70%" }}
                        alt="Surgery Date"
                      />
                    </Avatar>
                  }
                  title={card.Procedure_name}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    רמת קושי של הניתוח: {card.Difficulty_level} <br />
                    שם בית החולים: {card.Hospital_name} <br />
                    תאריך ניתוח:{" "}
                    {new Date(card.Surgery_date).toLocaleDateString()} <br />
                    תפקיד: {card.Intern_role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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
