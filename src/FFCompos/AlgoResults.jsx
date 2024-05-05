import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import QueueIcon from '@mui/icons-material/Queue';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { GetInterns } from './Server.jsx';
import Swal from 'sweetalert2';

export default function AlgoResults() {
    const [interns, setInterns] = useState([]);
    const [openDialogId, setOpenDialogId] = useState(null);

    let scores = ['90%', '85%', '70%', '60%', '50%']
    useEffect(() => {
        let interns =[];
        GetInterns()
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    let intern = data[i];
                    let internObj = {
                        id: intern.id,
                        fullName: `${intern.first_name} ${intern.last_name}`,
                        year: intern.interns_year,
                        rating: intern.interns_rating,
                        score:scores[i]
                    }
                    interns.push(internObj);
                }
                
                setInterns(interns);
            })
            .catch(error => {
                console.error("Error in GetInterns: ", error);
            });
    }, []);

    const handleOpenDialog = (id) => {

        setOpenDialogId(id);
    };

    const handleCloseDialog = () => {
        setOpenDialogId(null);
    };
    const handleAgree = () => {
        Swal.fire({
            text: "שיבוץ בוצע בהצלחה",
            icon: "success",
            confirmButtonText: "OK",
        })
        setOpenDialogId(null);
    };



    return (
        <TableContainer component={Paper} dir="rtl">
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">שם המתמחה</TableCell>
                        <TableCell align="center">שנת התמחות</TableCell>
                        <TableCell align="center">דירוג מתמחה</TableCell>
                        <TableCell align="center"> ציון תיאום</TableCell>
                        <TableCell align="center">תאם לניתוח</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {interns.map(intern => (
                        <TableRow key={intern.id}>
                            <TableCell align="center">{intern.fullName}</TableCell>
                            <TableCell align="center">{intern.year}</TableCell>
                            <TableCell align="center">{intern.rating}</TableCell>
                            <TableCell align="center">{intern.score}</TableCell>
                            <TableCell align="center">
                                <Button onClick={() => handleOpenDialog(intern.id)} size="small">
                                    <QueueIcon />
                                </Button>
                                {openDialogId === intern.id && (
                                    <Dialog
                                        open={openDialogId === intern.id}
                                        onClose={handleCloseDialog}
                                    >
                                        <DialogTitle dir="rtl">{"שיבוץ מתמחה לניתוח"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText dir="rtl" id="alert-dialog-description">
                                                האם אתה בטוח על שיבוץ {intern.fullName} לניתוח שבחרת?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseDialog} autoFocus>ביטול</Button>
                                            <Button onClick={handleAgree}>אישור שיבוץ</Button>
                                        </DialogActions>
                                    </Dialog>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer >
    );
}
