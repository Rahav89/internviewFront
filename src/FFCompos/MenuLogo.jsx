import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Tooltip, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, ListItemIcon, ListItemText } from '@mui/material';
import logoImage from '/src/Image/doctor1.png';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useState } from 'react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // ייבוא האייקון של התנתקות
import SettingsIcon from '@mui/icons-material/Settings'; // ייבוא אייקון הגדרות
import NotificationsIcon from '@mui/icons-material/Notifications'; // ייבוא אייקון התראות

//-----------------------------------------------------------
const settings = [
  { label: 'ניהול משתמש', icon: <SettingsIcon />, action: 'profile' },
  // { label: 'התראות', icon: <NotificationsIcon />, action: 'notifications' },
  { label: '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0התנתקות', icon: <ExitToAppIcon sx={{}} />, action: 'logout' }
];

export default function MenuLogo() {
  const navigate = useNavigate(); // Hook for navigation
  const [anchorElUser, setAnchorElUser] = useState(null);//פתיחה וסגירת התפריט של ההגדרות
  const [openDialog, setOpenDialog] = useState(false); // ניהול פתיחת דיאלוג
  const [notificationCount, setNotificationCount] = useState(5); // Example count, update as needed

  //פתיחת התפריט של הההגדרות 
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  //פונקציה שמופעלת כדי לסגור את התפריט
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  // טיפול בלחיצה על אפשרויות התפריט
  const handleMenuItemClick = (action) => {
    if (action === 'logout') {
      navigate('/');
    } else if (action === 'profile') {
      navigate('/profile');
    } else if (action === 'notifications') {
      setOpenDialog(true);
    }
    handleCloseUserMenu();
  };
  // טיפול בסגירת התיבה דו שיח
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  // פונקציה לניווט לעמוד הלוח שנה
  const handleCalenderPage = () => {
    navigate('/calender');
  }
  return (
    <AppBar sx={{ marginBottom: 12 }}>
      <Container maxWidth="100%" >
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/intern')} sx={{ p: 0, '&:focus': { outline: 'none' } }} disableRipple>
              <img width="100px" src="/src/Image/InternViewW.png" alt="logo" />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="לוח שנה">
              <Box>
                {/* לוח שנה */}
                <IconButton onClick={() => { handleCalenderPage() }} sx={{ mr: 2, '&:focus': { outline: 'none' } }} >
                  <CalendarMonthIcon style={{ color: 'white' }} fontSize="medium" />
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip title="פתח הגדרות">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, '&:focus': { outline: 'none' } }}>
                <Avatar src={logoImage} />
                {/* <Badge badgeContent={notificationCount} color="error" sx={{ top: -13, right: 5 }} /> */}
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '30px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.label}
                  onClick={() => handleMenuItemClick(setting.action)}
                  sx={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'row-reverse'
                  }}
                >
                  <ListItemIcon sx={{ mr: -2, paddingLeft: 1 }}>
                    {setting.icon}
                  </ListItemIcon>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                    {/* {setting.label === 'התראות' && (
                      <Badge badgeContent={notificationCount} color="error" sx={{ mr: 4 }}>
                      </Badge>)} */}
                    <ListItemText primary={setting.label} />
                  </Box>


                </MenuItem>
              ))}

            </Menu>
          </Box>
        </Toolbar>
      </Container>
      {/* <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>התראות</DialogTitle>
        <DialogContent>
          <DialogContentText>כאן יוצגו התראות שלך.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>סגור</Button>
        </DialogActions>
      </Dialog> */}

    </AppBar>
  );
}