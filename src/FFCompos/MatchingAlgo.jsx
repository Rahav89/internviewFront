import React, { useState } from "react";
import { Container, Grid, Box } from "@mui/material";
import MenuLogo from "../FFCompos/MenuLogo";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import WeightsSelection from "../routingForAlgo/WeightsSelection";
import AddSurgery from "../routingForAlgo/AddSurgeries";
import SurgerySchedule from "../routingForAlgo/SurgerySchedule";

const navItemStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: { xs: "160px", sm: "200px" }, 
  height: { xs: "60px", sm: "70px" },
  borderRadius: "30px",
  borderStyle: "solid",
  borderWidth: "2px",
  borderColor: "#90caf9",
  margin: "0 40px",
  padding: "10px 20px",
  cursor: "pointer",
  textAlign: "center",
  lineHeight: "1",
  fontWeight: "bold",
  fontSize: { xs: "14px", sm: "16px" },
  transition: "background-color 0.3s, border-color 0.3s",
  flexDirection: "row",
  gap: "15px",
  color: "#000",
  backgroundColor: "transparent",
};

const activeStyle = {
  backgroundColor: "#bbdefb",
  color: "white",
  borderColor: "#1976d2",
};

const lineStyle = {
  width: "100px",
  height: "2px",
  backgroundColor: "#90caf9",
};

export default function MatchingAlgo() {
  const [selectedComponent, setSelectedComponent] = useState("schedule");

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "weights":
        return <WeightsSelection />;
      case "addSurgery":
        return <AddSurgery />;
      case "schedule":
        return <SurgerySchedule />;
      default:
        return null;
    }
  };

  return (
    <>
      <MenuLogo />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 3 }}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            <Box
              component="button" // Ensure this is focusable
              style={{
                ...navItemStyle,
                ...(selectedComponent === "addSurgery" ? activeStyle : {}),
              }}
              onClick={() => setSelectedComponent("addSurgery")}
            >
              <CloudUploadIcon />
              העלאת ניתוחים
            </Box>
            <div style={lineStyle} />
            <Box
              component="button" // Ensure this is focusable
              style={{
                ...navItemStyle,
                ...(selectedComponent === "weights" ? activeStyle : {}),
              }}
              onClick={() => setSelectedComponent("weights")}
            >
              <PublishedWithChangesIcon />
              בחירת משקלים
            </Box>
            <div style={lineStyle} />
            <Box
              component="button" // Ensure this is focusable
              style={{
                ...navItemStyle,
                ...(selectedComponent === "schedule" ? activeStyle : {}),
              }}
              onClick={() => setSelectedComponent("schedule")}
            >
              <CalendarViewMonthIcon />
              לוח ניתוחים
            </Box>
          </nav>

          <Grid item xs={12}>
            {renderSelectedComponent()}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
