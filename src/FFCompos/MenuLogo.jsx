import * as React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const settings = ['Profile', 'Account', 'Logout'];

export default function MenuLogo() {
  const navigate = useNavigate(); // Hook for navigation
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    navigate('/'); // Navigate to login page
  };

  // New function to navigate to the profile page
  const handleProfileClick = () => {
    navigate('/profile'); // Change this to your profile page route
  };

  return (
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <img width="100px" src="/src/Image/InternViewW.png" alt="logo" />
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src="src/Image/doctor1.png" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: isSmallScreen ? '45px' : '0' }} // Adjust margin-top for small screens
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={setting === 'Logout' ? handleLogout : (setting === 'Profile' ? handleProfileClick : handleCloseUserMenu)} // Add handleProfileClick for Profile
                >
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
