import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from './ModalWithTitle';
import useApi from '../../hooks/useApi';
import { getTpPortData, saveTpPortData } from '../../api/dataBasesApi';
import CustomInput from '../Inputs';
import CustomButton from '../Button';
import { logAddInfo } from '../../api/logFileApi';

const PortLabelsModal = ({ l, onClose, portLabels, getTpDataRequest }) => {
  const [labels, setLabels] = useState([]);

  const { isLoadingTp: isTpLoading } = useApi({
    request: () => getTpPortData(portLabels.id),
    setter: (data) => {
      setLabels(data);
    },
    shouldRequest: Boolean(portLabels.id),
  });

  function keyGen() {
    let number = Math.random();
    return number;
  }

  useEffect(() => {}, []);

  const onChange = ({ name, value }) => {
    let cloneLabels = labels;
    cloneLabels[parseInt(name)].ports = value;
    setLabels(cloneLabels);
  };

  function onSaveChanges() {
    const response = saveTpPortData(portLabels.id, labels);
    logAddInfo(portLabels.name_id, l.port_labels_changed, '');
    getTpDataRequest();
    onClose();
  }
  return (
    <ModalWithTitle title={l.Port_Labels_for + portLabels.name_id} containerSx={{ width: 400, height: 400 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column">
        <CustomButton onClick={onSaveChanges}>{l.Save_changes}</CustomButton>
        <Box display="flex" gap={2} alignItems="flex-start" flexDirection="column">
          {labels.map((item, index) => (
            <Box display="flex" gap={2} alignItems="flex-start" flexDirection="row">
              <label>{index + 1}</label>
              <CustomInput name={index.toString()} onChange={onChange} value={item.ports} />
            </Box>
          ))}
        </Box>
      </Box>
    </ModalWithTitle>
  );
};

export default PortLabelsModal;
