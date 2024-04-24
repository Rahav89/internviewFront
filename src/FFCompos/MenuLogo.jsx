import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Tooltip, MenuItem, Badge } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MailIcon from '@mui/icons-material/Mail'; // Import for message icon
import logoImage from '/src/Image/doctor1.png';
const settings = ['ניהול משתמש', 'Account', 'התנתק'];

export default function MenuLogo() {
  const navigate = useNavigate(); // Hook for navigation
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorElUser, setAnchorElUser] = React.useState(null);//פתיחה וסגירת התפריט של ההגדרות

  //פתיחת התפריט של הההגדרות 
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  //פונקציה שמופעלת כדי לסגור את התפריט
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    navigate('/'); // Navigate to login page
  };

  // New function to navigate to the profile page
  const handleProfileClick = () => {
    navigate('/profile'); //Navigate to profile page
  };

  const handleLogoClick = () => {
    navigate('/intern'); ////Navigate to intern page
  };

  //התראות של ההודעות
  const unreadMessages = 5;


  return (
    <AppBar>
      <Container maxWidth="100%">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <IconButton onClick={handleLogoClick} sx={{ p: 0, '&:focus': { outline: 'none' } }} disableRipple>
              <img width="100px" src="/src/Image/InternViewW.png" alt="logo" />
            </IconButton>

          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="הודעות">
              {/* מייל */}
              <IconButton onClick={() => { handleMailMess }} sx={{ mr: 2 }}>
                <Badge badgeContent={unreadMessages} color="error">
                  <MailIcon style={{ color: 'white' }} fontSize="medium" />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="פתח הגדרות">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src={logoImage} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: isSmallScreen ? 'right' : 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: isSmallScreen ? 'right' : 'center',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} dir='rtl' onClick={setting === 'התנתק' ? handleLogout : (setting === 'ניהול משתמש' ? handleProfileClick : handleCloseUserMenu)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}