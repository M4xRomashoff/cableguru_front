import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from './ModalWithTitle';
import CustomButton from '../Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { latLng } from 'leaflet';

const ContactUs = ({ l, onClose }) => {


  function onCLick(){
    window.location.href='mailto:cableguru@yandex.ru';
  }

  return (
    <ModalWithTitle title={l.Contact_Us} containerSx={{ width: 400, height: 200 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column" >
        <label>cableguru@yandex.ru</label>
        <CustomButton onClick={() => onCLick()}> {l.EmailUs}</CustomButton>

      </Box>
    </ModalWithTitle>
  );
};

export default ContactUs;
