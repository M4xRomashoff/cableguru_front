import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import useApi from '../../hooks/useApi';
import ModalWithTitle from './ModalWithTitle';
import CustomInput from '../Inputs';
import CustomButton from '../Button';
import { getSessionItem, setSessionItem } from '../../helpers/storage';
import { changeProjectOptions } from '../../api/projectOptionsApi';

const SettingsModal = ({ l, onClose }) => {
  const [coefficient, setCoefficient] = useState();
  const [att1310, setAtt1310] = useState();
  const [att1550, setAtt1550] = useState();
  const [spliceLoss, setSpliceLoss] = useState();
  const [connectorLoss, setConnectorLoss] = useState();

  function keyGen() {
    let number = Math.random();
    return number;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const options = {
      coefficient: coefficient,
      att1310: att1310,
      att1550: att1550,
      spliceLoss: spliceLoss,
      connectorLoss: connectorLoss,
    };

    setSessionItem('projectOptions', options);

    await changeProjectOptions(options);
    onClose();
  };

  const { makeRequest: createComment, isLoading } = useApi({
    request: handleSubmit,
  });

  useEffect(() => {
    const options = getSessionItem('projectOptions');
    setCoefficient(options?.coefficient);
    setAtt1310(options?.att1310);
    setAtt1550(options?.att1550);
    setSpliceLoss(options?.spliceLoss);
    setConnectorLoss(options?.connectorLoss);
  }, []);

  const onChangeCoefficient = ({ value }) => {
    setCoefficient(value);
  };
  const onChangeAtt1550 = ({ value }) => {
    setAtt1550(value);
  };
  const onChangeAtt1310 = ({ value }) => {
    setAtt1310(value);
  };
  const onChangeSpliceLoss = ({ value }) => {
    setSpliceLoss(value);
  };
  const onChangeConnectorLoss = ({ value }) => {
    setConnectorLoss(value);
  };

  return (
    <ModalWithTitle title={l.Settings} containerSx={{ width: 350 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column" onSubmit={handleSubmit}>
        <CustomInput type="number" sx={{ width: '300px' }} label={l.Coefficient_OTDR_distance_real_distance} name="coef" onChange={onChangeCoefficient} value={coefficient} />
        <CustomInput type="number" sx={{ width: '300px' }} label={l.Attenuation_1310nm} name="att1310" onChange={onChangeAtt1310} value={att1310} />
        <CustomInput type="number" sx={{ width: '300px' }} label={l.Attenuation_1550nm} name="att1550" onChange={onChangeAtt1550} value={att1550} />
        <CustomInput type="number" sx={{ width: '300px' }} label={l.Splice_Loss} name="splL" onChange={onChangeSpliceLoss} value={spliceLoss} />
        <CustomInput type="number" sx={{ width: '300px' }} label={l.Connector_Loss}  name="conL" onChange={onChangeConnectorLoss} value={connectorLoss} />
        <CustomButton type="submit">
          {/*isLoading={isLoading}*/}
          {l.Accept}
        </CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default SettingsModal;
