import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useNavigate } from 'react-router-dom';

export default function TemporaryDrawer({ isOpen, onClose, setLb, setSetting, setSearch, setPrint, setHistory, setTraceIsOpen, setRouteDetailsIsOpen, setMenuLabel }) {
  const list1 = ['Home', 'Fiber Route', 'Fiber Route Details', 'Search', 'Loss & Budget'];
  const list2 = ['Print', 'History', 'Statistics'];
  const list3 = ['Settings', 'Contact Us'];

  const navigate = useNavigate();
  const onClickHome = () => {
    setMenuLabel('Home: Control Panel');
    navigate(`/`);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    onClose(open);
  };

  function handleClick(text) {
    switch (text) {
      case 'Home':
        onClickHome();
        break;
      case 'Fiber Route':
        setTraceIsOpen(true);
        break;
      case 'Fiber Route Details':
        setRouteDetailsIsOpen(true);
        break;
      case 'History':
        setHistory(true);
        break;
      case 'Loss & Budget':
        setLb(true);
        break;
      case 'Statistics':
        console.log('Statistics');
        break;
      case 'Share Project':
        console.log('Share Project');
        break;
      case 'Search':
        console.log('search pressed!');
        setSearch(true);
        break;
      case 'Print':
        setPrint(true);
        break;
      case 'Settings':
        setSetting(true);
        break;
      case 'Contact Us':
        console.log('Contact Us');
        break;
      default:
        console.log(``);
    }
  }
  const list = (anchor) => (
    <Box sx={{ width: 150 }} role="presentation" onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
      <List>
        {list1.map((text, index) => (
          <ListItem key={text} disablePadding onClick={() => handleClick(text)}>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {list2.map((text, index) => (
          <ListItem key={text} disablePadding onClick={() => handleClick(text)}>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {list3.map((text, index) => (
          <ListItem key={text} disablePadding onClick={() => handleClick(text)}>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer('left', false)}>
        {list('left')}
      </Drawer>
    </div>
  );
}
