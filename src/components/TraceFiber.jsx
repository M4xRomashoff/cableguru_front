import React, { useState, useEffect } from 'react';
import './Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from './Modals/ModalWithTitle';
import CustomInput from './Inputs';
import CustomButton from './Button';
import MenuItem from '@mui/material/MenuItem';
import { getTrace } from '../api/dataBasesApi';

const TraceFiber = ({ l, onClose, markersTp, trace, setTrace }) => {
  const [tpValue, setTpValue] = useState('');
  const [portValue, setPortValue] = useState('');
  const [tpOptions, setTpOptions] = useState([]);
  const [portOptions, setPortOptions] = useState([]);

  function getTpSize(id) {
    let size = 0;
    for (let i = 0; i < markersTp.length; i++) {
      if (markersTp[i].id === id) size = markersTp[i].capacity;
    }
    return size;
  }

  useEffect(() => {
    const tempOptions = [];
    for (let i = 0; i < markersTp.length; i++) {
      const oneOption = { label: markersTp[i].name_id, id: markersTp[i].id, value: markersTp[i].id };
      tempOptions.push(oneOption);
    }
    setTpOptions(tempOptions);
  }, []);

  const onChangeTp = ({ value }) => {
    setTpValue(value);
    const size = getTpSize(value);
    const tempOptions = [];
    for (let i = 0; i < size; i++) {
      const oneOption = { label: 'port ' + (i + 1).toString(), id: i, value: 'port ' + (i + 1).toString() };
      tempOptions.push(oneOption);
    }
    setPortOptions(tempOptions);
  };
  const onChangePort = ({ value }) => setPortValue(value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tracesDb = await getTrace(tpValue, portValue);
    setTrace(tracesDb);
    onClose();
  };

  return (
    <ModalWithTitle title={l.Fiber_Route} containerSx={{ width: 400 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column" onSubmit={handleSubmit}>
        <CustomInput sx={{ width: '220px' }} select label={l.Termination_Point} name="tp" onChange={onChangeTp} value={tpValue}>
          {tpOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </CustomInput>
        <CustomInput sx={{ width: '220px' }} select label={l.Select_Port} name="port" onChange={onChangePort} value={portValue}>
          {portOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </CustomInput>
        <CustomButton type="submit">{l.View_Trace}</CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default TraceFiber;
