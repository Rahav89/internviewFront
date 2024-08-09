import React from "react";
import MenuLogo from "./MenuLogo"; // ייבוא רכיב התפריט הראשי של המנהל
import ViewInterns from "./ViewInterns"; // ייבוא רכיב להצגת מתמחים
import { Link } from "react-router-dom"; // ייבוא רכיב ה-Link מ-React Router לצורך ניווט בין דפים
import { Button, Grid, Box, Typography, Paper } from "@mui/material"; // ייבוא רכיבי Material-UI
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; // אייקון עבור שיבוץ מתמחים
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck"; // אייקון עבור צפייה בסילבוס
import GroupAddIcon from "@mui/icons-material/GroupAdd"; // אייקון עבור הוספת מתמחים
import UploadFileIcon from "@mui/icons-material/UploadFile"; // אייקון עבור העלאת ניתוחים
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"; // אייקון עבור שיבוצים לניתוחים שבועיים

export default function MangerPage() {
  // מערך שמכיל את כל הפעולות האפשריות עבור המנהל, כולל הכותרת, האייקון והקישור הרלוונטי
  const actions = [
    {
      title: "שיבוץ מתמחים",
      icon: <AssignmentTurnedInIcon fontSize="large" color="primary" />,
      link: "/MatchingAlgo",
    },
    {
      title: "צפייה בסילבוס של מתמחה",
      icon: <PlaylistAddCheckIcon fontSize="large" color="primary" />,
      link: "/ShowSyllabusPerIntern",
    },
    {
      title: "הוספת מתמחים",
      icon: <GroupAddIcon fontSize="large" color="primary" />,
      link: "/addIntern",
    },
    {
      title: "שיבוץ תורנויות",
      icon: <AssignmentTurnedInIcon fontSize="large" color="primary" />,
      link: "/InternScheduling",
    },
    {
      title: "העלאת ניתוחים",
      icon: <UploadFileIcon fontSize="large" color="primary" />,
      link: "/AddSurgeries",
    },
    {
      title: "שיבוצים לניתוחים שבועיים",
      icon: <CalendarMonthIcon fontSize="large" color="primary" />,
      link: "",
    },
  ];

  return (
    <>
      <MenuLogo /> {/* רכיב שמציג את הלוגו או תפריט המנהל */}
      <ViewInterns /> {/* רכיב להצגת מתמחים */}
      <Box sx={{ p: 2 }}> {/* עטיפת הכפתורים בתוך Box עם מרווח פנימי */}
        <Grid container spacing={2} justifyContent="center"> {/* Grid שדואג לפריסה של הכפתורים */}
          {actions.map((action, index) => ( /* מיפוי על כל פעולה במערך כדי ליצור כפתור עם פרטים מותאמים */
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}> {/* Grid item שמגדיר את הרוחב של כל כפתור בהתאם לגודל המסך */}
              <Paper
                elevation={3} // צל קל לכרטיס כדי להדגיש אותו
                sx={{
                  padding: 2,
                  textAlign: "center",
                  transition: "transform 0.2s", // אפקט תנועה קל בעת ריחוף מעל הכרטיס
                  "&:hover": { transform: "scale(1.05)" }, // הגדלת הכרטיס בעת ריחוף
                  height: "150px", // קביעת גובה אחיד לכל הכפתורים
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "2px solid #1976d2", // מסגרת כחולה סביב הכרטיס
                  borderRadius: "8px", // עיגול פינות הכרטיס
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {action.icon} {/* הצגת האייקון של הפעולה */}
                  <Typography variant="h6" sx={{mt:2 }}>
                    {action.title} {/* הצגת הכותרת של הפעולה */}
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to={action.link} // הקישור לדף הרלוונטי
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }} // מרווח עליון בין הכותרת לכפתור
                >
                  מעבר
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
