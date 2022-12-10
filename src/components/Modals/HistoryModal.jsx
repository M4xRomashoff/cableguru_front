import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from './ModalWithTitle';
import useApi from '../../hooks/useApi';
import { getSessionItem } from '../../helpers/storage';
import { loadHistory } from '../../api/dataBasesApi';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import CustomButton from '../Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { layerGroup } from 'leaflet';
import { getUsersRequest } from '../../api/userApi';

function keyGen() {
  let number = Math.random();
  return number;
}

const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    padding: 1,
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 1,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    height: 10,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const HistoryModal = ({ l, onClose, markersSp, markersTp }) => {
  const [loadedItems, setLoadedItems] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [logItems, setLogItems] = useState([]);
  const [items, setItems] = useState([]);
  const [actions, setActions] = useState([]);
  const [item, setItem] = useState('none');
  const [action, setAction] = useState('none');
  const dataHead = ['user_id', 'item', 'date', 'action', 'comment'];
  const { dbName } = getSessionItem('project');

  useEffect(() => {
    let newItems = [];
    let newItems2 = [];

    if (item !== 'none') {
      for (let i = 0; i < loadedItems.length; i++) {
        if (loadedItems[i][1] === item) newItems.push(loadedItems[i]);
      }
    } else {
      newItems = loadedItems;
    }

    if (action !== 'none') {
      for (let i = 0; i < newItems.length; i++) {
        if (newItems[i][3] === action) newItems2.push(newItems[i]);
      }
    } else newItems2 = newItems;
    setLogItems(newItems2);
  }, [item, action]);

  function onTagsChangeItems(event, values) {
    setItem(values);
  }

  function onTagsChangeActions(event, values) {
    setAction(values);
  }

  useEffect(() => {
    getUsers();
  }, [dbName]);

  const getUsers = async () => {
    const usersList = await getUsersRequest();
    setUsersList(usersList);
  };

  function getUserName(user_id) {
    let userName = user_id;
    if (usersList.length > 0) {
      for (let i = 0; i < usersList.length; i++) {
        if (user_id === usersList[i].id) {
          userName = usersList[i].user_name;
          break;
        }
      }
    }
    return userName;
  }

  const { isLoadingTp: isTpLoading } = useApi({
    request: () => loadHistory(dbName),
    setter: (data) => {
      const items = [];
      const actions = [];
      const tempData = [];
      let tempItem = [];
      for (let i = 0; i < data.length; i++) {
        const userName = getUserName(data[i].user_id);
        tempItem.push(userName);
        tempItem.push(data[i].item);
        items.push(data[i].item);
        tempItem.push(data[i].date_created.slice(0, 10));
        tempItem.push(data[i].action);
        actions.push(data[i].action);
        tempItem.push(data[i].comments);
        tempData.push(tempItem.slice());
        tempItem = [];
      }

      let uniqueItems = [...new Set(items)];
      uniqueItems.unshift('none');
      setItems(uniqueItems);
      let uniqueActions = [...new Set(actions)];
      uniqueActions.unshift('none');
      setActions(uniqueActions);
      setLoadedItems(tempData);
      setLogItems(tempData);
    },
    shouldRequest: Boolean(dbName) && Boolean(usersList.length > 0),
  });

  return (
    <ModalWithTitle title={l.History} containerSx={{ width: 900, height: 800 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column">
        <Box display="flex" gap={2} alignItems="flex-start" flexDirection="row">
          <Autocomplete
            disablePortal
            id="search"
            filterSelectedOptions
            options={items}
            sx={{ width: 300 }}
            onChange={onTagsChangeItems}
            renderInput={(params) => <TextField {...params} label={l.Filter_by_item_id} />}
          />
          <Autocomplete
            disablePortal
            id="search"
            filterSelectedOptions
            options={actions}
            sx={{ width: 300 }}
            onChange={onTagsChangeActions}
            renderInput={(params) => <TextField {...params} label={l.Filter_by_action} />}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300 }} aria-label="customized table">
            <TableHead>
              <StyledTableRow key={keyGen()}>
                {dataHead.map((cellHeader) => (
                  <StyledTableCell2 key={keyGen()} align="left">
                    {cellHeader}
                  </StyledTableCell2>
                ))}
              </StyledTableRow>
            </TableHead>
            {logItems.length > 0 && (
              <TableBody>
                {logItems.map((row) => (
                  <StyledTableRow key={keyGen()}>
                    {row?.map?.((cellBody) => (
                      <StyledTableCell2 key={keyGen()} align="left" sx={{ minWidth: 100 }}>
                        {cellBody}
                      </StyledTableCell2>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>
    </ModalWithTitle>
  );
};

export default HistoryModal;
//
