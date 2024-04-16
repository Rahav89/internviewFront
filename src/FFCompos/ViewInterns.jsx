import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';
import MenuLogo from './MenuLogo';
import { Container } from '@mui/material';
//-------------------------------------------------

Chart.register(CategoryScale, LinearScale, BarElement);

export default function ViewInterns() {

    const dummyData = [
        { id: 1, name: 'Amit', doneCount: 8, leftCount: 2 },
        { id: 2, name: 'John', doneCount: 6, leftCount: 9 },
        { id: 3, name: 'Emma', doneCount: 9, leftCount: 3 },
        { id: 4, name: 'Sophia', doneCount: 7, leftCount: 5 },
        { id: 5, name: 'Michael', doneCount: 5, leftCount: 15 },
        { id: 6, name: 'William', doneCount: 4, leftCount: 14 },
        { id: 7, name: 'Olivia', doneCount: 3, leftCount: 12 },
        { id: 8, name: 'James', doneCount: 2, leftCount: 13 },
        { id: 9, name: 'Alexander', doneCount: 1, leftCount: 10 },
        { id: 10, name: 'Sophia', doneCount: 7, leftCount: 11 },
        { id: 11, name: 'Ethan', doneCount: 6, leftCount: 8 },
        { id: 12, name: 'Isabella', doneCount: 8, leftCount: 4 },
        { id: 13, name: 'Mia', doneCount: 5, leftCount: 7 },
        { id: 14, name: 'Daniel', doneCount: 4, leftCount: 6 },
        { id: 15, name: 'Matthew', doneCount: 3, leftCount: 17 },
        { id: 16, name: 'David', doneCount: 2, leftCount: 18 },
        { id: 17, name: 'Olivia', doneCount: 1, leftCount: 19 },
        { id: 18, name: 'Emma', doneCount: 9, leftCount: 3 },
        { id: 19, name: 'Elijah', doneCount: 6, leftCount: 9 },
        { id: 20, name: 'Sophia', doneCount: 7, leftCount: 5 },
        // Add more dummy data as needed
    ];

    const [sortBy, setSortBy] = useState('name'); // Default sort by name

    const [searchQuery, setSearchQuery] = useState(''); // Query to search

    // Filtered data based on search query
    const filteredData = dummyData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort the data based on the selected criteria
    const sortedData = filteredData.sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'done') {
            return b.doneCount - a.doneCount;
        } else {
            return a.leftCount - b.leftCount;
        }
    });

    // Extracting names, done counts, and left counts from the sorted data
    const names = sortedData.map(item => item.name);
    const doneCounts = sortedData.map(item => item.doneCount);
    const leftCounts = sortedData.map(item => item.leftCount);

    // Creating data for the chart
    const chartData = {
        labels: names,
        datasets: [
            {
                label: 'Surgeries Done',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: doneCounts,
            },
            {
                label: 'Surgeries Left',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: leftCounts,
            },
        ],
    };

    // Options for the chart
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90,
                },
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
        <>
            <Container maxWidth="lg" sx={{ mt: 8, mb: 3 }}>
                <MenuLogo />
                <h3>התקדמות המתמחים</h3>
                <div>
                    <label>Sort By: </label>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="name">Name</option>
                        <option value="done">Surgeries Done</option>
                        <option value="left">Surgeries Left</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <div style={{ width: '100%'}}>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </Container>
        </>
    );
}