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
import { updateSpItem } from '../../api/dataBasesApi';
import Input_item from './CustomInputM';
import { changeItemState } from '../../api/changeItemState';
import { logAddInfo } from '../../api/logFileApi';
import { getSessionItem, setSessionItem } from '../../helpers/storage';
import CustomInput from '../Inputs';
import { getCablePointsFromString } from '../../helpers/getCablePointsFromString';
import Selector from '../Inputs/Selector';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

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
  spl_type: '',
  mount: '',
  state: '',
  position: '',
  icon: '',
  birthday: '',
  last_update: '',
};

const hasFormValue = (form) => Object.values(form).some((item) => Boolean(item));

function getLoggedInSp(id) {
  const result = getSessionItem('LoggedInSp');
  if (getSessionItem('LoggedInSp') === null) {
    setSessionItem('LoggedInSp', []);
    return false;
  } else {
    let arr = getSessionItem('LoggedInSp');
    if (arr.includes(id)) return true;
    else return false;
  }
}

function getIsCompleted(state) {
  if (state === 2) return false;
  return true;
}

const FCS_edit = ({ setChangeSeqPoint, setSpliceFibersPoint, onClose, setPointInfo, pointInfoFCS, dataFcs, markers, setMarkersSp, loadMarkersSp, setConnectionsPoint, setPicturesInfo }) => {
  const [loggedIn, setLoggedIn] = useState(getLoggedInSp(pointInfoFCS.id));
  const [isChange, setIsChange] = useState(false);
  const [isCompleted, setIsCompleted] = useState(getIsCompleted(pointInfoFCS.state));
  const [stateOptions, setStateOptions] = useState([]);
  const [mountOptions, setMountOptions] = useState([]);
  const [splOptions, setSplOptions] = useState([]);
  const [capacityOptions, setCapacityOptions] = useState([]);
  const [form, setForm] = useState({
    name_id: pointInfoFCS.name_id,
    owner: pointInfoFCS.owner,
    address: pointInfoFCS.address,
    mfg: pointInfoFCS.mfg,
    model: pointInfoFCS.model,
    capacity: pointInfoFCS.capacity,
    spl_type: pointInfoFCS.spl_type,
    mount: pointInfoFCS.mount,
    state: pointInfoFCS.state,
    position: pointInfoFCS.position,
    icon: pointInfoFCS.icon,
    birthday: pointInfoFCS.birthday,
    last_update: pointInfoFCS.last_update,
  });

  useEffect(() => {
    setStateOptions([
      { label: '0-designed', id: 0, value: 0 },
      { label: '1-connected', id: 1, value: 1 },
      { label: '2-assigned', id: 2, value: 2 },
      { label: '3-spliced', id: 3, value: 3 },
    ]);
    setMountOptions([
      { label: 'Manhole (MH)', id: 0, value: 'Manhole (MH)' },
      { label: 'Handhole (HH)', id: 1, value: 'Handhole (HH)' },
      { label: 'Vault', id: 2, value: 'Vault' },
      { label: 'Aerial Strand', id: 3, value: 'Aerial Strand' },
      { label: 'Aerial Pole', id: 4, value: 'Aerial Pole' },
      { label: 'Wallmount', id: 5, value: 'Wallmount' },
      { label: 'Other', id: 6, value: 'Other' },
    ]);
    setSplOptions([
      { label: 'Single', id: 0, value: 'Single' },
      { label: 'Ribbon', id: 1, value: 'Ribbon' },
      { label: 'Mixed', id: 2, value: 'Mixed' },
    ]);
    setCapacityOptions([
      { label: '2 cables', id: 0, value: 0 },
      { label: '3 cables', id: 1, value: 1 },
      { label: '4 cables', id: 2, value: 2 },
      { label: '5 cables', id: 3, value: 3 },
      { label: '6 cables', id: 4, value: 4 },
      { label: '7 cables', id: 5, value: 5 },
      { label: '8 cables', id: 6, value: 6 },
      { label: '9 cables', id: 7, value: 7 },
      { label: '10 cables', id: 8, value: 8 },
      { label: ' > 10 cables', id: 9, value: 9 },
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
    let lArr = getSessionItem('LoggedInSp');
    lArr.push(pointInfoFCS.id);
    setSessionItem('LoggedInSp', lArr);
    logAddInfo(pointInfoFCS.name_id, 'login', '-');
  }
  function OnClickLogout() {
    setLoggedIn(false);
    let lArr = getSessionItem('LoggedInSp');
    const filteredArr = lArr.filter((itemId) => itemId !== pointInfoFCS.id);
    setSessionItem('LoggedInSp', filteredArr);
    logAddInfo(pointInfoFCS.name_id, 'logout', '-');
  }

  async function OnClickComplete() {
    setIsCompleted(true);
    await changeItemState(pointInfoFCS.id, pointInfoFCS.name_id, 'sp', 3);
    const markerIndex = markers.findIndex((marker) => marker.id === pointInfoFCS.id);
    const cloneMarkers = markers.slice();
    const changedMarker = { ...markers[markerIndex], state: 3 };
    cloneMarkers.splice(markerIndex, 1, changedMarker);
    loadMarkersSp();
    await logAddInfo(pointInfoFCS.name_id, 'completed', 'state changed to completed');
  }
  function OnClickComments(pointInfo) {
    setPointInfo(pointInfo);
  }
  function OnClickConnections(item) {
    setConnectionsPoint(item);
  }
  function OnClickSpliceFibers(item) {
    setSpliceFibersPoint(item);
  }
  function OnClickPictures() {
    setPicturesInfo(pointInfoFCS);
  }
  function OnClickSeq() {
    setChangeSeqPoint(pointInfoFCS);
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
  function updateMarkers(item) {
    const markerIndex = markers.findIndex((marker) => marker.id === item.id);
    const cloneMarkers = markers.slice();
    const changedMarker = {
      ...markers[markerIndex],
      state: item.state,
      name_id: item.name_id,
      owner: item.owner,
      address: item.address,
      capacity: item.capacity,
      mfg: item.mfg,
      model: item.model,
      mount: item.mount,
      spl_type: item.spl_type,
    };
    cloneMarkers.splice(markerIndex, 1, changedMarker);
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
      spl_type: form.spl_type,
      mount: form.mount,
      state: form.state,
      position: pointInfoFCS.position,
      icon: pointInfoFCS.icon,
      birthday: pointInfoFCS.birthday,
      last_update: pointInfoFCS.last_update,
    };
    await updateSpItem(item);
    let markersClone = markers.slice();
    for (let i = 0; i < markersClone.length; i++) {
      if (markersClone[i].id === item.id) {
        markersClone[i] = item;
        break;
      }
    }
    logAddInfo(form.name_id, 'Changes Saved', '');
    setMarkersSp(markersClone);
    setIsChange(false);
  }

  function keyGen() {
    let number = Math.random();
    return number;
  }

  return (
    <ModalWithTitle title={'Edit: ' + form.name_id} containerSx={{ width: '50%' }} close={onClose} open>
      <Box component="form" display="flex" gap={1} alignItems="flex-start" flexDirection="column">
        <Box display="flex" gap={1} alignItems="flex-start" flexDirection="row">
          <CustomButton onClick={fullShort}> Full / Short</CustomButton>
          <CustomButton disabled={!isChange} onClick={() => saveChanges()}>
            Save changes
          </CustomButton>
          <CustomButton disabled={loggedIn} onClick={() => OnClickLogin()}>
            Login
          </CustomButton>
          <CustomButton disabled={!loggedIn} onClick={() => OnClickLogout()}>
            Logout
          </CustomButton>
          <CustomButton onClick={() => OnClickSpliceFibers(pointInfoFCS)}>Splice Fibers</CustomButton>
        </Box>
        <Box display="flex" gap={1} alignItems="flex-start" flexDirection="row">
          <CustomButton onClick={() => OnClickConnections(pointInfoFCS)}>Connections</CustomButton>
          <CustomButton onClick={() => OnClickComments(pointInfoFCS)}>Comments</CustomButton>
          <CustomButton disabled={isCompleted} onClick={() => OnClickComplete()}>
            Mark as Complete
          </CustomButton>
          <CustomButton onClick={() => OnClickPictures()}>Pictures</CustomButton>
          <CustomButton onClick={() => OnClickSeq()}>Change Sequential Numbers</CustomButton>
        </Box>
        <Box display="flex" gap={1} alignItems="flex-start" flexDirection="row">
          <CustomInput label="ID" name="name_id" onChange={onChange} value={form.name_id} />
          <CustomInput label="Owner" name="owner" onChange={onChange} value={form.owner} />
          <CustomInput label="Address" name="address" onChange={onChange} value={form.address} />
        </Box>
        <Box display="flex" gap={1} alignItems="flex-start" flexDirection="row">
          <CustomInput label="Manufacturer" name="mfg" onChange={onChange} value={form.mfg} />
          <CustomInput label="Model" name="model" onChange={onChange} value={form.model} />
          <CustomInput sx={{ width: '220px' }} select label="Capacity" name="capacity" onChange={onChange} value={form.capacity}>
            {capacityOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>
        </Box>
        <Box display="flex" gap={1} alignItems="flex-start" flexDirection="row">
          <CustomInput sx={{ width: '220px' }} select label="Splice type" name="spl_type" onChange={onChange} value={form.spl_type}>
            {splOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>
          <CustomInput sx={{ width: '220px' }} select label="Mount" name="mount" onChange={onChange} value={form.mount}>
            {mountOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>
          <CustomInput sx={{ width: '220px' }} select label="State" name="state" onChange={onChange} value={form.state}>
            {stateOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>
        </Box>
        <Box display="flex" gap={1} alignItems="flex-start" flexDirection="row">
          <CustomInput disabled label="Birthday" name="birthday" onChange={onChange} value={form.birthday.slice(0, 10)} />
          <CustomInput disabled label="Last update" name="last_update" onChange={onChange} value={form.last_update.slice(0, 10)} />
          <CustomInput disabled label="Latitude" name="position" onChange={onChange} value={form.position[0]} />
          <CustomInput disabled label="Longitude" name="position" onChange={onChange} value={form.position[1]} />
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300 }} aria-label="customized table">
            <TableHead>
              {dataFcs.header.map((row) => (
                <StyledTableRow key={keyGen()}>
                  {row.map((cellHeader) => (
                    <StyledTableCell2 key={keyGen()} align="left">
                      {cellHeader}
                    </StyledTableCell2>
                  ))}
                </StyledTableRow>
              ))}
            </TableHead>
            {full && (
              <TableBody>
                {dataFcs.body.map((row) => (
                  <StyledTableRow key={keyGen()}>
                    {row?.map?.((cellBody) => (
                      <StyledTableCell2 key={keyGen()} align="left">
                        {cellBody}
                      </StyledTableCell2>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
            {!full && (
              <TableBody>
                {dataFcs.bodyFull.map((row) => (
                  <StyledTableRow key={keyGen()}>
                    {row?.map?.((cellBody) => (
                      <StyledTableCell2 key={keyGen()} align="left">
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

export default FCS_edit;
