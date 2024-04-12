import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import MenuLogo from '../FFCompos/MenuLogo';
import { Grid, Typography, Button, Paper, Container, Box} from '@mui/material';
import { getSyllabus } from './Server.jsx';



export default function TableFullSyllabus() {
  const [data, setData] = useState(null);

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
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'procedureName', headerName: 'שם הפרוצדורה',flex: 0.5, minWidth: 70 },
    { field: 'syllabus', headerName: 'דרישת הסילבוס',flex: 1, minWidth: 130 },
    { field: 'haveDone', headerName: 'כמה ביצעת',flex: 1,  minWidth: 130 },
    { field: 'need', headerName: 'כמה חסר',flex: 1,  minWidth: 130 }
  ];

  const rows = [
    { id: 1,procedureName: 1, syllabus: 'Snow', haveDone: 'Jon', need: 35 },


  ];
  return (
    <>
      <MenuLogo />
      <Container sx={{ maxWidth: '100%', mb: 3, mt: 8 }} dir="rtl">
        <Grid container spacing={2} alignItems="right">

            <Paper sx={{
            p: 2, m: 2, backgroundColor: '#FFFAFA', display: 'inline-block',
            width: '100%',
          }}>
            <Box sx={{ width: '100%', height: 400 }}>
              <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
            </Box>
         
          </Paper>
        
        </Grid>
      </Container>

    </>

  );
}
