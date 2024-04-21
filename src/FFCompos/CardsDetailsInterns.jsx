import React, { useEffect, useState } from 'react';
import {  useTheme } from '@mui/material/styles';
import { Box, Card, CardHeader, CardContent, Avatar, Typography, Grid, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { GetInternSurgeriesByProcedure } from './Server.jsx';
import MenuLogo from './MenuLogo.jsx';
import { useLocation } from 'react-router-dom';
import surgeryDateImage from '/src/Image/surgerydate.png'; // Adjust the path as necessary

export default function CardsDetailsInterns() {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');  // Default to 'all'
    const internId = JSON.parse(sessionStorage.getItem('currentUserID')) || 0;
    const theme = useTheme();
    const location = useLocation();
    const procedure_Id = location.state?.procedureId;

    useEffect(() => {
        if (internId && procedure_Id) {
            GetInternSurgeriesByProcedure(internId, procedure_Id)
                .then(fetchedData => {
                    console.info("Fetched Data:", fetchedData);
                    setData(fetchedData);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setError('Failed to fetch data.');
                });
        } else {
            setError('Invalid intern or procedure ID.');
        }
    }, [internId, procedure_Id]);

    const handleSearchChange = (event) => {
        setSearchDate(event.target.value);
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const hospitalColors = {
        "רמב\"ם": "AliceBlue",
        "לניאדו": "Lavender",
        "הלל יפה": "LightCyan",
        "אכילוב": "LemonChiffon"
    };

    const filteredData = data.filter(item => {
        return item.Surgery_date.includes(searchDate) && (selectedRole === 'all' || item.Intern_role === selectedRole);
    });

    return (
        <>
            <MenuLogo />
            <Typography variant="h6" sx={{ margin: 5, textAlign: 'center' ,fontWeight:'bold'}}>הצגת הניתוחים</Typography>
            <TextField
                type="date"
                value={searchDate}
                onChange={handleSearchChange}
                label="חפש תאריך ניתוח"
                sx={{ marginBottom: 2, width: '80%', marginX: 'auto' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>  
                <FormControl component="fieldset">
                    <FormLabel component="legend">תפקיד בניתוח</FormLabel>
                    <RadioGroup
                        row
                        aria-label="intern role"
                        name="intern-role"
                        value={selectedRole}
                        onChange={handleRoleChange}
                    >
                        <FormControlLabel value="עוזר שני" control={<Radio />} label="עוזר שני" />
                        <FormControlLabel value="עוזר ראשון" control={<Radio />} label="עוזר ראשון" />
                        <FormControlLabel value="מנתח ראשי" control={<Radio />} label="מנתח ראשי" />
                        <FormControlLabel value="all" control={<Radio />} label="הכל" />
                    </RadioGroup>
                </FormControl>
            </Box>
            <Grid container spacing={2}>
                {filteredData.map((card, index) => (
                    <Grid item xs={12} sm={12} md={12} key={card.id || index}>
                        <Card sx={{
                            maxWidth: 345,
                            display:'inline-block',
                            backgroundColor: theme.palette.grey[200], // Default background
                            ...((card.Hospital_name in hospitalColors) && { backgroundColor: hospitalColors[card.Hospital_name] })
                        }}>
                            <CardHeader
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mt:2,
                                    ml:2
                                }}
                                avatar={
                                    <Avatar sx={{ bgcolor: 'MintCream', width: 50, height: 50, ml: 2 }}>
                                        <img src={surgeryDateImage} style={{ width: '70%', height: '70%' }} alt="Surgery Date" />
                                    </Avatar>
                                }
                                title={card.Procedure_name}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    רמת קושי של הניתוח: {card.Difficulty_level} <br />
                                    שם בית החולים: {card.Hospital_name} <br />
                                    תאריך ניתוח: {new Date(card.Surgery_date).toLocaleDateString()} <br />
                                    תפקיד: {card.Intern_role}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
