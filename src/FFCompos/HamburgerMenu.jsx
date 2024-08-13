import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import {
  Home,
  AssignmentTurnedIn,
  Visibility,
  GroupAdd,
  UploadFile,
  CalendarMonth,
} from "@mui/icons-material";
import ScaleIcon from "@mui/icons-material/Scale";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
const HamburgerMenu = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (link) => {
    setIsOpen(false); // Close the menu when a menu item is clicked
    navigate(link); // Navigate to the selected page
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false); // Close the menu if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const homeMenuItem = {
    text: "בית",
    icon: <Home />,
    link: role === "intern" ? "/intern" : "/MangerPage",
  };

  const internMenuItems = [
    homeMenuItem,
    {
      text: "צפייה בסילבוס",
      icon: <Visibility />,
      link: "/TableFullSyllabus/:id",
    },
    { text: "צפייה בלוח שנה ", icon: <CalendarMonthIcon />, link: "/calender" },
    {
      text: "צפייה בניתוחים שבוצעו",
      icon: <AssignmentTurnedIn />,
      link: "/details/:id",
    },
  ];

  const managerMenuItems = [
    homeMenuItem,
    {
      text: "צפייה בסילבוס של מתמחה",
      icon: <Visibility />,
      link: "/ShowSyllabusPerIntern",
    },
    { text: "הוספת מתמחה למערכת", icon: <GroupAdd />, link: "/addIntern" },
    { text: "העלאת ניתוחים", icon: <UploadFile />, link: "/AddSurgeries" },
  ];

  const algorithmMenuItems = [
    {
      text: "בחירת ניתוחים לשיבוץ",
      icon: <DashboardCustomizeIcon />,
      link: "/SurgerySchedule",
    },
    {
      text: "שיבוץ מתמחים לתורנויות",
      icon: <PeopleIcon />,
      link: "/InternScheduling",
    },
    {
      text: "צפייה בשיבוצים לניתוחים",
      icon: <CalendarMonth />,
      link: "/WeeklySchedule",
    },
    { text: "בחירת משקלים לאלגוריתם", icon: <ScaleIcon />, link: "/weights" },
  ];

  const menuItems = role === "intern" ? internMenuItems : managerMenuItems;

  return (
    <div style={styles.hamburgerContainer} ref={menuRef}>
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
          <ListItem
            button
            onClick={() => handleMenuItemClick(homeMenuItem.link)}
            sx={styles.menuItem}
          >
            <ListItemIcon sx={styles.icon}>{homeMenuItem.icon}</ListItemIcon>
            <ListItemText
              primary={homeMenuItem.text}
              sx={styles.listItemText}
            />
          </ListItem>
          <Divider sx={styles.divider} />
        </Box>

        {menuItems.slice(1).map((item, index) => (
          <Box key={index}>
            <ListItem
              button
              onClick={() => handleMenuItemClick(item.link)}
              sx={styles.menuItem}
            >
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
              <ListItem
                button
                onClick={() => handleMenuItemClick(item.link)}
                sx={styles.menuItem}
                key={index}
              >
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
    padding: "1px",
    zIndex: "1000",
    borderRadius: "5px",
    width: "200px",
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
    marginRight: "0px",
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
