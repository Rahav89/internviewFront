import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import MenuLogo from '../FFCompos/MenuLogo';
import { Container, ThemeProvider, createTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { getSyllabus } from './Server.jsx';
import '../App.css';

//------------------------------------------

export default function TableFullSyllabus() {


  const [dataS, setData] = useState([]);

  useEffect(() => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        getSyllabus(currentUser.id)
        .then((data)=> { setData(data);})
        .catch((error) => {
          console.error("Error in getSyllabusDetails: ", error);
     });
  }, []);

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'procedureName', //access nested data with dot notation
        header: 'שם פרוצדורת הניתוח',
        size: 300,
      },
      {
        accessorKey: 'syllabus',
        header: 'דרישות הסילבוס',
        size: 90,
      },
      {
        accessorKey: 'haveDone', //normal accessorKey
        header: 'כמות ביצועים',
        size: 90,
      },
      {
        accessorKey: 'need',
        header: 'כמה נדרש',
        size: 90,
      },
    ],
    [],
  );


  const theme = createTheme({
    direction: 'rtl', // Right to left theme
  });


  const table = useMaterialReactTable({
    columns,
    data: dataS,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
  });

  return (
    <>
      <MenuLogo />
      <ThemeProvider theme={theme}>
        <Container sx={{ mt: 8, mb: 3 }}  className="rtl-table">
          <MaterialReactTable table={table} />
        </Container>
      </ThemeProvider>
    </>
  );


};


