import { Box, TextField, InputAdornment, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { getSyllabus } from './Server.jsx';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
//------------------------------------------------------------

Chart.register(CategoryScale, LinearScale, BarElement);

function FullSyllabus() {
  const [data, setData] = useState(null);
  const [sortBy, setSortBy] = useState('procedureName'); // Default sort by procedureName
  const [searchQuery, setSearchQuery] = useState(''); // Query to search
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    getSyllabus(JSON.parse(sessionStorage.getItem('currentUserID')))
      .then((data) => {
        setData(data);
        console.info(data);
      })
      .catch((error) => {
        console.error("Error in getSyllabusDetails: ", error);
      });
  }, []);

  if (!data) {
    // Render loading state until data is fetched
    return <p>Loading...</p>;
  }

  // Filtered data based on search query
  const filteredData = data.filter(item =>
    item.procedureName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort the data based on the selected criteria
  const sortedData = filteredData.sort((a, b) => {
    if (sortBy === 'procedureName') {
      return a.procedureName.localeCompare(b.procedureName);
    } else if (sortBy === 'haveDone') {
      return b.haveDone - a.haveDone;
    } else {
      return b.need - a.need;
    }
  });

  // If we want to show all
  // Extracting procedureNames, haveDone counts, and left counts from the sorted data
  // const procedureNames = sortedData.map(item => item.procedureName);
  // const haveDones = sortedData.map(item => item.haveDone);
  // const needs = sortedData.map(item => item.need);

  // Start
  // Calculate how much is left to do for each item
  const sortedDataByNeed = sortedData.map(item => ({
    ...item,
    remaining: item.need - item.haveDone
  }));

  // Sort the items based on how much is left to do
  sortedDataByNeed.sort((a, b) => b.remaining - a.remaining);

  // Select the top 10 items
  const topTenData = sortedDataByNeed.slice(0, 10);

  // Extracting procedureNames, haveDone counts, and left counts from the top 10 data
  const procedureNames = topTenData.map(item => item.procedureName);
  const haveDones = topTenData.map(item => item.haveDone);
  const needs = topTenData.map(item => item.need);

  // End 

  // Creating data for the chart
  const chartData = {
    labels: procedureNames,
    datasets: [
      {
        label: 'Surgeries haveDone',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        data: haveDones,
        barPercentage: 0.8, // Adjust the width of the bars relative to the category width (80%)

      },
      {
        label: 'Surgeries Left',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        data: needs,
        barPercentage: 0.8, // Adjust the width of the bars relative to the category width (80%)

      },
    ],
  };

  // Options for the chart Vertical
  // const chartOptions = {
  //   plugins: {
  //     tooltip: {
  //       mode: 'index',
  //       intersect: false,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       stacked: true,
  //       ticks: {
  //         autoSkip: false,
  //         // maxRotation: 90,
  //         // minRotation: 90,
  //       },
  //     },
  //     y: {
  //       stacked: true,
  //     },
  //   },
  // };

  // Options for the chart Horizontal
  const chartOptions = {
    indexAxis: 'y', // Set index axis to 'y' to make the chart horizontal
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          // You can further customize the ticks as needed
          font: {
            size: 14, // Adjust font size
          },

        }
      },
    },
    onClick: function (event, chartElement) {
      if (chartElement.length > 0) {
        // Need to remember to modify this by sync with the index in that chart and the index in the array ( to tget the procedure_id)
        const clickedIndex = chartElement[0].index;
        // Extract the item ID associated with the clicked bar
        const itemId = topTenData[clickedIndex]?.procedure_Id; // Assuming each item has a unique ID property
        navigate(`/details/${itemId}`); // Navigate to the details page using the item ID
      }
    }
  };


  const handleSearchInputChange = event => {
    setSearchQuery(event.target.value);
  };



  return (
    <Box>
      <Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          מעקב אחר הניתוחים
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <FormControl sx={{ width: '50%' }}>
            <Box dir="rtl">
              <InputLabel sx={{ textAlign: 'right' }}>סידור לפי</InputLabel>
            </Box>
            <Select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              label="sortedby"
            >
              <MenuItem value="procedureName"> א-ב</MenuItem>
              <MenuItem value="haveDone">ביצוע</MenuItem>
              <MenuItem value="left">חוסר</MenuItem>
            </Select>
          </FormControl>

          <TextField
            sx={{ width: '50%' }}
            type="text"
            dir='rtl'
            placeholder="חיפוש"
            value={searchQuery}
            onChange={handleSearchInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <FontAwesomeIcon icon={faSearch} style={{ color: 'gray' }} />
                </InputAdornment>
              )
            }}
          />
        </Box>

      </Box>
      <Box sx={{ height: 600, overflowY: 'auto', overflowX: "hidden" }}>
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );

}

export default FullSyllabus;
