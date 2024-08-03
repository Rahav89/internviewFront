import React, { useState } from "react";
import { Container, Grid, Box } from "@mui/material";
import MenuLogo from "../FFCompos/MenuLogo";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import PeopleIcon from "@mui/icons-material/People"; // New icon for scheduling interns

// Import your components
import WeightsSelection from "../routingForAlgo/WeightsSelection";
import AddSurgery from "../routingForAlgo/AddSurgeries";
import SurgerySchedule from "../routingForAlgo/SurgerySchedule";
import InternScheduling from "../routingForAlgo/InternScheduling"; // Import your new component

const navItemStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: { xs: "150px", sm: "170px" }, // Increased width for more text space
  height: { xs: "35px", sm: "35px" },
  borderRadius: "30px", // Circular appearance
  borderStyle: "solid",
  borderWidth: "2px",
  borderColor: "#90caf9",

  padding: "5px 10px", // Reduced padding
  cursor: "pointer",
  textAlign: "center",
  lineHeight: "1",
  fontWeight: "bold",
  fontSize: { xs: "13px", sm: "14px" },
  transition: "background-color 0.3s, border-color 0.3s",
  flexDirection: "row",
  gap: "8px", // Space between icon and text
  color: "#000",
  backgroundColor: "transparent",
  whiteSpace: "nowrap", // Ensure text doesn't wrap
};

const activeStyle = {
  backgroundColor: "#85beed",
  color: "white",
  borderColor: "#1976d2",
};

const lineStyle = {
  width: "80px", // Increased width for longer lines
  height: "2px",
  backgroundColor: "#90caf9",
  display: { xs: "none", md: "block" }, // Hide on screens smaller than 850px
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
      case "internScheduling":
        return <InternScheduling />; // Render the new component
      default:
        return null;
    }
  };

  return (
    <>
      <MenuLogo />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              gap: { xs: 2, md: 3 }, // Gap between items when in column mode
            }}
          >
            <Box
              sx={{
                ...navItemStyle,
                ...(selectedComponent === "addSurgery" ? activeStyle : {}),
              }}
              onClick={() => setSelectedComponent("addSurgery")}
            >
              <CloudUploadIcon />
              העלאת ניתוחים
            </Box>
            <Box sx={lineStyle} />
            <Box
              sx={{
                ...navItemStyle,
                ...(selectedComponent === "weights" ? activeStyle : {}),
              }}
              onClick={() => setSelectedComponent("weights")}
            >
              <PublishedWithChangesIcon />
              בחירת משקלים לשיבוץ
            </Box>{" "}
            <Box sx={lineStyle} />
            <Box
              sx={{
                ...navItemStyle,
                ...(selectedComponent === "internScheduling"
                  ? activeStyle
                  : {}),
              }}
              onClick={() => setSelectedComponent("internScheduling")}
            >
              <PeopleIcon />
              שיבוץ מתמחים
            </Box>
            <Box sx={lineStyle} />
            <Box
              sx={{
                ...navItemStyle,
                ...(selectedComponent === "schedule" ? activeStyle : {}),
              }}
              onClick={() => setSelectedComponent("schedule")}
            >
              <CalendarViewMonthIcon />
              לוח ניתוחים ושיבוץ
            </Box>
          </Box>

          <Grid item xs={12}>
            {renderSelectedComponent()}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
