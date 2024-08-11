import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, ListItem, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material";
import { Home, AssignmentTurnedIn, Visibility, GroupAdd, UploadFile, CalendarMonth } from "@mui/icons-material";

const HamburgerMenu = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (link) => {
    setIsOpen(false); // Close the menu when a menu item is clicked
    navigate(link); // Navigate to the selected page
  };

  const homeMenuItem = {
    text: "בית",
    icon: <Home />,
    link: role === "intern" ? "/intern" : "/MangerPage",
  };

  const internMenuItems = [
    homeMenuItem,
    { text: "צפייה בסילבוס", icon: <Visibility />, link: "/TableFullSyllabus/:id" },
    { text: "צפייה בניתוחים שבוצעו", icon: <AssignmentTurnedIn />, link: "/details/:id" },
  ];

  const managerMenuItems = [
    homeMenuItem,
    { text: "צפייה בסילבוס של מתמחה", icon: <Visibility />, link: "/ShowSyllabusPerIntern" },
    { text: "הוספת מתמחה למערכת", icon: <GroupAdd />, link: "/addIntern" },
    { text: "העלאת ניתוחים", icon: <UploadFile />, link: "/AddSurgeries" },
  ];

  const algorithmMenuItems = [
    { text: "בחירת ניתוחים לשיבוץ", icon: <AssignmentTurnedIn />, link: "/SurgerySchedule" },
    { text: "שיבוץ מתמחים לתורנויות", icon: <AssignmentTurnedIn />, link: "/InternScheduling" },
    { text: "צפייה בשיבוצים לניתוחים", icon: <CalendarMonth />, link: "/WeeklySchedule" },
    { text: "בחירת משקלים לאלגוריתם השיבוץ", icon: <AssignmentTurnedIn />, link: "/weights" },
  ];

  const menuItems = role === "intern" ? internMenuItems : managerMenuItems;

  return (
    <div style={styles.hamburgerContainer}>
      <button onClick={toggleMenu} style={styles.hamburgerButton}>
        ☰
      </button>
      <Box
        sx={{
          ...styles.hamburgerMenu,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateX(0)" : "translateX(-250px)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <Box>
          <ListItem button onClick={() => handleMenuItemClick(homeMenuItem.link)} sx={styles.menuItem}>
            <ListItemIcon sx={styles.icon}>{homeMenuItem.icon}</ListItemIcon>
            <ListItemText primary={homeMenuItem.text} sx={styles.listItemText} />
          </ListItem>
          <Divider sx={styles.divider} />
        </Box>

        {menuItems.slice(1).map((item, index) => (
          <Box key={index}>
            <ListItem button onClick={() => handleMenuItemClick(item.link)} sx={styles.menuItem}>
              <ListItemIcon sx={styles.icon}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={styles.listItemText} />
            </ListItem>
            {index === menuItems.length - 2 && role !== "intern" && <Divider />}
          </Box>
        ))}

        {role !== "intern" && (
          <Box sx={styles.algorithmSection}>
            <Typography variant="subtitle1" sx={styles.sectionTitle}>
              אלגוריתם
            </Typography>
            {algorithmMenuItems.map((item, index) => (
              <ListItem button onClick={() => handleMenuItemClick(item.link)} sx={styles.menuItem} key={index}>
                <ListItemIcon sx={styles.icon}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={styles.listItemText} />
              </ListItem>
            ))}
          </Box>
        )}
      </Box>
    </div>
  );
};

const styles = {
  hamburgerContainer: {
    position: "relative",
    display: "inline-block",
  },
  hamburgerButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "white",
  },
  hamburgerMenu: {
    position: "absolute",
    top: "40px",
    left: "0",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    padding: "10px",
    zIndex: "1000",
    borderRadius: "8px",
    width: "250px",
    direction: "rtl",
    transition: "opacity 0.3s ease, transform 0.3s ease",
  },
  menuItem: {
    display: "flex",
    padding: "7px",
    color: "#333",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  icon: {
    color: "#1976d2",
    marginRight: "2px",
    minWidth: "38px",
  },
  listItemText: {
    textAlign: "right",
  },
  algorithmSection: {
    marginTop: "10px",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: "4px",
    paddingRight: "10px",
    color: "#555",
    textAlign: "right",
  },
  divider: {
    marginBottom: "8px",
  },
};

export default HamburgerMenu;
