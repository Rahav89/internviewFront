import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Container } from '@mui/material';
import RecentSurgeries from '../FFCompos/RecentSurgeries';
import FullSyllabus from '../FFCompos/FullSyllabus';
import MenuLogo from '../FFCompos/MenuLogo';
import StepperOfIntern from './StepperOfIntern';
import TableChartIcon from '@mui/icons-material/TableChart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { GetInternByID } from './Server.jsx';


//--------------------------------------------------------

export default function InternPage() {

  // משתנה מצב לאחסון נתוני המשתמש הנוכחי
  const [currentUser, setCurrentUser] = useState(null);

  // Hook לניווט תוכניתי בין דפים
  const navigate = useNavigate();

  useEffect(() => {
    //session storage- שליפת מזהה המתמחה מה
    const internID = JSON.parse(sessionStorage.getItem('currentUserID'));
    
    // קריאה לפונקציה GetInternByID כדי לשלוף את נתוני המתמחה
    GetInternByID(internID)  // Call GetInternByID to fetch intern data
      .then((data) => {
        //console.log(data);
        // במקרה של קבלת נתונים, הגדרת המשתמש הנוכחי עם הנתונים המתקבלים
        setCurrentUser(data);
      })
      .catch((error) => {
        console.error("Error in GetInternByID: ", error);
      });
  }, []);  // רשימת תלויות ריקה מבטיחה שהקוד ירוץ רק פעם אחת לאחר טעינת הקומפוננטה


  // פונקציה לניווט לדף הסילבוס המלא
  const handleViewFullSyllabus = () => {
    navigate('/TableFullSyllabus/:id');
  };

  //מנווט לדף של כל המתמחים
  const handleViewIntern = () => {
    navigate('/ViewInterns');
  };

  return (
    <>

      <MenuLogo />
      <Container maxWidth="lg" sx={{ mt: 8, mb: 3 }}>
        <Grid container spacing={3} alignItems="center" dir={'rtl'}>

          {/* Welcome message */}
          <Grid item xs={12}  >
            {currentUser &&
              (<Typography variant="h6" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                ברוך הבא, {currentUser.first_name + " " + currentUser.last_name}👋
              </Typography>)
            }
          </Grid>
        </Grid>
      </Container>

      {/* ציר התקדמות */}
      <StepperOfIntern />

      <Container maxWidth="lg" sx={{ mt: 8, mb: 3 }}>
        <Grid container spacing={3} alignItems="center" dir={'rtl'}>
          {/* Full Syllabus View */}
          <Grid item xs={12}>
            <FullSyllabus />
          </Grid>

          {/* Full Syllabus Button */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <Button variant="contained" onClick={handleViewFullSyllabus} sx={{
              width: '100%', maxWidth: 300, backgroundColor: 'SkyBlue', '&:hover': {
                backgroundColor: 'SteelBlue'
              }
            }}>
              צפייה בסילבוס המלא
              <TableChartIcon sx={{ mr: 1 }} />
            </Button>
          </Grid>

          {/* רק כאשר המנהל מחובר מופיע הכפתור ומעביר לדף המתאים- צפייה במתמחים */}
          {currentUser && currentUser.isManager == true && (
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button variant="contained" onClick={handleViewIntern} sx={{
                width: '100%',
                maxWidth: 300,
                backgroundColor: 'MediumPurple',
                '&:hover': {
                  backgroundColor: 'RebeccaPurple'
                }
              }}>
                צפייה בהתקדמות המתמחים
                <VisibilityIcon sx={{ mr: 0.5 }} />
              </Button>
            </Grid>
          )}

          {/* Recent Surgeries */}
          <Grid item xs={12}>
            <RecentSurgeries />
          </Grid>

        </Grid>
      </Container>

    </>
  );
}
