import React from "react";
import MenuLogo from "./MenuLogo";
import ViewInterns from "./ViewInterns";
import { Link } from "react-router-dom";
import { Button, Grid, Box, useMediaQuery } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useTheme } from "@mui/material/styles";

export default function MangerPage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Detects small screens

  // // Example data to pass
  // const propsToPass = {
  //   message: "Hello from MangerPage!",
  //   data: { example: "Example data" },
  // };

  return (
    <>
      <MenuLogo />
      <ViewInterns />
      <Grid container justifyContent="center">
        <Box
          sx={{
            m: 2,
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row", // Change layout based on screen size
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            component={Link}
            to="/MatchingAlgo"
            variant="contained"
            color="primary"
            sx={{ m: 1, minWidth: "150px" }}
            startIcon={<AssignmentTurnedInIcon />}
          >
            שיבוץ מתמחים
          </Button>
          <Button
            component={Link}
            to="/ShowSyllabusPerIntern"
            variant="contained"
            color="primary"
            sx={{ m: 1, minWidth: "150px" }}
            startIcon={<PlaylistAddCheckIcon />}
          >
            צפייה בסילבוס של מתמחה
          </Button>
          <Button
            component={Link}
            to="/addIntern"
            variant="contained"
            color="primary"
            sx={{ m: 1, minWidth: "150px" }}
            startIcon={<GroupAddIcon />}
          >
            ניהול מתמחים
          </Button>
          <Button
            component={Link}
            to="/InternScheduling" // Navigate to InternScheduling which now uses MatchingAlgo
            variant="contained"
            color="primary"
            sx={{ m: 1, minWidth: "150px" }}
            startIcon={<AssignmentTurnedInIcon />}
          >
            שיבוץ תורנויות
          </Button>
          <Button
            component={Link}
            to="/AddSurgeries"
            variant="contained"
            color="primary"
            sx={{ m: 1, minWidth: "150px" }}
            startIcon={<UploadFileIcon />}
          >
            העלאת ניתוחים
          </Button>
        </Box>
      </Grid>
    </>
  );
}
