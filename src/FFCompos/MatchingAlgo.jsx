import React, { useState } from "react";
import { Container, Grid, Box } from "@mui/material";
import MenuLogo from "../FFCompos/MenuLogo";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import WeightsSelection from "../routingForAlgo/WeightsSelection";
import AddSurgery from "../routingForAlgo/AddSurgeries";
import SurgerySchedule from "../routingForAlgo/SurgerySchedule";

const navItemStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "150px", 
  height: "30px",
  borderRadius: "10px",
  borderStyle: "solid",
  borderWidth: "2px",
  borderColor: "#1976d2",
  margin: "0 20px", 
  padding: "10px 20px",
  cursor: "pointer",
  textAlign: "center",
  lineHeight: "1",
  fontWeight: "bold",
  fontSize: "18px",
  transition: "background-color 0.3s, border-color 0.3s",
  flexDirection: "row",
  gap: "10px", // Gap between icon and text
  color: "#000",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "#e3f2fd", // Light blue on hover
    transform: "scale(1.05)", // Slight scale up on hover
  },
};

const activeStyle = {
  backgroundColor: "LightSkyBlue",
  color: "white",
  borderColor: "#1976d2",
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
      <Container maxWidth="lg" sx={{ mt: 15, mb: 3 }}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "20px" }}>
            <div
              style={{
                ...navItemStyle,
                ...(selectedComponent === "addSurgery" ? activeStyle : {}),
              }}
              onClick={() => setSelectedComponent("addSurgery")}
            >
              <CloudUploadIcon />
              העלאת ניתוחים
            </div>
            <div
              style={{
                ...navItemStyle,
                ...(selectedComponent === "weights" ? activeStyle : {}),
              }}
              onClick={() => setSelectedComponent("weights")}
            >
              <PublishedWithChangesIcon />
              בחירת משקלים לשיבוץ
            </div>
            <div
              style={{
                ...navItemStyle,
                ...(selectedComponent === "schedule" ? activeStyle : {}),
              }}
              onClick={() => setSelectedComponent("schedule")}
            >
              <CalendarViewMonthIcon />
              לוח ניתוחים ושיבוץ
            </div>
          </nav>

          <Grid item xs={12}>
            {renderSelectedComponent()}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
