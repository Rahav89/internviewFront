import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import logoImage from "/src/Image/doctor1.png";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useState, useEffect } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import logoInternView from "/src/Image/InternViewW.png";
import { GetInternByID } from "./Server.jsx";
// import AddBoxIcon from "@mui/icons-material/AddBox";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

const settings = [
  {
    label: "\u00A0\u00A0ניהול משתמש",
    icon: <SettingsIcon />,
    action: "profile",
  },
  // { label: "\u00A0\u00A0\ניהול מתמחים", icon: <AddBoxIcon />, action: "addIntern" },
  { label: "צפייה כמתמחה", icon: <RemoveRedEyeIcon />, action: "intern" },
  {
    label: "\u00A0\u00A0צפייה כמנהל",
    icon: <SupervisorAccountIcon />,
    action: "manager",
  },
  {
    label: "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0התנתקות",
    icon: <ExitToAppIcon sx={{}} />,
    action: "logout",
  },
];

export default function MenuLogo() {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const [isInternView, setIsInternView] = useState(
    location.pathname === "/intern"
  );
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  useEffect(() => {
    const internID = JSON.parse(sessionStorage.getItem("currentUserID"));

    GetInternByID(internID)
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((error) => {
        console.error("Error in GetInternByID: ", error);
      });
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (action) => {
    if (action === "logout") {
      sessionStorage.removeItem("currentUserID");
      navigate("/");
    } else if (action === "profile") {
      navigate("/profile");
      // } else if (action === "addIntern") {
      //   navigate("/addIntern");
    } else if (action === "intern") {
      setIsInternView(true);
      navigate("/intern");
    } else if (action === "manager") {
      setIsInternView(false);
      navigate("/MangerPage");
    }
    handleCloseUserMenu();
  };

  const handleCalenderPage = () => {
    navigate("/calender");
  };

  const handleLogoClick = () => {
    if (currentUser?.isManager) {
      navigate(isInternView ? "/intern" : "/MangerPage");
    } else {
      navigate("/intern");
    }
  };
  const filteredSettings = currentUser?.isManager
    ? isInternView
      ? settings.filter((setting) => setting.action !== "intern")
      : settings.filter((setting) => setting.action !== "manager")
    : settings.filter(
        (setting) => setting.action !== "intern" && setting.action !== "manager"
      );
  // const filteredSettings = currentUser?.isManager
  // ? isInternView
  //   ? settings.filter(
  //     (setting) =>
  //       setting.action !== "intern" && setting.action !== "addIntern"
  //   )
  //   : settings.filter((setting) => setting.action !== "manager")
  // : settings.filter(
  //   (setting) =>
  //     setting.action !== "addIntern" &&
  //     setting.action !== "intern" &&
  //     setting.action !== "manager"
  // );

  return (
    <AppBar sx={{ marginBottom: 12 }}>
      <Container maxWidth="100%">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={handleLogoClick}
              sx={{ p: 0, "&:focus": { outline: "none" } }}
              disableRipple
            >
              <img width="100px" src={logoInternView} alt="logo" />
            </IconButton>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {currentUser && (
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                👋 שלום, {currentUser.first_name + " " + currentUser.last_name}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Tooltip title="לוח שנה">
              <Box>
                <IconButton
                  onClick={handleCalenderPage}
                  sx={{ mr: 2, "&:focus": { outline: "none" } }}
                >
                  <CalendarMonthIcon
                    style={{ color: "white" }}
                    fontSize="medium"
                  />
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip title="פתח הגדרות">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, "&:focus": { outline: "none" } }}
              >
                <Avatar src={logoImage} />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "30px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {filteredSettings.map((setting) => (
                <MenuItem
                  key={setting.label}
                  onClick={() => handleMenuItemClick(setting.action)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row-reverse",
                  }}
                >
                  <ListItemIcon sx={{ mr: -2, paddingLeft: 1 }}>
                    {setting.icon}
                  </ListItemIcon>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <ListItemText primary={setting.label} />
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
