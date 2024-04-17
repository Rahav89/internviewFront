import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuLogo from './MenuLogo';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ViewInterns() {
    const initialData = [
        { name: 'Amit', values: [3, 4] },
        { name: 'John', values: [4, 3] },
        { name: 'Emma', values: [1, 1] },
        { name: 'Sophia', values: [6, 5] },
        { name: 'Michael', values: [5, 8] },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [valueFilter, setValueFilter] = useState('lowest');
    const [filteredData, setFilteredData] = useState(initialData);

    useEffect(() => {
        const filtered = initialData.filter(entry =>
            entry.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, initialData]);

    useEffect(() => {
        const sortedData = filteredData.sort((a, b) => {
            const minA = Math.min(...a.values);
            const minB = Math.min(...b.values);
            const maxA = Math.max(...a.values);
            const maxB = Math.max(...b.values);
            if (valueFilter === 'lowest') {
                return minA - minB;
            } else {
                return maxB - maxA;
            }
        });
        setFilteredData([...sortedData]); // spread into a new array to trigger re-render
    }, [valueFilter, filteredData]);

    const data = {
        labels: filteredData.map(data => data.name),
        datasets: [
            {
                label: 'Series A1',
                data: filteredData.map(data => data.values[0]),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
            },
            {
                label: 'Series A2',
                data: filteredData.map(data => data.values[1]),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
            }
        ]
    };

    const options = {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                beginAtZero: true
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'רשימת המתמחים'
            }
        }
    };
    return (
        <>
            <MenuLogo />
            <Box sx={{ pt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3>רשימת המתמחים</h3>
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', gap: 2, mb: 2 }}>
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
                        sx={{ width: 200 }} // Adjust width as needed
                    />
                    <FormControl sx={{ width: 200 }}> 
                        <InputLabel>Filter by Value</InputLabel>
                        <Select
                            value={valueFilter}
                            label="Filter by Value"
                            onChange={(e) => setValueFilter(e.target.value)}
                        >
                            <MenuItem value="lowest">Lowest Value</MenuItem>
                            <MenuItem value="highest">Highest Value</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ width: '300px', height: '400px' }}>
                    <Bar data={data} options={options} />
                </Box>
            </Box>
        </>
    );
}