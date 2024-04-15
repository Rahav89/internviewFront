import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import MenuLogo from '../FFCompos/MenuLogo';
import { Container } from '@mui/material';
import { useState, useEffect } from 'react';
import { getSyllabus } from './Server.jsx';

export default function TableFullSyllabus() {


  const [dataS, setData] = useState([]);

  useEffect(() => {
    const getSyllabusDetails = async () => {
      try {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const syllabusData = await getSyllabus(currentUser.id);//API קריאה לכתובת 
        setData(syllabusData);
       // console.info(syllabusData)
      } catch (error) {
        console.error("Error in getSyllabusDetails: ", error);
      }
    };
    getSyllabusDetails();
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

  const table = useMaterialReactTable({
    columns,
    data: dataS,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    columnResizeDirection: 'rtl',
    enableHiding: false,

  });

  return (
    <>
      <MenuLogo />

      <Container sx={{ mt: 8, mb: 3 }} dir='ltr'>
        <MaterialReactTable table={table} />
      </Container>


    </>
  );


};


