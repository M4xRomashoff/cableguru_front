import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { clearSession } from '../helpers/storage';
import { refreshPage } from '../helpers/windowHelpers';
import { useUserStore } from '../store';
import CustomButton from './Button';
import TemporaryDrawer from './HeaderMenu';
import { useState } from 'react';
import logo from './icons/cableguru_logo_60.png'
function LogoutClick() {
  clearSession();
  refreshPage();
}

export default function Header({ setLb, setSetting, setSearch, setPrint, setHistory, setRouteDetailsIsOpen, setTraceIsOpen, menuLabel, setMenuLabel, setDocuments }) {
  const { userStore } = useUserStore();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (callback) => () => {
    callback?.();
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <TemporaryDrawer
        setDocuments={setDocuments}
        setMenuLabel={setMenuLabel}
        isOpen={openMenu}
        onClose={setOpenMenu}
        setLb={setLb}
        setSetting={setSetting}
        setSearch={setSearch}
        setPrint={setPrint}
        setHistory={setHistory}
        setRouteDetailsIsOpen={setRouteDetailsIsOpen}
        setTraceIsOpen={setTraceIsOpen}
      />
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setOpenMenu(true)}>
            <MenuIcon />
          </IconButton>
          <img src={logo}/>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {menuLabel}
          </Typography>
          <div>
            <CustomButton color="warning" endIcon={<AccountCircle />} onClick={handleMenu}>
              <Typography>{userStore.user_name}</Typography>
            </CustomButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose()}>
              <MenuItem onClick={handleClose()}>Profile</MenuItem>
              <MenuItem onClick={handleClose(LogoutClick)}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
