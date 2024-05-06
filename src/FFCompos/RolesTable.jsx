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


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function RolesTable({ surgeryID }) {
    console.log("surgeryID : : : " , surgeryID);
    const [rows, setRows] = useState([]);
    useEffect(() => {
        GetSurgeryRoles(surgeryID)
            .then((data) => {
                setRows(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error in GetAllNameProcedure: ", error);
            });
    }, []);

    return (
        <TableContainer dir="rtl" component={Paper} sx={{ width: '50%', margin: 'auto'}}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                            <TableCell component="th" scope="row"> {row.Intern_role} </TableCell>
                            <TableCell align="right"> {`${row.First_name} ${row.Last_name} `} </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}