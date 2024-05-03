import React, { useState, useEffect } from 'react';
import MenuLogo from './MenuLogo';
import { Typography, Box, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { GetAllNameProcedure } from './Server.jsx';

export default function AllocationInterns() {
    const [procedures, setProcedures] = useState([]); // מערך המחזיק את כל הפרוצדורות
    const [selectedProcedure, setSelectedProcedure] = useState(null); // מצביע על הפרוצדורה הנבחרת

    // קריאה לשרת כדי לקבל את כל הפרוצדורות בעת טעינת הקומפוננטה
    useEffect(() => {
        GetAllNameProcedure()
            .then((data) => {
                console.log(data); // הדפסת הנתונים לבדיקה
                setProcedures(data); // שמירת הנתונים במערך הפרוצדורות
            })
            .catch((error) => {
                console.error("Error in GetAllNameProcedure: ", error); // הדפסת שגיאה במקרה של בעיה
            });
    }, []);

    // פונקציה שמעדכנת את הפרוצדורה הנבחרת
    const handleProcedureChange = (event, newValue) => {
        setSelectedProcedure(newValue); // עדכון הפרוצדורה הנבחרת
    };

    return (
        <>
            <MenuLogo /> {/* קומפוננטת לוגו התפריט */}
            <Typography
                variant="h6"
                sx={{ marginTop: 8, textAlign: "center", fontWeight: "bold" }}
            >
                הקצאת מתמחים {/* כותרת הסעיף */}
            </Typography>
            <Box
                sx={{
                    margin: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: 2,
                    marginTop: 2,
                }}
            >
                {/* קומפוננטת בחירת פרוצדורות עם אפשרות חיפוש */}
                <Autocomplete
                    value={selectedProcedure}
                    onChange={handleProcedureChange}
                    options={procedures}
                    getOptionLabel={(option) => option.procedureName || ""}
                    sx={{ width: 300, textAlign: 'center' }} 
                    renderInput={(params) => <TextField {...params} label="בחירת שם ניתוח" />} // תיבת הטקסט לקלט
                    isOptionEqualToValue={(option, value) => option.procedureName === value.procedureName} // השוואה בין אפשרויות לערך הנוכחי
                    renderOption={(props, option, { selected }) => (
                        // עיצוב מיוחד לכל אפשרות עם קו מפריד
                        <Box component="li" {...props} sx={{ borderBottom: '1px solid #ccc' }}>
                            {option.procedureName}
                        </Box>
                    )}
                />
            </Box>
        </>
    );
}
