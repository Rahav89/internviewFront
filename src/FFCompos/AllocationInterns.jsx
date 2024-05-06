import React, { useState, useEffect } from 'react';
import MenuLogo from './MenuLogo';
import { Typography, Box, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { GetFutureSurgeries } from './Server.jsx';
import AlgoResults from './AlgoResults.jsx'
import RolesTable from './RolesTable.jsx'
import FloatingChatButton from './FloatingChatButton';

export default function AllocationInterns() {
    const [SurgeriesAsObjects, setSurgeriesAsObject] = useState([]); // מערך המחזיק את כל הפרוצדורות
    const [selectedProcedure, setSelectedProcedure] = useState(null); // מצביע על הפרוצדורה הנבחרת
    const [refreshKey, setRefreshKey] = useState(0); // Refresh key to trigger updates
    // קריאה לשרת כדי לקבל את כל הפרוצדורות בעת טעינת הקומפוננטה
    useEffect(() => {
        GetFutureSurgeries()
            .then((data) => {
                setSurgeriesAsObject(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error in GetAllNameProcedure: ", error);
            });
    }, []);

    // פונקציה שמעדכנת את הפרוצדורה הנבחרת
    const handleProcedureChange = (event, newValue) => {
        setSelectedProcedure(newValue);
        refreshComponents();  // Refresh components on procedure change
    }


    // Function to refresh child components
    const refreshComponents = () => {
        setRefreshKey(oldKey => oldKey + 1); // Increment key to trigger re-render
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
                    options={SurgeriesAsObjects}  // Use the full objects array
                    getOptionLabel={(option) => `פרוצדורות בניתוח: ${option.procedureName} (תאריך: ${option.Surgery_date.slice(0, 10)} | רמת קושי: ${option.Difficulty_level} | בית חולים: ${option.Hospital_name})`}
                    sx={{ width: '70%' }}
                    renderInput={(params) => <TextField {...params} label="בחירת ניתוח" />}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option, index) => {
                        // Extract the key from the props
                        const { key, ...otherProps } = props;
                        return (
                            <Box component="li" key={key} dir="rtl" {...otherProps} sx={{ textAlign: 'right', borderBottom: '1px solid #ccc' }}>
                                {`פרוצדורות בניתוח: ${option.procedureName} (תאריך: ${option.Surgery_date.slice(0, 10)} | רמת קושי: ${option.Difficulty_level} | בית חולים: ${option.Hospital_name})`}
                            </Box>
                        );
                    }}


                />

            </Box>
            {selectedProcedure &&
                <>
                    {console.log("Ddddd", selectedProcedure)}
                    <Typography
                        variant="h6"
                        sx={{ padding: 2, textAlign: "center", fontWeight: "bold" }}>
                        שיבוץ עדכני עבור הניתוח
                    </Typography>
                    <RolesTable key={`roles-${refreshKey}`} surgeryID={selectedProcedure.Surgery_id} />

                    <Typography
                        variant="h6"
                        sx={{ padding: 2, textAlign: "center", fontWeight: "bold" }}>
                        תוצאות
                    </Typography>
                    <AlgoResults key={`algo-${refreshKey}`} surgeryID={selectedProcedure.Surgery_id} refreshComponents={refreshComponents} />
                </>
            }
            <FloatingChatButton />
        </>
    );
}
