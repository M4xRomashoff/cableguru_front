import React, { useState } from 'react';
import './Home/Home.css';
import { Box } from '@mui/material';
import { logAddInfo } from '../api/logFileApi';
import useApi from '../hooks/useApi';
import ModalWithTitle from './Modals/ModalWithTitle';
import CustomInput from './Inputs';
import CustomButton from './Button';
import { getCablePointsFromString } from '../helpers/getCablePointsFromString';

import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { updateConnectionsAdd, updateConnectionsRemove } from '../api/dataBasesApi';
import { changeItemState } from '../api/changeItemState';

const ConnectionsControl = ({ l, updateState, getTpDataRequest, getSpDataRequest, cables, connections, loadConnections, onClose, connectionsPoint, setConnectionsPoint }) => {
  const [checkedE, setCheckedE] = React.useState([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
  const [checked, setChecked] = React.useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
  let title = l.Connections +'  '+ connectionsPoint.name_id;
  let type = '';
  let state = connectionsPoint.state;
  if (!connectionsPoint.spl_type) type = 'tp'; // only sp has spl_type
  if (!connectionsPoint.connector) type = 'sp'; // only tp has connector

  function filterCon(exist, avail) {
    let match = false;
    let newArr = [];
    avail.map((item) => {
      exist.map((e_item) => {
        if (e_item.cabId === item.cabId) match = true;
      });
      if (!match) newArr.push(item);
      match = false;
    });
    return newArr;
  }

  function getCableDetails(id) {
    let result = [];
    cables.map((item) => {
      if (item.id === id) result = [item.name_id, item.capacity];
    });
    return result;
  }

  function prepareExistingConnections(type) {
    let fileredArr = [];
    if (type === 'sp') {
      connections.map((item) => {
        if (connectionsPoint.id === item.sp_id) {
          let con_type = 'tail';
          if (item.ring.data[0] === 1) con_type = 'ring';
          let [name_id, capacity] = getCableDetails(item.cab_id);
          let newItem = { cabId: item.cab_id, cabNameId: name_id, spTpId: connectionsPoint.id, pointIndex: item.point, conType: con_type, size: capacity, spTpType: 'sp' };
          fileredArr.push(newItem);
        }
      });
    }
    if (type === 'tp') {
      connections.map((item) => {
        if (connectionsPoint.id === item.tp_id) {
          let con_type = 'tail';
          if (item.ring.data[0] === 1) con_type = 'ring';
          let [name_id, capacity] = getCableDetails(item.cab_id);
          let newItem = { cabId: item.cab_id, cabNameId: name_id, spTpId: connectionsPoint.id, pointIndex: item.point, conType: con_type, size: capacity, spTpType: 'tp' };
          fileredArr.push(newItem);
        }
      });
    }
    return fileredArr;
  }
  function checkConnections(type, id, position, cables) {
    let con_type = '';
    let arrayOfConnections = [];
    if (type.type === 'sp') {
      cables.cables.map((item) => {
        let cablePoints = getCablePointsFromString(item.points);
        cablePoints.map((point, index) => {
          if (point.lat === parseFloat(position[0]) && point.lng === parseFloat(position[1])) {
            if (index === 0 || index === cablePoints.length - 1) con_type = 'tail';
            else con_type = 'ring';
            arrayOfConnections.push({ cabId: item.id, cabNameId: item.name_id, spTpId: id, pointIndex: index, conType: con_type, size: item.capacity, spTpType: 'sp' });
          }
        });
      });
    }
    if (type.type === 'tp') {
      cables.cables.map((item) => {
        let cablePoints = getCablePointsFromString(item.points);
        cablePoints.map((point, index) => {
          if (point.lat === parseFloat(position[0]) && point.lng === parseFloat(position[1])) {
            if (index === 0 || index === cablePoints.length - 1) con_type = 'tail';
            else con_type = 'ring';
            arrayOfConnections.push({ cabId: item.id, cabNameId: item.name_id, spTpId: id, pointIndex: index, conType: con_type, size: item.capacity, spTpType: 'tp' });
          }
        });
      });
    }
    return arrayOfConnections;
  }
  let existingCon = prepareExistingConnections(type);
  let availableCon = checkConnections((type = { type }), connectionsPoint.id, connectionsPoint.position, (cables = { cables }), connectionsPoint.name_id);
  let filteredAvailableCon = filterCon(existingCon, availableCon);

  const handleChange2 = (event, index) => {
    event.preventDefault();
    let newArr = checked.slice();
    newArr[index] = event.target.checked;
    setChecked(newArr);
  };

  const handleChange1 = (event, index) => {
    event.preventDefault();
    let newArr = checkedE.slice();
    newArr[index] = event.target.checked;
    setCheckedE(newArr);
  };

  async function saveChanges() {
    let newConnections = [];
    let existConnections = [];

    filteredAvailableCon.map((item, index) => {
      if (checked[index] === true) newConnections.push(item);
    });
    existingCon.map((item, index) => {
      if (checkedE[index] === false) existConnections.push(item);
    });

    // todo make one request and send array of objects
    // EXAMPLE updateConnectionsAdd(newConnections)
    if (state === 0 || state === 2 || state === 3) state = 1;
    if (state === 4 || state === 6 || state === 7) state = 5;
    if (state === 8 || state === 10 || state === 11) state = 9;

    updateState(type.type, connectionsPoint.id, state);
    const itemUpdate = changeItemState(connectionsPoint.id, connectionsPoint.name_id, type.type, state);

    const promisesAdd = newConnections.map((item) => updateConnectionsAdd(item));
    const promisesRemove = existConnections.map((item) => updateConnectionsRemove(item));
    await Promise.all([...promisesAdd, ...promisesRemove, itemUpdate]);

    if (type.type === 'tp') getTpDataRequest(); // only sp has spl_type
    if (type.type === 'sp') getSpDataRequest(); // only tp has connector

    let connected = [];
    let disconnected = [];
    newConnections.map((item) => {
      connected.push(item.cabNameId);
    });
    existConnections.map((item) => {
      disconnected.push(item.cabNameId);
    });

    if (connected.length > 0) {
      const res = await logAddInfo(connectionsPoint.name_id, l.Cable_Connected , connected);
    }
    if (disconnected.length > 0) {
      const res = await logAddInfo(connectionsPoint.name_id, l.Cable_Disconnected, disconnected);
    }

    loadConnections();
    setConnectionsPoint({});
  }
  return (
    <ModalWithTitle title={title} containerSx={{ width: 400 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column">
        <label>{l.Existing_connections}</label>
        <FormGroup>
          {existingCon.map((item, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={checkedE[index]}
                  onChange={(event) => {
                    handleChange1(event, index);
                  }}
                />
              }
              label={item.cabNameId + ' ' + item.size + '   ' + item.conType}
            />
          ))}
        </FormGroup>
        <label>{l.Available_to_connect}</label>
        <FormGroup>
          {filteredAvailableCon.map((item, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={checked[index]}
                  onChange={(event) => {
                    handleChange2(event, index);
                  }}
                />
              }
              label={item.cabNameId + ' ' + item.size + '   ' + item.conType}
            />
          ))}
        </FormGroup>
        <CustomButton onClick={saveChanges}> {l.Save_changes} </CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default ConnectionsControl;
