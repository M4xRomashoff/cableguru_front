import React, { useState } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import { logAddInfo } from '../../api/logFileApi';
import useApi from '../../hooks/useApi';
import ModalWithTitle from '../Modals/ModalWithTitle';
import CustomInput from '../Inputs';
import CustomButton from '../Button';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { getCablePointsFromString } from '../../helpers/getCablePointsFromString';

function float2int(value) {
  return value | 0;
}

function keyGen() {
  let number = Math.random();
  return number;
}

function getDistance(origin, destination) {
  // console.log('origin, destination', origin, destination);
  // return distance in meters
  let lon1 = toRadian(origin[1]),
    lat1 = toRadian(origin[0]),
    lon2 = toRadian(destination[1]),
    lat2 = toRadian(destination[0]);

  let deltaLat = lat2 - lat1;
  let deltaLon = lon2 - lon1;

  let a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
  let c = 2 * Math.asin(Math.sqrt(a));
  let EARTH_RADIUS = 6371;

  // console.log('c * EARTH_RADIUS * 1000', c * EARTH_RADIUS * 1000);
  return c * EARTH_RADIUS * 1000;
}
function toRadian(degree) {
  return (degree * Math.PI) / 180;
}
// let distance = getDistance([lat1, lng1], [lat2, lng2]);

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

function getDistanceA(trace, i) {
  let total = 0;
  let digitalPoints = [];
  total = 0;
  const points = getCablePointsFromString(trace[i].points);
  for (let j = 0; j < points.length; j++) digitalPoints.push(points[j]);

  for (let i = 0; i < digitalPoints.length - 1; i++) {
    total += getDistance([digitalPoints[i].lat, digitalPoints[i].lng], [digitalPoints[i + 1].lat, digitalPoints[i + 1].lng]);
  }
  return float2int(total);
}

function getItemId(traceItem, markersSp, markersTp) {
  let itemName = '';
  if (traceItem.itemType === 'sp') {
    for (let i = 0; i < markersSp.length; i++) {
      if (markersSp[i].id === traceItem.itemId) {
        itemName = markersSp[i].name_id;
        break;
      }
    }
  }

  if (traceItem.itemType === 'tp') {
    for (let i = 0; i < markersTp.length; i++) {
      if (markersTp[i].id === traceItem.itemId) {
        itemName = markersTp[i].name_id;
        break;
      }
    }
  }
  return itemName;
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

function prepData(trace, markersSp, markersTp) {
  let koef = 1.25;
  let maxDist = getTotalDistance(trace);
  let minDist = 0;
  const dataBody = [];
  const startPoint = [];
  const endPoint = [];
  let subItem = [];
  const startTp = getTp(trace[0].itemId, markersTp);
  subItem = ['Start Point (A)', 'ID', startTp.name_id];
  startPoint.push(subItem);
  subItem = ['', 'Address', startTp.address];
  startPoint.push(subItem);
  subItem = ['', 'Capacity', startTp.capacity];
  startPoint.push(subItem);
  subItem = ['', 'Connector', startTp.connector];
  startPoint.push(subItem);
  subItem = ['', 'Port', trace[0].port];
  startPoint.push(subItem);

  if (trace[trace.length - 1].itemType === 'tp') {
    const endTp = getTp(trace[trace.length - 1].itemId, markersTp);
    subItem = ['End Point (Z)', 'ID', endTp.name_id];
    endPoint.push(subItem);
    subItem = ['', 'Address', endTp.address];
    endPoint.push(subItem);
    subItem = ['', 'Capacity', endTp.capacity];
    endPoint.push(subItem);
    subItem = ['', 'Connector', endTp.connector];
    endPoint.push(subItem);
    subItem = ['', 'Port', trace[trace.length - 1].port];

    endPoint.push(subItem);
  }
  if (trace[trace.length - 1].itemType === 'sp') {
    const endSp = getSp(trace[trace.length - 1].itemId, markersSp);
    subItem = ['End Point (Z)', 'ID', endSp.name_id];
    endPoint.push(subItem);
    subItem = ['', 'Address', endSp.address];
    endPoint.push(subItem);
    subItem = ['', 'Connector', 'open end'];
    endPoint.push(subItem);
    subItem = ['', 'Fiber', trace[trace.length - 1].fiber];
    endPoint.push(subItem);
  }
  if (trace[trace.length - 1].itemType === 'none') {
    subItem = ['End Point (Z)', 'ID', 'none'];
    endPoint.push(subItem);
    subItem = ['', 'Tail', 'open end'];
    endPoint.push(subItem);
  }

  let tMax = maxDist;
  let tMin = 0;
  let dist = getDistanceA(trace, 0);

  subItem = ['', '', '', tMin, tMax, float2int(tMin * koef), float2int(tMax * koef)];
  dataBody.push(subItem);
  subItem = ['', '', trace[0].fiber.toString(), '', '', '', ''];
  dataBody.push(subItem);

  for (let i = 1; i < trace.length; i++) {
    if (trace[i].fiber !== 0) {
      tMin += dist;
      tMax -= dist;
      subItem = ['', getItemId(trace[i], markersSp, markersTp), '', tMin, tMax, float2int(tMin * koef), float2int(tMax * koef)];
      dist = getDistanceA(trace, i);
      dataBody.push(subItem);
      subItem = ['', '', trace[i].fiber.toString(), '', '', '', ''];
      dataBody.push(subItem);
    }
  }

  subItem = ['', '', '', maxDist, 0, float2int(maxDist * koef), 0];
  dataBody.push(subItem);

  return [startPoint, dataBody, endPoint];
}

const RouteDetails = ({ cables, markersSp, markersTp, trace, setTrace, onClose }) => {
  const [startPoint, dataBody, endPoint] = prepData(trace, markersSp, markersTp);
  const dataHead = [['', 'SP(TP) id', 'fiber', 'distance (A-point)', 'distance (point-Z)', 'OTDR (A-point)', 'OTDR (point-Z)']];

  return (
    <ModalWithTitle title="Route Details" containerSx={{ width: 800 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column">
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 500 }} aria-label="customized table">
            <TableHead>
              {startPoint.map((row) => (
                <StyledTableRow key={keyGen()}>
                  {row.map((cellHeader) => (
                    <StyledTableCell key={keyGen()} align="left" sx={{ minWidth: 100 }}>
                      {cellHeader}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableHead>
          </Table>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
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
          <Table sx={{ maxWidth: 500 }} aria-label="customized table">
            <TableHead>
              {endPoint.map((row) => (
                <StyledTableRow key={keyGen()}>
                  {row.map((cellHeader) => (
                    <StyledTableCell key={keyGen()} align="left" sx={{ minWidth: 100 }}>
                      {cellHeader}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableHead>
          </Table>
        </TableContainer>
      </Box>
    </ModalWithTitle>
  );
};

export default RouteDetails;
