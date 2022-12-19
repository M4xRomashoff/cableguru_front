import React, { useState, useRef, useEffect } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from '../Modals/ModalWithTitle';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CustomButton from '../Button';
import { updateTpItem } from '../../api/dataBasesApi';
import Input_item from '../sp/CustomInputM';
import { changeItemState } from '../../api/changeItemState';
import { logAddInfo } from '../../api/logFileApi';
import { getSessionItem, setSessionItem } from '../../helpers/storage';
import CustomInput from '../Inputs';
import MenuItem from '@mui/material/MenuItem';
import useTableKeyGen from '../../hooks/useTableKeyGen';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: 1,
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 1,
  },
}));
const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    padding: 1,
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    padding: 1,
  },
}));
const StyledTableCell3 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.white,
    padding: 1,
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    fontSize: 16,
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

const initialForm = {
  name_id: '',
  owner: '',
  address: '',
  mfg: '',
  model: '',
  capacity: '',
  connector: '',
  access: '',
  state: '',
  position: '',
  icon: '',
  birthday: '',
  last_update: '',
};

const hasFormValue = (form) => Object.values(form).some((item) => Boolean(item));

function getLoggedInTp(id) {
  const result = getSessionItem('LoggedInTp');
  if (getSessionItem('LoggedInTp') === null) {
    setSessionItem('LoggedInTp', []);
    return false;
  } else {
    let arr = getSessionItem('LoggedInTp');
    if (arr.includes(id)) return true;
    else return false;
  }
}

const buttonContainer = {
  display: "flex",
  flexWrap:"wrap",
  gap: 1,
  alignItems: "flex-start",
  flexDirection:"row"
}

function getIsCompleted(state) {
  if (state === 2 || state === 6 || state === 10) return false;
  return true;
}

const FCS_Tp_edit = ({
  l,
  setChangeSeqPointTp,
  onClose,
  setPointInfo,
  pointInfoFCS,
  dataFcs,
  markers,
  setMarkersTp,
  loadMarkersTp,
  setConnectionsPoint,
  setSpliceFibersPointTp,
  setPicturesInfo,
  setPortLabels,
}) => {
  const [loggedIn, setLoggedIn] = useState(getLoggedInTp(pointInfoFCS.id));
  const [isChange, setIsChange] = useState(false);
  const [isCompleted, setIsCompleted] = useState(getIsCompleted(pointInfoFCS.state));
  const [stateOptions, setStateOptions] = useState([]);
  const [connectorOptions, setConnectorOptions] = useState([]);
  const [capacityOptions, setCapacityOptions] = useState([]);
  const [form, setForm] = useState({
    name_id: pointInfoFCS.name_id,
    owner: pointInfoFCS.owner,
    address: pointInfoFCS.address,
    mfg: pointInfoFCS.mfg,
    model: pointInfoFCS.model,
    capacity: pointInfoFCS.capacity,
    connector: pointInfoFCS.connector,
    access: pointInfoFCS.access,
    state: pointInfoFCS.state,
    position: pointInfoFCS.position,
    icon: pointInfoFCS.icon,
    birthday: pointInfoFCS.birthday,
    last_update: pointInfoFCS.last_update,
  });

  useEffect(() => {
    setStateOptions([
      { label: l.Placed_Hub, id: 0, value: 0 },
      { label: l.Connected_Hub, id: 1, value: 1 },
      { label: l.Assigned_Hub, id: 2, value: 2 },
      { label: l.Ready_Hub, id: 3, value: 3 },
      { label: l.Placed_Node, id: 4, value: 4 },
      { label: l.Connected_Node, id: 5, value: 5 },
      { label: l.Assigned_Node, id: 6, value: 6 },
      { label: l.Ready_Node, id: 7, value: 7 },
      { label: l.Placed_Terminal, id: 8, value: 8 },
      { label: l.Connected_Terminal, id: 9, value: 9 },
      { label: l.Assigned_Terminal, id: 10, value: 10 },
      { label: l.Ready_Terminal, id: 11, value: 11 },
    ]);
    setConnectorOptions([
      { label: 'SC/APC', id: 0, value: 'SC/APC' },
      { label: 'SC/UPC', id: 1, value: 'SC/UPC' },
      { label: 'LC/APC', id: 2, value: 'LC/APC' },
      { label: 'LC/UPC', id: 2, value: 'LC/UPC' },
      { label: 'FC/APC', id: 2, value: 'FC/APC' },
      { label: 'FC/UPC', id: 2, value: 'FC/UPC' },
      { label: 'E2000', id: 2, value: 'E2000' },
      { label: 'Mixed', id: 2, value: 'Mixed' },
    ]);
    setCapacityOptions([
      { label: '2 '+ l.ports, id: 0, value: 2 },
      { label: '4 '+ l.ports, id: 1, value: 4 },
      { label: '6 '+ l.ports, id: 2, value: 6 },
      { label: '12 '+ l.ports, id: 3, value: 12 },
      { label: '24 '+ l.ports, id: 4, value: 24 },
      { label: '36 '+ l.ports, id: 5, value: 36 },
      { label: '48 '+ l.ports, id: 6, value: 48 },
      { label: '60 '+ l.ports, id: 7, value: 60 },
      { label: '72 '+ l.ports, id: 8, value: 72 },
      { label: '96 '+ l.ports, id: 9, value: 96 },
      { label: '144 '+ l.ports, id: 10, value: 144 },
      { label: '288 '+ l.ports, id: 11, value: 288 },
      { label: '432 '+ l.ports, id: 12, value: 432 },
      { label: '864 '+ l.ports, id: 13, value: 864 },
    ]);
  }, []);

  useEffect(() => {
    setForm((prevState) => ({
      ...prevState,
      ['state']: pointInfoFCS.state,
    }));
  }, [pointInfoFCS.state]);

  function OnClickLogin() {
    setLoggedIn(true);
    let lArr = getSessionItem('LoggedInTp');
    lArr.push(pointInfoFCS.id);
    setSessionItem('LoggedInTp', lArr);
    logAddInfo(pointInfoFCS.name_id, l.login, '-');
  }
  function OnClickLogout() {
    setLoggedIn(false);
    let lArr = getSessionItem('LoggedInTp');
    const filteredArr = lArr.filter((itemId) => itemId !== pointInfoFCS.id);
    setSessionItem('LoggedInTp', filteredArr);
    logAddInfo(pointInfoFCS.name_id, l.logout, '-');
  }

  async function OnClickComplete() {
    setIsCompleted(true);
    if (pointInfoFCS.state === 2) {
      await changeItemState(pointInfoFCS.id, pointInfoFCS.name_id, 'tp', 3);
      const markerIndex = markers.findIndex((marker) => marker.id === pointInfoFCS.id);
      const cloneMarkers = markers.slice();
      const changedMarker = { ...markers[markerIndex], state: 3 };
      cloneMarkers.splice(markerIndex, 1, changedMarker);
      loadMarkersTp();
    }
    if (pointInfoFCS.state === 6) {
      await changeItemState(pointInfoFCS.id, pointInfoFCS.name_id, 'tp', 3);
      const markerIndex = markers.findIndex((marker) => marker.id === pointInfoFCS.id);
      const cloneMarkers = markers.slice();
      const changedMarker = { ...markers[markerIndex], state: 7 };
      cloneMarkers.splice(markerIndex, 1, changedMarker);
      loadMarkersTp();
    }
    if (pointInfoFCS.state === 10) {
      await changeItemState(pointInfoFCS.id, pointInfoFCS.name_id, 'tp', 3);
      const markerIndex = markers.findIndex((marker) => marker.id === pointInfoFCS.id);
      const cloneMarkers = markers.slice();
      const changedMarker = { ...markers[markerIndex], state: 11 };
      cloneMarkers.splice(markerIndex, 1, changedMarker);
      loadMarkersTp();
    }
    logAddInfo(form.name_id, l.completed, l.state_changed_to_completed);
  }

  function OnClickComments(pointInfo) {
    setPointInfo(pointInfo);
  }

  function OnClickConnections(item) {
    setConnectionsPoint(item);
  }

  function OnClickSpliceFibers(item) {
    setSpliceFibersPointTp(item);
  }

  function OnClickPictures() {
    setPicturesInfo(pointInfoFCS);
  }

  function OnClickPortLabels() {
    setPortLabels(pointInfoFCS);
  }
  function OnClickSeq() {
    setChangeSeqPointTp(pointInfoFCS);
  }

  const onChange = ({ name, value }) => {
    setIsChange(true);
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [full, setFull] = useState(true);

  function fullShort() {
    if (full) setFull(false);
    else setFull(true);
  }

  async function saveChanges() {
    const item = {
      id: pointInfoFCS.id,
      name_id: form.name_id,
      owner: form.owner,
      address: form.address,
      mfg: form.mfg,
      model: form.model,
      capacity: form.capacity,
      connector: form.connector,
      access: form.access,
      state: form.state,
      position: pointInfoFCS.position,
      icon: pointInfoFCS.icon,
      birthday: pointInfoFCS.birthday,
      last_update: pointInfoFCS.last_update,
    };
    await updateTpItem(item);

    let markersClone = markers.slice();
    for (let i = 0; i < markersClone.length; i++) {
      if (markersClone[i].id === item.id) {
        markersClone[i] = item;
        break;
      }
    }
    logAddInfo(form.name_id, l.Changes_Saved, '');
    setMarkersTp(markersClone);
    setIsChange(false);
  }

  function keyGen() {
    let number = Math.random();
    return number;
  }

  const userAccessLevel = getSessionItem('user').access_level;

  const { headerKeys, bodyKeys, bodyFullKeys } = useTableKeyGen({ tableData: dataFcs })

  return (
    <ModalWithTitle title={form.name_id} containerSx={{ width: '50%' }} close={onClose} open>
      <Box component="form" display="flex" gap={1} alignItems="flex-start" flexDirection="column">
        <Box sx={buttonContainer}>
          <CustomButton onClick={fullShort}>{l.Full_Short}</CustomButton>
          {userAccessLevel >= 70 &&<CustomButton disabled={!isChange} onClick={saveChanges}>
            {l.Save_changes}
          </CustomButton>}
          {userAccessLevel >= 70 &&<CustomButton disabled={loggedIn} onClick={() => OnClickLogin()}>
            {l.Login}
          </CustomButton>}
          {userAccessLevel >= 70 &&<CustomButton disabled={!loggedIn} onClick={() => OnClickLogout()}>
            {l.Logout}
          </CustomButton>}
          {userAccessLevel >= 79 &&<CustomButton onClick={() => OnClickSpliceFibers(pointInfoFCS)}>{l.Splice_Fibers}</CustomButton>}
        </Box>
        <Box sx={buttonContainer}>
          {userAccessLevel >= 79 &&<CustomButton onClick={() => OnClickConnections(pointInfoFCS)}>{l.Connections}</CustomButton>}
          {userAccessLevel >= 60 &&<CustomButton onClick={() => OnClickComments(pointInfoFCS)}>{l.Comments}</CustomButton>}
          {userAccessLevel >= 70 &&<CustomButton disabled={isCompleted} onClick={() => OnClickComplete()}>
            {l.Mark_as_Complete}
          </CustomButton>}
          {userAccessLevel >= 60 &&<CustomButton onClick={() => OnClickPictures()}>{l.Pictures}</CustomButton>}
          {userAccessLevel >= 70 &&<CustomButton onClick={() => OnClickPortLabels()}>{l.Port_Labels}</CustomButton>}
          {userAccessLevel >= 70 &&<CustomButton onClick={() => OnClickSeq()}>{l.Change_Sequential_Numbers}</CustomButton>}
        </Box>
        <Box sx={buttonContainer}>
          <CustomInput label={l.id} name="name_id" onChange={onChange} value={form.name_id} />
          <CustomInput label={l.Owner} name="owner" onChange={onChange} value={form.owner} />
          <CustomInput label={l.Address} name="address" onChange={onChange} value={form.address} />
        </Box>
        <Box sx={buttonContainer}>
          <CustomInput label={l.Manufacturer} name="mfg" onChange={onChange} value={form.mfg} />
          <CustomInput label={l.Model} name="model" onChange={onChange} value={form.model} />
          <CustomInput sx={{ width: '220px' }} select label={l.Connector} name="connector" onChange={onChange} value={form.connector}>
            {connectorOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>
        </Box>
        <Box sx={buttonContainer}>
          <CustomInput label={l.Access} name="access" onChange={onChange} value={form.access} />
          <CustomInput sx={{ width: '220px' }} select label={l.Capacity} name="capacity" onChange={onChange} value={form.capacity}>
            {capacityOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>

          <CustomInput sx={{ width: '220px' }} select label={l.State} name="state" onChange={onChange} value={form.state}>
            {stateOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>
        </Box>
        <Box sx={buttonContainer}>
          <CustomInput disabled label={l.Birthday} name="birthday" onChange={onChange} value={form.birthday.slice(0, 10)} />
          <CustomInput disabled label={l.Last_update} name="last_update" onChange={onChange} value={form.last_update.slice(0, 10)} />
          <CustomInput disabled label={l.Latitude} name="position" onChange={onChange} value={form.position[0]} />
          <CustomInput disabled label={l.Longitude} name="position" onChange={onChange} value={form.position[1]} />
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300 }} aria-label="customized table">
            <TableHead>
              {dataFcs.header.map((row, index) => (
                <StyledTableRow key={headerKeys[index].id}>
                  {row.map((cellHeader, rowIndex) => (
                    <StyledTableCell2 key={headerKeys[index].rows[rowIndex]} align="left">
                      {cellHeader}
                    </StyledTableCell2>
                  ))}
                </StyledTableRow>
              ))}
            </TableHead>
            {full && (
              <TableBody>
                {dataFcs.body.map((row, index) => (
                  <StyledTableRow key={bodyKeys[index].id}>
                    {row?.map?.((cellBody,rowIndex) => (
                      <StyledTableCell2 key={bodyKeys[index].rows[rowIndex]} align="left">
                        {cellBody}
                      </StyledTableCell2>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
            {!full && (
              <TableBody>
                {dataFcs.bodyFull.map((row, index) => (
                  <StyledTableRow key={bodyFullKeys[index].id}>
                    {row?.map?.((cellBody,rowIndex) => (
                      <StyledTableCell2 key={bodyFullKeys[index].rows[rowIndex]} align="left">
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

export default FCS_Tp_edit;
