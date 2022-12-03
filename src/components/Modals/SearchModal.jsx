import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from './ModalWithTitle';
import CustomButton from '../Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { latLng } from 'leaflet';

const SearchModal = ({ onClose, markersSp, markersTp, map }) => {
  const [item, setItem] = useState();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let items = [];
    for (let i = 0; i < markersSp.length; i++) {
      items.push({ label: markersSp[i].name_id, spId: markersSp[i].id, position: markersSp[i].position });
    }
    for (let i = 0; i < markersTp.length; i++) {
      items.push({ label: markersTp[i].name_id, tpId: markersTp[i].id, position: markersTp[i].position });
    }
    setItems(items);
  }, []);

  function keyGen() {
    let number = Math.random();
    return number;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    map.flyTo(item?.position);
    onClose();
  };

  const onTagsChange = (event, values) => {
    setItem(values);
  };

  return (
    <ModalWithTitle title="Search" containerSx={{ width: 350, height: 400 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column" onSubmit={handleSubmit}>
        <Autocomplete disablePortal id="search" filterSelectedOptions options={items} sx={{ width: 300 }} onChange={onTagsChange} renderInput={(params) => <TextField {...params} label="Item" />} />
        <CustomButton type="submit">Search Item</CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default SearchModal;
