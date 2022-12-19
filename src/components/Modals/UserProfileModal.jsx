import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import useApi from '../../hooks/useApi';
import ModalWithTitle from './ModalWithTitle';
import CustomInput from '../Inputs';
import CustomButton from '../Button';
import { getSessionItem, setSessionItem } from '../../helpers/storage';
import { changeProjectOptions } from '../../api/projectOptionsApi';

const UserProfileModal= ({ l, onClose }) => {


function handleSubmit(){
  onClose();
}

//


  return (
    <ModalWithTitle title={l.User_Profile} containerSx={{ width: 350 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column" onSubmit={handleSubmit}>
        {/*<CustomInput type="number" sx={{ width: '300px' }} label={l.Coefficient_OTDR_distance_real_distance} name="coef" onChange={onChangeCoefficient} value={coefficient} />*/}
        {/*<CustomInput type="number" sx={{ width: '300px' }} label={l.Attenuation_1310nm} name="att1310" onChange={onChangeAtt1310} value={att1310} />*/}
        {/*<CustomInput type="number" sx={{ width: '300px' }} label={l.Attenuation_1550nm} name="att1550" onChange={onChangeAtt1550} value={att1550} />*/}
        {/*<CustomInput type="number" sx={{ width: '300px' }} label={l.Splice_Loss} name="splL" onChange={onChangeSpliceLoss} value={spliceLoss} />*/}
        {/*<CustomInput type="number" sx={{ width: '300px' }} label={l.Connector_Loss}  name="conL" onChange={onChangeConnectorLoss} value={connectorLoss} />*/}
        <CustomButton type="submit">
          {/*isLoading={isLoading}*/}
          {l.Accept}
        </CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default UserProfileModal;
