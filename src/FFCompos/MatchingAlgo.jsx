import React, { useState } from "react";
import { Container, Grid, Box } from "@mui/material";
import MenuLogo from "../FFCompos/MenuLogo";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import PeopleIcon from "@mui/icons-material/People";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// import { useLocation } from "react-router-dom";

// Import your components
import WeightsSelection from "../routingForAlgo/WeightsSelection";
import AddSurgery from "../routingForAlgo/AddSurgeries";
import SurgerySchedule from "../routingForAlgo/SurgerySchedule";
import InternScheduling from "../routingForAlgo/InternScheduling";

const navItemStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: { xs: "150px", sm: "170px" },
  height: { xs: "35px", sm: "35px" },
  borderRadius: "15px",
  borderStyle: "solid",
  borderWidth: "2px",
  borderColor: "#90caf9",
  padding: "5px 10px",
  cursor: "pointer",
  textAlign: "center",
  lineHeight: "1",
  fontWeight: "bold",
  fontSize: { xs: "13px", sm: "14px" },
  transition: "background-color 0.3s, border-color 0.3s",
  flexDirection: "row",
  gap: "8px",
  color: "#000",
  backgroundColor: "transparent",
  whiteSpace: "nowrap",
};

const activeStyle = {
  backgroundColor: "#85beed",
  color: "white",
  borderColor: "#1976d2",
};

const lineStyle = {
  width: "80px",
  height: "2px",
  backgroundColor: "#90caf9",
  display: { xs: "none", md: "block" },
};

export default function MatchingAlgo() {
  const [selectedComponent, setSelectedComponent] = useState("schedule");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const location = useLocation();

  // Access the props passed from MangerPage
  // const { message, data } = location.state || {};

  // Render the selected component based on user choice
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "weights":
        return <WeightsSelection />;
      case "addSurgery":
        return <AddSurgery />;
      case "schedule":
        return <SurgerySchedule />;
      case "internScheduling":
        return <InternScheduling />;
      default:
        return null;
    }
  };

  // Render buttons for navigation between components
  const renderButtons = () => {
    const buttonOrder = isMobile
      ? ["schedule", "internScheduling", "weights", "addSurgery"]
      : ["addSurgery", "weights", "internScheduling", "schedule"];

    return buttonOrder.map((buttonType, index) => (
      <React.Fragment key={buttonType}>
        <Box
          sx={{
            ...navItemStyle,
            ...(selectedComponent === buttonType ? activeStyle : {}),
          }}
          onClick={() => setSelectedComponent(buttonType)}
        >
          {getIconForButton(buttonType)}
          {getLabelForButton(buttonType)}
        </Box>
        {index < buttonOrder.length - 1 && <Box sx={lineStyle} />}
      </React.Fragment>
    ));
  };

  // Return appropriate icon for each button type
  const getIconForButton = (buttonType) => {
    switch (buttonType) {
      case "addSurgery":
        return <CloudUploadIcon />;
      case "weights":
        return <PublishedWithChangesIcon />;
      case "internScheduling":
        return <PeopleIcon />;
      case "schedule":
        return <CalendarViewMonthIcon />;
      default:
        return null;
    }
  };

  // Return appropriate label for each button type
  const getLabelForButton = (buttonType) => {
    switch (buttonType) {
      case "addSurgery":
        return "העלאת ניתוחים";
      case "weights":
        return "בחירת משקלים לשיבוץ";
      case "internScheduling":
        return "שיבוץ מתמחים";
      case "schedule":
        return "לוח ניתוחים ושיבוץ";
      default:
        return "";
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
              gap: { xs: 2, md: 3 },
            }}
          >
            {renderButtons()}
          </Box>

          <Grid item xs={12}>
            {renderSelectedComponent()}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
