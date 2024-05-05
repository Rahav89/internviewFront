import React, { useState, useEffect } from 'react';
import MenuLogo from './MenuLogo';
import { Typography, Box, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { GetFutureSurgeries } from './Server.jsx';
import AlgoResults from './AlgoResults.jsx'
import Calendar from './Calendar.jsx'


export default function AllocationInterns() {
    const [SurgeriesAsObject, setSurgeriesAsObject] = useState([]); // מערך המחזיק את כל הפרוצדורות
    const [SurgeriesAsString, setSurgeriesAsString] = useState([]); // מערך המחזיק את כל הפרוצדורות
    const [selectedProcedure, setSelectedProcedure] = useState(null); // מצביע על הפרוצדורה הנבחרת

    // קריאה לשרת כדי לקבל את כל הפרוצדורות בעת טעינת הקומפוננטה
    useEffect(() => {
        GetFutureSurgeries()
            .then((data) => {
                setSurgeriesAsObject(data); // שמירת הנתונים במערך הפרוצדורות
                let SurgeriesAsString = [];
                data.map((surgery) => (
                    SurgeriesAsString.push(`פרוצדורות בניתוח: ${surgery.procedureName} (תאריך: ${surgery.Surgery_date.slice(0, 10)} | רמת קושי: ${surgery.Difficulty_level} | בית חולים: ${surgery.Hospital_name})`)
                ));
                setSurgeriesAsString(SurgeriesAsString);
                console.log(data); // הדפסת הנתונים לבדיקה
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

            {console.log(SurgeriesAsString)}
            <MenuLogo /> {/* קומפוננטת לוגו התפריט */}
            <Typography
                variant="h6"
                sx={{ marginTop: 8, textAlign: "center", fontWeight: "bold" }}
            >
                הקצאת מתמחים {/* כותרת הסעיף */}
            </Typography>
            <Box

                sx={{
                    textAlign: 'right',
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
                    dir="rtl"
                    value={selectedProcedure}
                    onChange={handleProcedureChange}
                    options={SurgeriesAsString}
                    getOptionLabel={(option) => option}  // option is a string
                    sx={{ width: '70%' }}
                    renderInput={(params) => <TextField {...params} label="בחירת ניתוח" />}
                    isOptionEqualToValue={(option, value) => option === value}  // comparing strings directly
                    renderOption={(props, option, index) => {
                        // Extract the key from the props
                        const { key, ...otherProps } = props;
                        return (
                            <Box component="li" key={key} dir="rtl" {...otherProps} sx={{ textAlign: 'right', borderBottom: '1px solid #ccc' }}>
                                {option}
                            </Box>
                        );
                    }}

                />

            </Box>
            {selectedProcedure &&

                <>
                    <Typography
                        variant="h6"
                        sx={{ padding: 2, textAlign: "center", fontWeight: "bold" }}>
                        תוצאות
                    </Typography>
                    <AlgoResults />
                </>

            }
        </>
    );
}
