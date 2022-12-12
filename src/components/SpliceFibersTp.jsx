import React, { useEffect, useState } from 'react';
import './Home/Home.css';
import { Box } from '@mui/material';
import { logAddInfo } from '../api/logFileApi';
import useApi from '../hooks/useApi';
import ModalWithTitle from './Modals/ModalWithTitle';
import CustomInput from './Inputs';
import CustomButton from './Button';
import { getCablePointsFromString } from '../helpers/getCablePointsFromString';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { updateConnectionsAdd, updateConnectionsRemove, updateSplicesTp } from '../api/dataBasesApi';
import Selector from './Inputs/Selector';
import ControlBox from './ControlBox';
import { changeItemState } from '../api/changeItemState';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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
  cableListRaw.map((itemRaw) => {
    cables.map((itemCable) => {
      if (itemRaw.cab_id === itemCable.id) {
        if (itemRaw.ring.data[0] === 1) {
          let newItemL = {
            id: itemCable.id,
            size: itemCable.capacity,
            name_id: itemCable.name_id + ' (' + itemCable.capacity.toString() + ') '+ l.ring_low_side,
            type: 'low',
          };
          cableList.push(newItemL);
          let newItemH = {
            id: itemCable.id,
            size: itemCable.capacity,
            name_id: itemCable.name_id + ' (' + itemCable.capacity.toString() + ') '+l.ring_high_side,
            type: 'high',
          };
          cableList.push(newItemH);
        } else {
          let newItem = {
            id: itemCable.id,
            size: itemCable.capacity,
            name_id: itemCable.name_id + ' (' + itemCable.capacity.toString() + ') '+l.tail,
            type: 'tail',
          };
          cableList.push(newItem);
        }
      }
    });
  });

  cableList.map((item, index) => {
    item.name_id += header[3][index + 2];
  });

  return cableList;
}
const SpliceFibersTp = ({ l, dataFcs, updateState, spliceFibersPointTp, cables, getTpDataRequest, onClose, connections }) => {
  const [cable1, setCable1] = useState({});
  const [cable2, setCable2] = useState({});
  const [cable1_Options, setCable1_Options] = useState([]);
  const [cable2_Options, setCable2_Options] = useState([]);
  const [startFiber1, setStartFiber1] = useState(1);
  const [startFiber2, setStartFiber2] = useState(1);
  const [endFiber1, setEndFiber1] = useState(1);
  const [endFiber2, setEndFiber2] = useState(1);
  const [numberOfFibers1, setNumberOfFibers1] = useState(1);
  const [numberOfFibers2, setNumberOfFibers2] = useState(1);
  const [cableSelected1, setCableSelected1] = useState(false);
  const [cableSelected2, setCableSelected2] = useState(false);
  const [label1, setLabel1] = useState(l.please_select_cable_above);
  const [label2, setLabel2] = useState(l.please_select_cable_above);
  const title = l.Splice_Fibers;

  useEffect(() => {
    let CableListItemPanel = {
      id: 0,
      size: spliceFibersPointTp.capacity,
      name_id: spliceFibersPointTp.name_id + ' ct:(' + spliceFibersPointTp.capacity.toString() + ') '+l.tail,
      type: 'ports',
    };
    const cableListRaw = getCableListRaw(connections, spliceFibersPointTp.id);
    const cableList = getCableList(l, cables, cableListRaw, dataFcs.header);
    cableList.unshift(CableListItemPanel);

    setCable1_Options(cableList);
    setCable2_Options(cableList);
    setStartFiber1(1);
    setStartFiber2(1);
    setEndFiber1(1);
    setEndFiber2(1);
    setNumberOfFibers1(1);
    setNumberOfFibers2(1);
  }, []);

  const changeCable1 = ({ value }) => {
    setCable1(value);
    setCableSelected1(true);
    setLabel1(l.Cable_size  + value.size.toString() +  l.fibers+'( ' + parseInt(startFiber1) + '-' + parseInt(endFiber1) + ')');
  };
  const changeCable2 = ({ value }) => {
    setCable2(value);
    setCableSelected2(true);
    setLabel2(l.Cable_size + value.size.toString() + l.fibers+'( ' + parseInt(startFiber2) + '-' + parseInt(endFiber2) + ')');
  };
  const onChangeStartFiber1 = ({ value }) => {
    let newEnd1 = parseInt(value) + parseInt(numberOfFibers1) - 1;
    setStartFiber1(value);
    setEndFiber1(newEnd1);
    setLabel1(l.Cable_size + cable1.size + l.fibers+'( ' + value + '-' + newEnd1.toString() + ' )');
  };
  const onChangeStartFiber2 = ({ value }) => {
    let newEnd2 = parseInt(value) + parseInt(numberOfFibers2) - 1;
    setStartFiber2(value);
    setEndFiber2(newEnd2);
    setLabel2(l.Cable_size+ cable2.size + l.fibers+'( ' + value + '-' + newEnd2.toString() + ' )');
  };
  const onChangeEndFiber1 = ({ value }) => {
    setEndFiber2(value);
  };
  const onChangeEndFiber2 = ({ value }) => {
    setEndFiber2(value);
  };
  const onChangeNumberOfFibers1 = ({ value }) => {
    let newEnd1 = parseInt(value) + parseInt(startFiber1) - 1;
    let newEnd2 = parseInt(value) + parseInt(startFiber2) - 1;
    setNumberOfFibers1(value);
    setNumberOfFibers2(value);
    setEndFiber1(newEnd1);
    setEndFiber2(newEnd2);
    setLabel1(l.Cable_size + cable1.size + l.fibers+'( ' + startFiber1 + '-' + newEnd1.toString() + ' )');
    setLabel2(l.Cable_size + cable2.size + l.fibers+'( ' + startFiber2 + '-' + newEnd2.toString() + ' )');
  };
  const onChangeNumberOfFibers2 = ({ value }) => {
    setNumberOfFibers2(value);
  };
  async function onSaveChanges() {
    if (cable1.size && cable2.size) {
      if (parseInt(endFiber1) <= cable1.size) {
        if (parseInt(endFiber2) <= cable2.size) {
          const data = {
            tpId: spliceFibersPointTp.id,
            cabId1: cable1.id,
            cabId2: cable2.id,
            conType1: cable1.type,
            conType2: cable2.type,
            fStart1: parseInt(startFiber1),
            fStart2: parseInt(startFiber2),
            fEnd1: parseInt(endFiber1),
            fEnd2: parseInt(endFiber2),
          };
          const res = await updateSplicesTp(data);
        } else alert(l.cable_2_fibers_exceeds);
      } else alert(l.cable_1_fibers_exceeds);
    } else alert(l.please_select_both);

    let state = spliceFibersPointTp.state;

    if (state === 0 || state === 1 || state === 3) state = 2;
    if (state === 4 || state === 5 || state === 7) state = 6;
    if (state === 8 || state === 9 || state === 11) state = 10;

    updateState('tp', spliceFibersPointTp.id, state);
    const itemUpdate = changeItemState(spliceFibersPointTp.id, spliceFibersPointTp.name_id, 'tp', state);
    const res = await logAddInfo(spliceFibersPointTp.name_id, l.Fiber_Assignment_Changed, l.State_changed_to);

    getTpDataRequest();
    onClose();
  }

  return (
    <ModalWithTitle title={title} containerSx={{ width: 700 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column">
        <Box display="flex" gap={2} alignItems="flex-start" flexDirection="row">
          <Selector
            key={getRandomInt(1000000)}
            sx={{ width: '300px' }}
            onChange={changeCable1}
            value={cable1}
            fields={{
              label: 'name_id',
              id: 'id',
              value: 'id',
            }}
            label={l.Select_cable}
            options={cable1_Options}
          />
          <Selector
            key={getRandomInt(1000000)}
            sx={{ width: '300px' }}
            onChange={changeCable2}
            value={cable2}
            fields={{
              label: 'name_id',
              id: 'id',
              value: 'id',
            }}
            label={l.Select_cable}
            options={cable1_Options}
          />
        </Box>
        <Box display="flex" gap={2} alignItems="flex-start" flexDirection="row">
          <TextField disabled={true} sx={{ width: '300px' }} size="small" value={label1} />
          <TextField disabled={true} sx={{ width: '300px' }} size="small" value={label2} />
        </Box>
        <Box display="flex" gap={2} alignItems="flex-start" flexDirection="row">
          <CustomInput disabled={!cableSelected1} sx={{ width: '300px' }} label={l.Start_Fiber +l.Cable+' 1'} name="startFiber1" onChange={onChangeStartFiber1} value={startFiber1} type="number" />
          <CustomInput disabled={!cableSelected2} sx={{ width: '300px' }} label={l.Start_Fiber +l.Cable+' 2'} name="startFiber2" onChange={onChangeStartFiber2} value={startFiber2} type="number" />
        </Box>
        <Box display="flex" gap={2} alignItems="flex-start" flexDirection="row">
          <CustomInput disabled={!cableSelected1} sx={{ width: '300px' }} label={l.Number_Fiber +l.Cable+' 1'} name="numFiber2" onChange={onChangeNumberOfFibers1} value={numberOfFibers1} type="number" />
          <CustomInput disabled={true} sx={{ width: '300px' }} label={l.Number_Fiber +l.Cable+' 2'} name="numFiber2" onChange={onChangeNumberOfFibers2} value={numberOfFibers2} type="number" />
        </Box>
        <Box display="flex" gap={2} alignItems="flex-start" flexDirection="row">
          <CustomInput disabled={true} sx={{ width: '300px' }} label={l.End_Fiber +l.Cable+' 1'} name="EndFiber1" onChange={onChangeEndFiber1} value={endFiber1} type="number" />
          <CustomInput disabled={true} sx={{ width: '300px' }} label={l.End_Fiber +l.Cable+' 2'} name="EndFiber2" onChange={onChangeEndFiber1} value={endFiber2} type="number" />
        </Box>
        <CustomButton onClick={() => onSaveChanges()}> {l.Save_changes} </CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default SpliceFibersTp;
