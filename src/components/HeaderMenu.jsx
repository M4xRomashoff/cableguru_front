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

export default function TemporaryDrawer({l, isOpen, onClose, setLb, setSetting, setSearch, setPrint, setHistory, setTraceIsOpen, setRouteDetailsIsOpen, setMenuLabel, setDocuments }) {

  // const list1 = ['Home', 'Fiber Route', 'Fiber Route Details', 'Search', 'Loss & Budget'];
  // const list2 = ['Print', 'History', 'Documents'];
  // const list3 = ['Settings', 'Contact Us'];

  const list1 = [l.Home, l.Fiber_Route, l.Fiber_Route_Details, l.Search, l.Loss_Budget];
  const list2 = [l.Print, l.History, l.Documents];
  const list3 = [l.Settings, l.Contact_Us];


  const navigate = useNavigate();
  const onClickHome = () => {
    setMenuLabel(l.Control_Panel);
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
      case l.Home:
        onClickHome();
        break;
      case l.Fiber_Route:
        setTraceIsOpen(true);
        break;
      case l.Fiber_Route_Details:
        setRouteDetailsIsOpen(true);
        break;
      case l.History:
        setHistory(true);
        break;
      case l.Loss_Budget:
        setLb(true);
        break;
      case l.Documents:
        setDocuments(true);
        break;
      case  l.Search:
        setSearch(true);
        break;
      case l.Print:
        setPrint(true);
        break;
      case l.Settings:
        setSetting(true);
        break;
      case l.Contact_Us:
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
