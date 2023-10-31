import * as React from 'react';
import { Link } from 'react-router-dom';
import IsAuthenticated from '../authentication/IsAuthenticated';
import axiosapi from '../../api/axiosapi';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Stack from '@mui/material/Stack';

const pages = {
    TestAuth: '/testAuth',

};
const settings = {
    Profile: '/profile',
    Account: '/account',
    Dashboard: '/dashboard',
  };

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const isAuthenticated = IsAuthenticated();

  const logout = () => {
    // Log out the user, clear tokens, and navigate to the "/testAuth" route
    axiosapi.apiUserLogout();
    Navigate('/testAuth');
}

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
            {Object.entries(pages).map(([page, path]) => (
            <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Link to={path} className="nav-link">
                <Typography textAlign="center">{page}</Typography>
                </Link>
            </MenuItem>
            ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {Object.entries(pages).map(([page, path]) => (
            <Button
                key={page}
                component={Link} // Use the Link component
                to={path} // Specify the target path
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                {page}
            </Button>
            ))}
          </Box>

        {isAuthenticated ? (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Bullet" src="https://us-tuna-sounds-images.voicemod.net/f322631f-689a-43ac-81ab-17a70f27c443-1692187175560.png" />
            </IconButton>
            </Tooltip>
            <Menu
            sx={{ mt: '45px' }}
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
            {Object.entries(settings).map(([setting, path]) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Link to={path} className="nav-link">
                    <Typography textAlign="center">{setting}</Typography>
                </Link>
                </MenuItem>
            ))}
              <MenuItem>
                <Link to={'/'} onClick={logout} className="nav-link">
                    <Typography textAlign="center">Logout</Typography>
                </Link>
              </MenuItem>
            </Menu>
        </Box>
        ) : (
            <Stack direction="row" spacing={2}>
                <Button variant="contained" href="/login" color="secondary">
                Login
                </Button>
                <Button variant="contained" href="/signup" color="secondary">
                Sign Up
                </Button>
            </Stack>
        )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;