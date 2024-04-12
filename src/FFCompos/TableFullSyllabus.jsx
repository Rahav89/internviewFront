import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import MenuLogo from '../FFCompos/MenuLogo';
import { Grid, Typography, Button, Paper, Container, Box} from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID',flex: 0.5, minWidth: 70 },
  { field: 'firstName', headerName: 'First name',flex: 1, minWidth: 130 },
  { field: 'lastName', headerName: 'Last name',flex: 1,  minWidth: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    flex: 0.5, 
    minWidth: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    minWidth: 160,
     flex: 1.5,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function TableFullSyllabus() {
  return (
    <>
      <MenuLogo />
      <Container sx={{ maxWidth: '100%', mb: 3, mt: 8 }} >
        <Grid container spacing={2} alignItems="center">

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
