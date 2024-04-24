import  { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuLogo from './MenuLogo';
import { GetCountProceduresByIntern } from './Server.jsx';
// import { useNavigate } from 'react-router-dom';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ViewInterns() {
    // const navigate = useNavigate()
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
                label: 'בוצע',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                data: filteredData.map(item => item.procedureCount),
                barThickness: 50,
            },
            {
                label: 'חוסר',
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
        },
        // onClick: (event, elements) => {
        //     if (elements.length > 0) {
        //         const index = elements[0].index;
        //         const internId = filteredData[index].internId;
        //         // הנווט לדף המתאים  של מתמחה
        //         // navigate(`/TableFullSyllabus/${internId}`, { state: { internId } }); // Navigate to the details page using the item ID
        //         window.location.href = `/DetailsIntern/${internId}`; // יש להתאים את הכתובת למבנה הנתיבים של האפליקציה
        //     }
        // }
    };

    return (
        <>
            <MenuLogo />
            <h3 style={{ marginTop: '10%' }}>רשימת המתמחים</h3>
            <Box sx={{ m: 2, display: 'flex', justifyContent: 'center' }}>
                <FormControl sx={{ width: 300, m: 1 }}>
                    <InputLabel>מיון</InputLabel>
                    <Select
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="ProcedureCount">מספר פרודצורות שבוצעו</MenuItem>
                        <MenuItem value="RemainingNeed">מספר פרודצורות שחסר</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="חיפוש שם מתמחה"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 200, m: 1, direction: 'rtl' }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{
                        shrink: true,  // This will make the label always appear above the TextField
                    }}
                />
            </Box>

            <Box sx={{
                width: {
                    xs: '100%', // 100% width on extra-small screens (small devices)
                    md: '80%'  // 80% width on medium screens (desktops)
                },
                height: '400px',
                overflowY: 'auto',
                display: 'flex',
                justifyContent: 'center',
                mb: 4,
                mx: 'auto'  // Using 'mx' for horizontal margin auto
            }}>
                <Bar data={chartData} options={options} />
            </Box>


        </>
    );
}
