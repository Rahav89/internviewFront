import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { GetSurgeryRoles } from './Server.jsx';

export default function RolesTable({ surgeryID }) {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        GetSurgeryRoles(surgeryID)
            .then((data) => {
                setRows(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error in GetSurgeryRoles: ", error);
            });
    }, [surgeryID]); // Include surgeryID in the dependency array

    return (
        <TableContainer component={Paper} sx={{
            maxWidth: '100%',
            width: 'auto',
            margin: 'auto',
            overflowX: 'auto', // Make table scrollable on small screens
            '& .MuiTableCell-root': { // Adjusting cell padding for all cells
                py: 1, // Use smaller vertical padding
                px: 1.5, // Use smaller horizontal padding
            },
            '@media (max-width:600px)': { // Media query for extra small devices
                '& .MuiTableCell-root': {
                    fontSize: '0.8rem', // Smaller font size
                },
            }
        }}>
            <Table sx={{ minWidth: 320 }} aria-label="simple table">
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #ccc' }}>
                        <TableCell>תפקיד</TableCell>
                        <TableCell align="right">שם מלא</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.Intern_role}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.Intern_role}
                            </TableCell>
                            <TableCell align="right">
                                {`${row.First_name} ${row.Last_name}`}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
