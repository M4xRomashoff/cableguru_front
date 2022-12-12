import React, { useEffect, useState } from 'react';
import './Home/Home.css';
import { Box } from '@mui/material';
import { logAddInfo } from '../api/logFileApi';
import useApi from '../hooks/useApi';
import ModalWithTitle from './Modals/ModalWithTitle';
import CustomInput from './Inputs';
import CustomButton from './Button';
import { updateSeqNumbers } from '../api/dataBasesApi';

function getCableListRaw(connections, id) {
  const cableList = [];
  connections.map((item) => {
    if (item?.tp_id === id) cableList.push(item);
  });
  return cableList;
}
function getCableList(l, cables, cableListRaw, header) {
  const cableList = [];
  let indexId = 0;
  cableListRaw.map((itemRaw, index) => {
    cables.map((itemCable) => {
      if (itemRaw.cab_id === itemCable.id) {
        if (itemRaw.ring.data[0] === 1) {
          let newItemL = {
            id: itemCable.id,
            size: itemCable.capacity,
            name_id: itemCable.name_id + ' ct:(' + itemCable.capacity.toString() + ') '+l.ring_low_side,
            type: 'low',
            indexId: (indexId += 1),
          };
          cableList.push(newItemL);
          let newItemH = {
            id: itemCable.id,
            size: itemCable.capacity,
            name_id: itemCable.name_id + ' ct:(' + itemCable.capacity.toString() + ') '+l.ring_high_side,
            type: 'high',
            indexId: (indexId += 1),
          };
          cableList.push(newItemH);
        } else {
          let newItem = {
            id: itemCable.id,
            size: itemCable.capacity,
            name_id: itemCable.name_id + ' ct:(' + itemCable.capacity.toString() + ') '+l.tail,
            type: 'tail',
            indexId: (indexId += 1),
          };
          cableList.push(newItem);
        }
      }
    });
  });

  cableList.map((item, index) => {
    item.name_id += header[3][index + 2];
    item['seq'] = header[6][index + 2].toString();
  });

  return cableList;
}

const ChangeSeqNumbersTp = ({l, dataFcs, changeSeqPoint, cables, getTpDataRequest, onClose, connections }) => {
  const [seq, setSeq] = useState({});
  const [cablesList, setCablesList] = useState([]);

  const title = l.Change_Sequential_Numbers;

  useEffect(() => {
    const cableListRaw = getCableListRaw(connections, changeSeqPoint.id);
    const cableList = getCableList(l, cables, cableListRaw, dataFcs.header);
    setCablesList(cableList);
  }, []);

  // const changeCable1 = ({ value }) => {
  //   setCable1(value);
  // };

  const onChange = ({ name, value }) => {
    let cloneCables = cablesList;
    cloneCables[parseInt(name)].seq = value.toString();
    setCablesList(cloneCables);
  };

  async function onSaveChanges() {
    const response = await logAddInfo(changeSeqPoint.name_id, l.Sequential_Numbers_Updated, '');
    const response2 = await updateSeqNumbers('tp', changeSeqPoint.id, cablesList);
    getTpDataRequest();
    onClose();
  }
  function keyGen() {
    let number = Math.random();
    return number;
  }
  return (
    <ModalWithTitle title={title} containerSx={{ width: 700 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column">
        <Box display="flex" gap={2} alignItems="flex-start" flexDirection="column">
          {cablesList.length > 0 &&
            cablesList.map((item, index) => (
              <Box display="flex" gap={2} alignItems="flex-start" flexDirection="row" key={keyGen()}>
                <CustomInput type="number" name={index.toString()} onChange={onChange} value={parseInt(item.seq)} sx={{ width: 100 }} key={keyGen()} />
                <label className="label4" key={keyGen()}>
                  {item.name_id}
                </label>
              </Box>
            ))}
        </Box>
        <CustomButton onClick={() => onSaveChanges()}> {l.Save_changes} </CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default ChangeSeqNumbersTp;
