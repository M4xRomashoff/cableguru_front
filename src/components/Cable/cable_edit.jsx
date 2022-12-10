import React, { useState, useRef, useEffect } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from '../Modals/ModalWithTitle';
import CustomButton from '../Button';
import { updateCableItem, getFewSp, getFewTp, getFewCab } from '../../api/dataBasesApi';

import CustomInput from '../Inputs';
import { logAddInfo } from '../../api/logFileApi';
import { changeItemState } from '../../api/changeItemState';
import { getSessionItem, setSessionItem } from '../../helpers/storage';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const initialForm = {
  name_id: '',
  owner: '',
  mfg: '',
  model: '',
  capacity: '',
  f_type: '',
  p_type: '',
  c_type: '',
  state: '',
  points: '',
  birthday: '',
  last_update: '',
};

const hasFormValue = (form) => Object.values(form).some((item) => Boolean(item));

function getLoggedInCables(id) {
  const result = getSessionItem('LoggedInCables');
  if (getSessionItem('LoggedInCables') === null) {
    setSessionItem('LoggedInCables', []);
    return false;
  } else {
    let arr = getSessionItem('LoggedInCables');
    if (arr.includes(id)) return true;
    else return false;
  }
}

function getIsCompleted(state) {
  if (state === 0) return false;
  return true;
}

const Cable_edit = ({ l, setPointInfo, onClose, pointInfoCable, cables, loadCables, loadConnections, setCables }) => {
  const [loggedIn, setLoggedIn] = useState(getLoggedInCables(pointInfoCable.id));
  const [isChange, setIsChange] = useState(false);
  const [isCompleted, setIsCompleted] = useState(getIsCompleted(pointInfoCable.state));
  const [bDay, setBDay] = React.useState(dayjs(pointInfoCable.birthday));
  const [form, setForm] = useState({
    name_id: pointInfoCable.name_id,
    owner: pointInfoCable.owner,
    mfg: pointInfoCable.mfg,
    model: pointInfoCable.model,
    capacity: pointInfoCable.capacity,
    f_type: pointInfoCable.f_type,
    p_type: pointInfoCable.p_type,
    c_type: pointInfoCable.c_type,
    points: pointInfoCable.points,
    birthday: pointInfoCable.birthday,
    last_update: pointInfoCable.last_update,
    state: pointInfoCable.state,
  });
  const [stateOptions, setStateOptions] = useState([]);
  const [capacityOptions, setCapacityOptions] = useState([]);
  const [cTypeOptions, setCTypeOptions] = useState([]);
  const [pTypeOptions, setPTypeOptions] = useState([]);
  const [fTypeOptions, setFTypeOptions] = useState([]);

  useEffect(() => {
    setFTypeOptions([
      { label: 'SM', id: 0, value: 'SM' },
      { label: 'MetroCore', id: 1, value: 'MetroCore' },
      { label: 'MM', id: 1, value: 'MM' },
    ]);
    setPTypeOptions([
      { label: 'Ribbon Mono-tube Dry', id: 0, value: 'Ribbon Mono-tube Dry' },
      { label: 'Ribbon Multi-tube Dry', id: 1, value: 'Ribbon Multi-tube Dry' },
      { label: 'Ribbon Mono-tube Gel', id: 2, value: 'Ribbon Mono-tube Gel' },
      { label: 'Ribbon Multi-tube Gel', id: 3, value: 'Ribbon Multi-tube Gel' },
      { label: 'Single Buffer Tube Dry', id: 4, value: 'Single Buffer Tube Dry' },
      { label: 'Single Mono-tube Dry', id: 5, value: 'Single Mono-tube Dry' },
      { label: 'Single Buffer Tube Gel', id: 6, value: 'Single Buffer Tube Gel' },
      { label: 'Single Mono-tube Gel', id: 7, value: 'Single Mono-tube Gel' },
      { label: 'Microfiber Mono-tube', id: 8, value: 'Microfiber Mono-tube' },
      { label: 'Microfiber Buffer Tube ', id: 8, value: 'Microfiber Buffer Tube ' },
      { label: 'Microfiber Dry', id: 9, value: 'Microfiber Dry' },
    ]);
    setCTypeOptions([
      { label: l.U_Cable, id: 0, value: 'Ug Cable' },
      { label: l.Ug_Armored_Cable, id: 1, value: 'Ug Armored Cable' },
      { label: l.Arial_Cable, id: 2, value: 'Arial Cable' },
      { label: l.Self_Support_Cable, id: 3, value: 'Self-Support Cable' },
      { label: l.Sea_Grade_Cable, id: 4, value: 'Sea Grade Cable' },
      { label: l.Fire_Grade_Cable, id: 5, value: 'Fire Grade Cable' },
      { label: l.Drop_cable, id: 6, value: 'Drop cable' },
      { label: l.Inside_Plant_cable, id: 7, value: 'Inside Plant cable' },
    ]);
    setStateOptions([
      { label: l.Designed, id: 0, value: 0 },
      { label: l.Under_Construction, id: 1, value: 1 },
      { label: l.Placed, id: 2, value: 2 },
      { label: l.Active, id: 3, value: 3 },
      { label: l.Abandoned, id: 4, value: 4 },
    ]);
    setCapacityOptions([
      { label: '1 '+l.fibers, id: 0, value: 1 },
      { label: '2 '+l.fibers, id: 1, value: 2 },
      { label: '4 '+l.fibers, id: 2, value: 4 },
      { label: '6 '+l.fibers, id: 3, value: 6 },
      { label: '12 '+l.fibers, id: 4, value: 12 },
      { label: '24 '+l.fibers, id: 5, value: 24 },
      { label: '36 '+l.fibers, id: 6, value: 36 },
      { label: '48 '+l.fibers, id: 7, value: 48 },
      { label: '72 '+l.fibers, id: 8, value: 72 },
      { label: '96 '+l.fibers, id: 9, value: 96 },
      { label: '144 '+l.fibers, id: 10, value: 144 },
      { label: '216 '+l.fibers, id: 10, value: 216 },
      { label: '288 '+l.fibers, id: 11, value: 288 },
      { label: '432 '+l.fibers, id: 12, value: 432 },
      { label: '864 '+l.fibers, id: 13, value: 864 },
    ]);
  }, []);

  function OnClickLogin() {
    setLoggedIn(true);
    let lArr = getSessionItem('LoggedInCables');
    lArr.push(pointInfoCable.id);
    setSessionItem('LoggedInCables', lArr);
    logAddInfo(pointInfoCable.name_id, l.login, '-');
  }
  function OnClickLogout() {
    setLoggedIn(false);
    let lArr = getSessionItem('LoggedInCables');
    const filteredArr = lArr.filter((itemId) => itemId !== pointInfoCable.id);
    setSessionItem('LoggedInCables', filteredArr);
    logAddInfo(pointInfoCable.name_id, l.logout, '-');
  }

  async function OnClickComplete() {
    setIsCompleted(true);
    await changeItemState(pointInfoCable.id, form.name_id, 'cable', 2);
    const markerIndex = cables.findIndex((cable) => cable.id === pointInfoCable.id);
    const cloneMarkers = cables.slice();
    const changedMarker = { ...cables[markerIndex], state: 2 };
    cloneMarkers.splice(markerIndex, 1, changedMarker);
    loadCables();
    logAddInfo(form.name_id, l.completed, l.state_changed_to_completed);
  }
  function OnClickComments(pointInfo) {
    setPointInfo(pointInfo);
  }
  // function OnClickPictures(pointInfo) {
  // }

  const onChange = ({ name, value }) => {
    setIsChange(true);
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  async function saveChanges() {
    const item = {
      id: pointInfoCable.id,
      name_id: form.name_id,
      owner: form.owner,
      mfg: form.mfg,
      model: form.model,
      capacity: form.capacity,
      f_type: form.f_type,
      p_type: form.p_type,
      c_type: form.c_type,
      state: form.state,
      points: pointInfoCable.points,
      birthday: bDay,
      last_update: pointInfoCable.last_update,
    };
    const result = await updateCableItem(item);

    let cablesClone = cables.slice();
    for (let i = 0; i < cablesClone.length; i++) {
      if (cablesClone[i].id === item.id) {
        cablesClone[i] = item;
        break;
      }
    }
    setCables(cablesClone);
    setIsChange(false);
    logAddInfo(form.name_id, l.Changes_Saved, '');
    onClose();
  }

  function keyGen() {
    let number = Math.random();
    return number;
  }
  const userAccessLevel = getSessionItem('user').access_level;

  return (
    <ModalWithTitle title={form.name_id} containerSx={{ width: '50%' }} close={onClose} open>
      <Box component="form" display="flex" gap={1} alignItems="flex-start" flexDirection="column">
        <Box display="flex" gap={1} alignItems="flex-start" flexDirection="row">
          {userAccessLevel >= 60 &&<CustomButton disabled={!isChange} onClick={saveChanges}>
            {l.Save_changes}
          </CustomButton>}
          {userAccessLevel >= 60 &&<CustomButton disabled={loggedIn} onClick={() => OnClickLogin()}>
            {l.Login}
          </CustomButton>}
          {userAccessLevel >= 60 &&<CustomButton disabled={!loggedIn} onClick={() => OnClickLogout()}>
            {l.Logout}
          </CustomButton>}
          {userAccessLevel >= 60 &&<CustomButton onClick={() => OnClickComments(pointInfoCable)}>{l.Comments}</CustomButton>}
          {userAccessLevel >= 60 &&<CustomButton disabled={isCompleted} onClick={() => OnClickComplete()}>
            {l.Mark_as_Complete}
          </CustomButton>}
          {/*{userAccessLevel >= 60 &&<CustomButton onClick={() => OnClickPictures()}>{l.Pictures}</CustomButton>}*/}
        </Box>
        <Box display="flex" gap={1} alignItems="flex-start" flexDirection="row">
          <CustomInput label={l.id} name="name_id" onChange={onChange} value={form.name_id} />
          <CustomInput label={l.Manufacturer} name="mfg" onChange={onChange} value={form.mfg} />
          <CustomInput label={l.Model} name="model" onChange={onChange} value={form.model} />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
              <DatePicker
                views={['year', 'month']}
                label={l.Mfg_Year_Month}
                minDate={dayjs('2000-03-01')}
                maxDate={dayjs('2030-06-01')}
                value={bDay}
                onChange={(newValue) => {
                  setBDay(newValue);
                  setIsChange(true);
                }}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomInput ref={inputRef} {...inputProps} variant="filled" />
                    {InputProps?.endAdornment}
                  </Box>
                )}
              />
            </Stack>
          </LocalizationProvider>
        </Box>
        <Box display="flex" gap={1} alignItems="flex-start" flexDirection="row">
          <CustomInput sx={{ width: '220px' }} select label={l.Fiber_type} name="f_type" onChange={onChange} value={form.f_type}>
            {fTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>
          <CustomInput sx={{ width: '220px' }} select label={l.Packing_type} name="p_type" onChange={onChange} value={form.p_type}>
            {pTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>
          <CustomInput sx={{ width: '220px' }} select label={l.Cable_type} name="c_type" onChange={onChange} value={form.c_type}>
            {cTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>
          <CustomInput disabled label={l.Last_update} name="last_update" onChange={onChange} value={form.last_update.slice(0, 10)} />
        </Box>
        <Box display="flex" gap={1} alignItems="flex-start" flexDirection="row">
          <CustomInput sx={{ width: '220px' }} select label={l.Size} name="capacity" onChange={onChange} value={form.capacity}>
            {capacityOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>
          <CustomInput label={l.Owner} name="owner" onChange={onChange} value={form.owner} />
          <CustomInput sx={{ width: '220px' }} select label={l.State} name="state" onChange={onChange} value={form.state}>
            {stateOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInput>
        </Box>
      </Box>
    </ModalWithTitle>
  );
};

export default Cable_edit;
