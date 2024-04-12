import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { getSyllabus } from './Server.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


Chart.register(CategoryScale, LinearScale, BarElement);

function FullSyllabus() {
  const [data, setData] = useState(null);
  const [sortBy, setSortBy] = useState('procedureName'); // Default sort by procedureName
  const [searchQuery, setSearchQuery] = useState(''); // Query to search

  useEffect(() => {
    const getSyllabusDetails = async () => {
      try {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const syllabusData = await getSyllabus(currentUser.id);
        setData(syllabusData);
        console.info(syllabusData)
      } catch (error) {
        console.error("Error in getSyllabusDetails: ", error);
      }
    };
    getSyllabusDetails();
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
      return a.need - b.need;
    }
  });

  // Extracting procedureNames, haveDone counts, and left counts from the sorted data
  const procedureNames = sortedData.map(item => item.procedureName);
  const haveDones = sortedData.map(item => item.haveDone);
  const needs = sortedData.map(item => item.need);

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
      },
      {
        label: 'Surgeries Left',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        data: needs,
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
      },
    },
  };


  const handleSearchInputChange = event => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <h3>מעקב אחר הניתוחים </h3>
      <div>
        <label>Sort By: </label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="procedureName">Procedure name</option>
          <option value="haveDone">Surgeries have done</option>
          <option value="left">Surgeries Left</option>
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', mb: '5px', }}>
        <input
          type="text"
          placeholder="Search by procedure name..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <FontAwesomeIcon icon={faSearch} style={{ color: 'gray' }} />
      </div>

      <div style={{ height: '450px', overflowY: 'auto', overflowX: 'hidden' }}>
        <div>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default FullSyllabus;
