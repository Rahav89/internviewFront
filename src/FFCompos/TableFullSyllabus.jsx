import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getDetailedSyllabusOfIntern } from './Server.jsx';
import MenuLogo from '../FFCompos/MenuLogo';


export default function DetailedSyllabusTable() {

    const [data, setData] = useState([]);

    useEffect(() => {
        getDetailedSyllabusOfIntern(JSON.parse(sessionStorage.getItem('currentUserID')))
            .then((data) => { setData(data); })
            .catch((error) => {
                console.error("Error in getDetailedSyllabusOfIntern: ", error);
            });
    }, []);
    const rows = transformArray(data);

    console.log(transformArray(data));

    function transformArray(procedures) {
        let result = [];

        // Iterate through the array while looking for consecutive pairs
        for (let i = 0; i < procedures.length; i++) {
            let currentP = procedures[i];
            let nextP = procedures[i + 1];
            if (currentP.category_Id == 0) {
                currentP['expandable'] = false;
                result.push(currentP);
                continue;
            }
            else if (currentP.category_Id === nextP.category_Id) {
                let combinedProcedure = {
                    procedureName: currentP.categoryName,
                    requiredAsMain: "",
                    doneAsMain: "",
                    requiredAsFirst: currentP.categoryRequiredFirst,
                    doneAsFirst: currentP.doneAsFirst + nextP.doneAsFirst,
                    requiredAsSecond: currentP.categoryRequiredSecond,
                    doneAsSecond: currentP.doneAsSecond + nextP.doneAsSecond,
                    expandable: true,
                    category: [
                        {
                            name: currentP.procedureName,
                            requiredAsMain: currentP.requiredAsMain,
                            doneAsMain: currentP.doneAsMain,
                            doneAsFirst: currentP.doneAsFirst,
                            doneAsSecond: currentP.doneAsSecond
                        },
                        {
                            name: nextP.procedureName,
                            requiredAsMain: nextP.requiredAsMain,
                            doneAsMain: nextP.doneAsMain,
                            doneAsFirst: nextP.doneAsFirst,
                            doneAsSecond: nextP.doneAsSecond
                        }
                    ]
                };
                result.push(combinedProcedure);
            }

        }

        return result;
    }

    function Row(props) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    {row.expandable ? (
                        <TableCell align="right">
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                    ) : (
                        <TableCell />
                    )}
                    <TableCell align="right" component="th" scope="row">
                        {row.procedureName}
                    </TableCell>
                    <TableCell align="right">{row.requiredAsMain}</TableCell>
                    <TableCell align="right">{row.doneAsMain}</TableCell>
                    <TableCell align="right">{row.requiredAsFirst}</TableCell>
                    <TableCell align="right">{row.doneAsFirst}</TableCell>
                    <TableCell align="right">{row.requiredAsSecond}</TableCell>
                    <TableCell align="right">{row.doneAsSecond}</TableCell>
                </TableRow>

                {row.expandable && (
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div" align="right">
                                        History
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">Name</TableCell>
                                                <TableCell align="right">Required As Main</TableCell>
                                                <TableCell align="right">Done As Main</TableCell>
                                                <TableCell align="right">doneAsFirst</TableCell>
                                                <TableCell align="right">Done As Second</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {row.category.map((historyRow) => (
                                                <TableRow key={historyRow.name}>
                                                    <TableCell component="th" scope="row" align="right">
                                                        {historyRow.name}
                                                    </TableCell>
                                                    <TableCell align="right">{historyRow.requiredAsMain}</TableCell>
                                                    <TableCell align="right">{historyRow.doneAsMain}</TableCell>
                                                    <TableCell align="right">{historyRow.doneAsFirst}</TableCell>
                                                    <TableCell align="right">{historyRow.doneAsSecond}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                )}
            </React.Fragment>
        );
    }


    return (
        <>
            <MenuLogo />
            <TableContainer component={Paper} sx={{ mt: "100px", direction: "rtl" }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right" />
                            <TableCell align="right">procedureName </TableCell>
                            <TableCell align="right">requiredAsMain</TableCell>
                            <TableCell align="right">doneAsMain</TableCell>
                            <TableCell align="right">requiredAsFirst</TableCell>
                            <TableCell align="right">doneAsFirst</TableCell>
                            <TableCell align="right">requiredAsSecond</TableCell>
                            <TableCell align="right">doneAsSecond</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <Row key={row.procedureId || index} row={row} align="right" />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>


    );
}
