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
import Grid from '@mui/material/Grid';
import '../App.css';
import { TextField } from '@mui/material';

function displayStyle(requiredAsPosition) {
  return requiredAsPosition === 0 ? 'grey' : 'black';
}

export default function DetailedSyllabusTable() {

  const [data, setData] = useState([]);

  useEffect(() => {
    getDetailedSyllabusOfIntern( JSON.parse(sessionStorage.getItem('currentUserID')))
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
          <TableCell align="right" component="th" scope="row" >
            {row.procedureName}
          </TableCell>
          <TableCell align="center" style={{ color: displayStyle(row.requiredAsMain) }}>
            {row.requiredAsMain || "▬▬▬"}
          </TableCell>
          <TableCell align="center" className='borderLeft' style={{ color: displayStyle(row.requiredAsMain) }}>
            {row.requiredAsMain === 0 ? '▬▬▬' : row.doneAsMain}
          </TableCell>
          <TableCell align="center" style={{ color: displayStyle(row.requiredAsFirst) }}>
            {row.requiredAsFirst || "▬▬▬"}
          </TableCell>
          <TableCell align="center" className='borderLeft' style={{ color: displayStyle(row.requiredAsFirst) }}>
            {row.requiredAsFirst === 0 ? "▬▬▬" : row.doneAsFirst}
          </TableCell>
          <TableCell align="center" style={{ color: displayStyle(row.requiredAsSecond) }}>
            {row.requiredAsSecond || "▬▬▬"}
          </TableCell>
          <TableCell align="center" style={{ color: displayStyle(row.requiredAsSecond) }}>
            {row.requiredAsSecond === 0 ? "▬▬▬" : row.doneAsSecond}
          </TableCell>

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
                          <TableCell component="th" scope="row" align="right">
                            {categoryRow.name}
                          </TableCell>
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
  const [searchTerm, setSearchTerm] = useState('');


  // Handler to update the search term
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filter rows based on the search term
  const filteredRows = rows.filter(row => {
    return row.procedureName.toLowerCase().includes(searchTerm);
  });

  return (
    <>
      <MenuLogo />

      <Grid container spacing={2}>
        <Box display="flex" justifyContent="center">
          <Grid item xs={10} alignItems="center" >

            <TableContainer component={Paper} sx={{ maxHeight: 620, mt: "100px", mb: "100px", direction: "rtl", overflow: "auto" }}>
              <Table stickyHeader aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right" />
                    <TableCell align="right">שם הניתוח

                      <TextField
                        label="חיפוש ניתוח"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ mr: "10px" }}
                        InputProps={{
                          style: {
                            height: '40px',
                            padding: '0px', // Adjust padding as needed
                          },
                        }}
                      />

                    </TableCell>
                    <TableCell align="center" >דרישה כראשי</TableCell>
                    <TableCell align="center" sx={{ borderLeft: '1px solid rgba(224, 224, 224, 1)' }}>נעשה כראשי</TableCell>
                    <TableCell align="center" >דרישה כעוזר ראשון</TableCell>
                    <TableCell align="center" sx={{ borderLeft: '1px solid rgba(224, 224, 224, 1)' }}>נעשה כעוזר ראשון</TableCell>
                    <TableCell align="center">דרישה כעוזר שני</TableCell>
                    <TableCell align="center">נעשה כעוזר שני</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.map((row, index) => (
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
