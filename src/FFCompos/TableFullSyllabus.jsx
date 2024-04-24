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
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import { getDetailedSyllabusOfIntern } from './Server.jsx';
import MenuLogo from '../FFCompos/MenuLogo';
import Grid from '@mui/material/Grid';
import '../App.css';
import { TextField, Button } from '@mui/material';
import { useMemo } from 'react';
import ImportExportIcon from '@mui/icons-material/ImportExport';

function displayColor(requiredAsPosition) {
    return requiredAsPosition === 0 ? 'grey' : 'black';
}
function displayBackground(pos1, pos2) {
    if (pos1 != 0) {
        return pos1 <= pos2 ? '#90ee90' : 'white';
    }
    return 'white';
}

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
                requiredAsMain: currentP.requiredAsMain + nextP.requiredAsMain,
                doneAsMain: currentP.doneAsMain + nextP.doneAsMain,
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



    function Row(props) {
        const { row } = props;    console.log(row);
        const [open, setOpen] = React.useState(false);
        let pName = row.procedureName;
        let reqAsAdmin = row.requiredAsMain;
        let doneAsAsmin = row.doneAsMain;
        let reqAsFirst = row.requiredAsFirst;
        let doneAsFirst = row.doneAsFirst;
        let reqAsSecond = row.requiredAsSecond;
        let doneAsSecond = row.doneAsSecond;
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
                    <TableCell align="right" component="th" scope="row" className='borderLeft'> {pName} </TableCell>


                    <TableCell align="center" style={{ padding: 0, color: displayColor(reqAsAdmin), background: displayBackground(reqAsAdmin, doneAsAsmin) }}>
                        {reqAsAdmin || "▬▬▬"} </TableCell>
                    <TableCell align="center" className='borderLeft' style={{ padding: 0, color: displayColor(reqAsAdmin), background: displayBackground(reqAsAdmin, doneAsAsmin) }}>
                        {/* {reqAsAdmin === 0 ? "▬▬▬" : doneAsAsmin}  */} {doneAsAsmin}</TableCell>

                    <TableCell align="center" style={{ padding: 0, color: displayColor(reqAsFirst), background: displayBackground(reqAsFirst, doneAsFirst) }}>
                        {reqAsFirst || "▬▬▬"} </TableCell>
                    <TableCell align="center" className='borderLeft' style={{ padding: 0, color: displayColor(reqAsFirst), background: displayBackground(reqAsFirst, doneAsFirst) }}>
                        {/* {reqAsFirst === 0 ? "▬▬▬" : doneAsFirst}  */} {doneAsFirst}</TableCell>


                    <TableCell align="center" style={{ padding: 0, color: displayColor(reqAsSecond), background: displayBackground(reqAsSecond, doneAsSecond) }}>
                        {reqAsSecond || "▬▬▬"} </TableCell>
                    <TableCell align="center" style={{ padding: 0, color: displayColor(reqAsSecond), background: displayBackground(reqAsSecond, doneAsSecond) }}>
                        {/* {reqAsSecond === 0 ? "▬▬▬" : doneAsSecond}  */} {doneAsSecond}</TableCell>
                </TableRow>

                {row.expandable && (
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div" align="right">
                                        קטגוריה
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">שם ניתוח</TableCell>
                                                <TableCell align="right">דרישה כראשי</TableCell>
                                                <TableCell align="right">נעשה כראשי</TableCell>
                                                <TableCell align="right">נעשה כעוזר ראשון</TableCell>
                                                <TableCell align="right">נעשה כעוזר שני</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {row.category.map((categoryRow) => (
                                                <TableRow key={categoryRow.name}>
                                                    <TableCell component="th" scope="row" align="right"> {categoryRow.name}</TableCell>
                                                    <TableCell align="right">{categoryRow.requiredAsMain}</TableCell>
                                                    <TableCell align="right">{categoryRow.doneAsMain}</TableCell>
                                                    <TableCell align="right">{categoryRow.doneAsFirst}</TableCell>
                                                    <TableCell align="right">{categoryRow.doneAsSecond}</TableCell>
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

    ///////// סינון ניתוחים /////////
    const [searchValue, setSearchValue] = useState('');
  
    const onChangeSearch = (event) => {
        setSearchValue(event.target.value.toLowerCase());
    };

    // מחזיר את כל השורות שיש בהם את הערך המוקלד בחיפוש
    const filteredRows = rows.filter(row => {
        return row.procedureName.toLowerCase().includes(searchValue);
    });

   ///////// מיון ניתוחים /////////
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

    //כמו יוז אפקט רק שמחזיר ערך ועדיף לחישובים במהלך רדנורים
    const sortedRows = useMemo(() => {
        let sortableItems = [...filteredRows]; //כדי שיהיה אפשר לעשות מיון על הסינון שהמשתמש בחר
        if (sortConfig.direction !== 'none' && sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                //מיון לפי שם העמודה
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredRows, sortConfig]); //מחושב מחדש בכל שינוי של המשתנים הללו

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'none'; // Resetting to default sorting
            key = 'procedureName'; // Default sort key
        }
        setSortConfig({ key, direction });
    };

    function ButtonSort({ colName }) {
        return (
            <IconButton onClick={() => requestSort(colName)}>
                {/* השמה של החץ המתאים - עולה או יורד */}
                {sortConfig.key === colName ? (
                    sortConfig.direction === 'ascending' ? <VerticalAlignTopIcon /> :
                        sortConfig.direction === 'descending' ? <VerticalAlignBottomIcon /> : <ImportExportIcon />
                ) : <ImportExportIcon />}
            </IconButton>
        );
    }


    return (
        <>
            <MenuLogo />

            <Grid container spacing={2}>
                <Box display="flex" justifyContent="center">
                    <Grid item xs={11} alignItems="center" > 
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '100Px', mb:'40px' }}>
                        <Button variant="outlined" onClick={() => {setSearchValue('')}} sx={{ mr: 1 }}>נקה</Button>
                        <TextField
                            label="חיפוש ניתוח"
                            variant="outlined"
                            value={searchValue}
                            onChange={onChangeSearch}
                            sx={{ width: 250, direction: 'rtl' }} 
                        />
                    </Box>
                        <TableContainer component={Paper} sx={{ maxHeight: 620, mb: "100px", direction: "rtl" , overflowX: "auto"}}>
                            <Table stickyHeader aria-label="collapsible table" sx={{ tableLayout: 'fixed', overflow: "scroll" }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right" width="2%" />
                                        <TableCell align="right" width="20%" className="custom-cell, borderLeft">שם הניתוח</TableCell>
                                        <TableCell align="center" width="11%" className="custom-cell">
                                            <div style={{ display: 'inline-block' }}> דרישה כראשי</div>
                                            <ButtonSort colName="requiredAsMain" />
                                        </TableCell>
                                        <TableCell align="center" width="11%" className="custom-cell , borderLeft">
                                            <div style={{ display: 'inline-block' }}>נעשה כראשי</div>
                                            <ButtonSort colName="doneAsMain" />
                                        </TableCell>
                                        <TableCell align="center" width="14%" className="custom-cell">
                                            <div style={{ display: 'inline-block' }}>דרישה כעוזר ראשון </div>
                                            <ButtonSort colName="requiredAsFirst" />
                                        </TableCell>
                                        <TableCell align="center" width="14%" className="custom-cell , borderLeft">
                                            <div style={{ display: 'inline-block' }}>נעשה כעוזר ראשון</div>
                                            <ButtonSort colName="doneAsFirst" />
                                        </TableCell>
                                        <TableCell align="center" width="14%" className="custom-cell">
                                            <div style={{ display: 'inline-block' }}>נדרש כעוזר שני</div>
                                            <ButtonSort colName="requiredAsSecond" />
                                        </TableCell>
                                        <TableCell align="center" width="11%" className="custom-cell">
                                            נעשה כעוזר שני
                                            <ButtonSort colName="doneAsSecond" />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedRows.map((row, index) => (
                                        <Row key={row.procedureId || index} row={row} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Grid>
                </Box>

            </Grid>
        </>

    );
}
