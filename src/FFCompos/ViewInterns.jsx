import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {Card, Box, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuLogo from './MenuLogo';
import { GetCountProceduresByIntern } from './Server.jsx';
import CardsDetailsInterns from './CardsDetailsInterns.jsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ViewInterns() {
    const [data, setData] = useState([]);
    // const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('ProcedureCount'); // Start with 'ProcedureCount' by default

    useEffect(() => {
        GetCountProceduresByIntern().then(fetchedData => {
            setData(fetchedData);
        }).catch(error => {
            console.error("Error fetching data:", error);
        });
    }, []);
    

    // Filter and sort data
    const filteredData = data.filter(item =>
        item.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'ProcedureCount') {
            return b.procedureCount - a.procedureCount; // Sort by ProcedureCount
        } else if (sortBy === 'RemainingNeed') {
            return (b.overallNeed - b.procedureCount) - (a.overallNeed - a.procedureCount) // Sort by Remaining Need
        }
    });
    console.log(filteredData);

    // Chart data setup
    const chartData = {
        labels: filteredData.map(item => item.firstName),
        datasets: [
            {
                label: 'Procedure Count',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                data: filteredData.map(item => item.procedureCount),
                barThickness: 50,
            },
            {
                label: 'Remaining Need',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                barThickness: 50,
                data: filteredData.map(item => item.overallNeed - item.procedureCount),
            }
        ]
    };

    const options = {
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true,
                beginAtZero: true,
                min: 0,
                max: 900,
                ticks: {
                    stepSize: 100
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        animation: {
            duration: 2000, // Duration in milliseconds (1000 ms = 1 second)
            easing: 'easeOutCubic', 
        }
    };

    return (
        <>
            <MenuLogo />
            <h3 style={{ marginTop: '20%' }}>רשימת המתמחים</h3>
            <Box sx={{ m: 2, display: 'flex', justifyContent: 'center' }}>
                <TextField
                    label="Search Name or Value"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 300, m: 2 }}
                />
                <FormControl sx={{ width: 200, m: 2 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="ProcedureCount">Procedure Count</MenuItem>
                        <MenuItem value="RemainingNeed">Remaining Need</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ width: '100%', height: '400px', overflowY: 'auto', justifyContent: 'center', mb: 4 }}>
                <Bar data={chartData} options={options} />
            </Box>

            <CardsDetailsInterns/>
        </>
    );
}
