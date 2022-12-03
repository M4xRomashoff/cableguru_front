import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from './ModalWithTitle';
import CustomButton from '../Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './MyDocument';
import useApi from '../../hooks/useApi';
import { getSpData, getTpData } from '../../api/dataBasesApi';
import BackdropLoading from '../BackdropLoading';

function getTp(id, markersTp) {
  let tp = {};
  for (let i = 0; i < markersTp.length; i++) {
    if (markersTp[i].id === id) {
      tp = markersTp[i];
      break;
    }
  }
  return tp;
}

function getSp(id, markersSp) {
  let sp = {};
  for (let i = 0; i < markersSp.length; i++) {
    if (markersSp[i].id === id) {
      sp = markersSp[i];
      break;
    }
  }
  return sp;
}

const PrintModal = ({ onClose, markersSp, markersTp }) => {
  const [stuffToPrint, setStuffToPrint] = useState();
  const [itemSp, setItemSp] = useState({});
  const [itemTp, setItemTp] = useState({});
  const [items, setItems] = useState([]);
  const [spliceData, setSpliceData] = useState([]);

  const { isLoading: isSpLoading } = useApi({
    request: () => getSpData(itemSp.id),
    setter: (data) => {
      setSpliceData(data);
    },
    shouldRequest: Boolean(itemSp.id),
  });

  const { isLoadingTp: isTpLoading } = useApi({
    request: () => getTpData(itemTp.id),
    setter: (data) => {
      setSpliceData(data);
    },
    shouldRequest: Boolean(itemTp.id),
  });

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

  function onTagsChange(event, values) {
    let dataToPrintHeader = {};
    if (values.tpId) {
      setItemTp({ id: values.tpId, itemType: 'tp' });
      const tp = getTp(values.tpId, markersTp);
      dataToPrintHeader = {
        id: tp.name_id,
        mfg: tp.mfg,
        model: tp.model,
        capacity: tp.capacity,
        connector: tp.connector,
        owner: tp.owner,
        address: tp.address,
        access: tp.access,
        latitude: tp.position[0].slice(0, 8),
        longitude: tp.position[1].slice(0, 8),
        birthday: tp.birthday.slice(0, 10),
      };
    }
    if (values.spId) {
      setItemSp({ id: values.spId, itemType: 'sp' });
      const sp = getSp(values.spId, markersSp);
      dataToPrintHeader = {
        id: sp.name_id,
        mfg: sp.mfg,
        model: sp.model,
        capacity: sp.capacity,
        spl_type: sp.spl_type,
        owner: sp.owner,
        address: sp.address,
        mount: sp.mount,
        latitude: sp.position[0].slice(0, 8),
        longitude: sp.position[1].slice(0, 8),
        birthday: sp.birthday.slice(0, 10),
      };
    }

    setStuffToPrint(dataToPrintHeader);
  }

  return (
    <ModalWithTitle title="Print" containerSx={{ width: 900, height: 800 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column">
        <Box display="flex" gap={2} alignItems="flex-start" flexDirection="row">
          <Autocomplete disablePortal id="search" filterSelectedOptions options={items} sx={{ width: 300 }} onChange={onTagsChange} renderInput={(params) => <TextField {...params} label="Item" />} />
        </Box>
        <BackdropLoading isLoading={isSpLoading || isTpLoading} />
        {stuffToPrint && Boolean(spliceData.header) && (
          <PDFViewer width={850} height={620}>
            <MyDocument item={stuffToPrint} spliceData={spliceData} />
          </PDFViewer>
        )}
      </Box>
    </ModalWithTitle>
  );
};

export default PrintModal;
//
