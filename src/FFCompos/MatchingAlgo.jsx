import React, { useState } from "react";
import { Container, Grid, Box } from "@mui/material";
import MenuLogo from "../FFCompos/MenuLogo";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import PeopleIcon from "@mui/icons-material/People";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// Import your components
import WeightsSelection from "../routingForAlgo/WeightsSelection";
import AddSurgery from "../routingForAlgo/AddSurgeries";
import SurgerySchedule from "../routingForAlgo/SurgerySchedule";
import InternScheduling from "../routingForAlgo/InternScheduling"; // Import your new component

export default function MatchingAlgo({ defaultComponent }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Use the default component from props or fallback to "schedule"
  const [selectedComponent, setSelectedComponent] = useState(
    defaultComponent || "schedule"
  );

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

  const renderButtons = () => {
    const buttonOrder = [
      "addSurgery",
      "weights",
      "internScheduling",
      "schedule",
    ];

    return buttonOrder.map((buttonType, index) => (
      <React.Fragment key={buttonType}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            width: { xs: "45%", sm: "170px" }, // Adjust width for small screens
            height: { xs: "45px", sm: "45px" },
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
            gap: "8px",
            color: "#000",
            backgroundColor:
              selectedComponent === buttonType ? "#85beed" : "transparent",
            borderColor:
              selectedComponent === buttonType ? "#1976d2" : "#90caf9",
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            margin: isMobile ? "5px" : "0", // Add margin to separate buttons on mobile
          }}
          onClick={() => setSelectedComponent(buttonType)}
        >
          {getIconForButton(buttonType)}
          {getLabelForButton(buttonType)}
        </Box>
        {!isMobile && index < buttonOrder.length - 1 && (
          <Box
            sx={{ width: "80px", height: "2px", backgroundColor: "#90caf9" }}
          />
        )}
      </React.Fragment>
    ));
  };

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

  const getLabelForButton = (buttonType) => {
    switch (buttonType) {
      case "addSurgery":
        return "העלאת ניתוחים";
      case "weights":
        return "בחירת משקלים לשיבוץ";
      case "internScheduling":
        return "שיבוץ תורנויות";
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
              flexDirection: { xs: "row", sm: "row" },
              flexWrap: "wrap", // Enable wrapping
              gap: { xs: 2, md: 3 }, // Define gap for spacing
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
