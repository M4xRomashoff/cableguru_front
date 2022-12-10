import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import { logAddInfo } from '../../api/logFileApi';
import useApi from '../../hooks/useApi';
import ModalWithTitle from './ModalWithTitle';
import CustomInput from '../Inputs';
import CustomButton from '../Button';
import MenuItem from '@mui/material/MenuItem';
import { getTrace } from '../../api/dataBasesApi';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { getCablePointsFromString } from '../../helpers/getCablePointsFromString';
import BackdropLoading from '../BackdropLoading';
import { getSessionItem } from '../../helpers/storage';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: 1,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 1,
  },
}));
const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    padding: 1,
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 1,
  },
}));
const StyledTableCell3 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.white,
    padding: 1,
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    fontSize: 12,
    padding: 1,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    height: 10,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function float2int(value) {
  return value | 0;
}

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

function getDistance(origin, destination) {
  let lon1 = toRadian(origin[1]),
    lat1 = toRadian(origin[0]),
    lon2 = toRadian(destination[1]),
    lat2 = toRadian(destination[0]);

  let deltaLat = lat2 - lat1;
  let deltaLon = lon2 - lon1;

  let a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
  let c = 2 * Math.asin(Math.sqrt(a));
  let EARTH_RADIUS = 6371;

  return c * EARTH_RADIUS * 1000;
}

function toRadian(degree) {
  return (degree * Math.PI) / 180;
}

function getTotalDistance(trace) {
  let total = 0;
  total = 0;
  for (let i = 0; i < trace.length; i++) {
    if (!Array.isArray(trace[i].points)) {
      const points = getCablePointsFromString(trace[i].points);
      for (let j = 0; j < points.length - 1; j++) total += getDistance([points[j].lat, points[j].lng], [points[j + 1].lat, points[j + 1].lng]);
    }
  }

  return float2int(total);
}

function getEndPointAndPort(item, markersSp, markersTp) {
  let endPoint = '-';
  let endPort = '-';
  let element = '';
  const lastElement = item.length - 1;
  if (item.length > 1) {
    if (item[lastElement]?.itemType === 'sp') {
      element = getSp(item[lastElement]?.itemId, markersSp);
      endPoint = element.name_id;
      endPort = item[lastElement].port;
    }
    if (item[lastElement]?.itemType === 'tp' && item[lastElement]?.cabSize === 0) {
      element = getTp(item[lastElement]?.itemId, markersTp);
      endPoint = element.name_id;
      endPort = item[lastElement].port;
    }
  }

  return [endPoint, endPort];
}

function getBudget(distOTDR, splices) {
  let b1310 = 0;
  let b1550 = 0;
  if (distOTDR > 0) {
    const sessionItem = getSessionItem('projectOptions');
    const att1310 = sessionItem?.att1310;
    const att1550 = sessionItem?.att1550;
    const spliceLoss = sessionItem?.spliceLoss;
    const connectorLoss = sessionItem?.connectorLoss;
    b1310 = parseFloat((2 * connectorLoss + (distOTDR / 1000) * att1310 + splices * spliceLoss).toFixed(2));
    b1310 = b1310.toString() + ' (db)';
    b1550 = parseFloat((2 * connectorLoss + (distOTDR / 1000) * att1550 + splices * spliceLoss).toFixed(2));
    b1550 = b1550.toString() + ' (db)';
  } else {
    b1310 = '-';
    b1550 = '-';
  }
  return [b1310, b1550];
}

function getSplices(item) {
  let splices = 0;
  const lastElement = item.length - 1;
  if (item.length > 1) {
    splices = item.length;
    if (item[lastElement]?.itemType === 'none') splices -= 1;
    if (item[lastElement]?.itemType === 'sp') splices -= 1;
    if (item[lastElement]?.itemType === 'tp' && item[lastElement]?.cabSize === 0) splices -= 1;
  }
  return splices;
}

function prepData(allData, markersSp, markersTp) {
  let coefficient = getSessionItem('projectOptions').coefficient;
  const dataBody = [];
  for (let i = 0; i < allData.length; i++) {
    let port = i + 1;
    let dist = getTotalDistance(allData[i]);
    let distOTDR = dist * coefficient;
    let [endPoint, endPort] = getEndPointAndPort(allData[i], markersSp, markersTp);
    let splices = getSplices(allData[i]);
    let [b1310, b1550] = getBudget(distOTDR, splices);
    if (dist === 0) dist = '-';
    if (distOTDR === 0) distOTDR = '-';
    if (splices === 0) splices = '-';
    dataBody.push([port, dist, distOTDR, endPoint, endPort, b1310, b1550, splices]);
  }

  return dataBody;
}

const LossAndBudgetModal = ({ l, onClose, markersTp, markersSp }) => {
  const [tpOptions, setTpOptions] = useState([]);
  const [tpValue, setTpValue] = useState('');
  const [portOptions, setPortOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataBody, setDataBody] = useState([]);

  // const dataHead = [['Port #', 'Distance', 'OTDR Distance', 'End Point ID', 'End Point Port #', 'Budget 1310', 'Budget 1550', 'number of splices']];
  const dataHead = [[ l.Port+ ' #', l.Distance, l.OTDR_Distance, l.End_Point, l.End_Point_Port+' #', l.Budget_1310, l.Budget_1550, l.number_of_splices]];

  function keyGen() {
    let number = Math.random();
    return number;
  }

  const handleSubmit = async (event) => {
    setIsLoading(true);
    const allData = [];
    event.preventDefault();
    let portValue = 0;
    const size = getTpSize(tpValue);
    for (let i = 0; i < size; i++) {
      const tracesDb = await getTrace(tpValue, 'port ' + (i + 1).toString());
      allData.push(tracesDb);
    }

    setDataBody(prepData(allData, markersSp, markersTp));
    setIsLoading(false);
  };

  useEffect(() => {
    const tempOptions = [];
    if (markersTp) {
      for (let i = 0; i < markersTp.length; i++) {
        const oneOption = { label: markersTp[i].name_id, id: markersTp[i].id, value: markersTp[i].id };
        tempOptions.push(oneOption);
      }
    }
    setTpOptions(tempOptions);
  }, []);

  function getTpSize(id) {
    let size = 0;
    for (let i = 0; i < markersTp.length; i++) {
      if (markersTp[i].id === id) size = markersTp[i].capacity;
    }
    return size;
  }
  const onChangeTp = ({ value }) => {
    setTpValue(value);
  };

  return (
    <ModalWithTitle title={l.Loss_Budget} containerSx={{ width: 800 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column" onSubmit={handleSubmit}>
        <BackdropLoading isLoading={isLoading} />
        <CustomInput sx={{ width: '200px' }} select label={l.Termination_Point} name="tp" onChange={onChangeTp} value={tpValue}>
          {tpOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </CustomInput>
        <CustomButton type="submit">
          {/*isLoading={isLoading}*/}
          {l.Show_data_for_selected_location}
        </CustomButton>
        <Box display="flex" gap={2} alignItems="flex-start" flexDirection="column">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 750 }} aria-label="customized table">
              <TableHead>
                {dataHead.map((row) => (
                  <StyledTableRow key={keyGen()}>
                    {row.map((cellHeader) => (
                      <StyledTableCell2 key={keyGen()} align="left">
                        {cellHeader}
                      </StyledTableCell2>
                    ))}
                  </StyledTableRow>
                ))}
              </TableHead>
              <TableBody>
                {dataBody.map((row) => (
                  <StyledTableRow key={keyGen()}>
                    {row?.map?.((cellBody) => (
                      <StyledTableCell2 key={keyGen()} align="left">
                        {cellBody}
                      </StyledTableCell2>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </ModalWithTitle>
  );
};

export default LossAndBudgetModal;
