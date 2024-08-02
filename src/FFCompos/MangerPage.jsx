import React from "react";
import MenuLogo from "./MenuLogo";
import ViewInterns from "./ViewInterns";
import { useNavigate } from "react-router-dom";
import { Button,Grid, Box} from "@mui/material";

export default function MangerPage() {
  const navigate = useNavigate();
  return (
    <>
      <MenuLogo />
      <ViewInterns />
      <Grid>
        <Box sx={{ m: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
            onClick={() => navigate("/MatchingAlgo")}
          >
            שיבוץ מתמחים
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
            onClick={() => navigate("/ShowSyllabusPerIntern")}
          >
            צפייה בסילבוס של מתמחה
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
            onClick={() => navigate("/addIntern")}
          >
            ניהול מתמחים 
          </Button>
          {/* <Button
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
            onClick={() => navigate("/CalenderAllSurgeries")}
          >
            לוח ניתוחים
          </Button> */}
        </Box>
      </Grid>
    </>
  );
}
