import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { clearSession, setSessionItem } from '../helpers/storage';
import { refreshPage } from '../helpers/windowHelpers';
import { useUserStore } from '../store';
import CustomButton from './Button';
import TemporaryDrawer from './HeaderMenu';
import { useState } from 'react';
import logo from './icons/cableguru_logo_60.png';
import langPackRu from '../assets/ru.json';
import langPackEn from '../assets/en.json';


function LogoutClick() {
  clearSession();
  refreshPage();
}

export default function Header({ l, setL, setLb, setSetting, setSearch, setPrint, setHistory, setRouteDetailsIsOpen, setTraceIsOpen, menuLabel, setMenuLabel, setDocuments }) {
  const { userStore } = useUserStore();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElLang, setAnchorElLang] = React.useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [language, setLanguage]= useState(l.Language);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuLang = (event) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleClose = (callback) => () => {
    callback?.();
    setAnchorEl(null);
  };

  const handleCloseLang = (lng) => () => {

     if (lng === 'ru') {
       setSessionItem('lang','ru');
       setL(langPackRu);
       setLanguage('Русский')
     }
     if (lng === 'en') {
       setSessionItem('lang','en');
       setL(langPackEn);
       setLanguage('English')
     }
    setAnchorElLang(null);

  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <TemporaryDrawer
        l={l}
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
        <Toolbar  >
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

            <CustomButton color="warning" endIcon={<LanguageIcon />} onClick={handleMenuLang}>
              <Typography>{language}</Typography>
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
              <MenuItem onClick={handleClose()}>{l.Profile}</MenuItem>
              <MenuItem onClick={handleClose(LogoutClick)}>{l.Logout}</MenuItem>
            </Menu>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElLang}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElLang)}
              onClose={handleCloseLang()}>
              <MenuItem onClick={handleCloseLang('en')}>English</MenuItem>
              <MenuItem onClick={handleCloseLang('ru')}>Русский</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
