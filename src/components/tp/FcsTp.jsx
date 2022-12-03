import { React, useState } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from '../Modals/ModalWithTitle';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CustomButton from '../Button';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: 1,
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 1,
  },
}));
const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: 1,
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
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
    fontSize: 16,
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

const FcsTp = ({ onClose, pointInfoFcsTp, dataFcsTp }) => {
  const [full, setFull] = useState(true);

  function fullShort() {
    if (full) setFull(false);
    else setFull(true);
  }

  function keyGen() {
    let number = Math.random();
    return number;
  }
  function createDataH(a, b, c, d) {
    return { a, b, c, d };
  }
  const rowsH = [
    createDataH('ID  :', pointInfoFcsTp.name_id, 'Capacity  : ', pointInfoFcsTp.capacity),
    createDataH('Owner  :', pointInfoFcsTp.owner, 'Connector  :', pointInfoFcsTp.connector),
    createDataH('Address  :', pointInfoFcsTp.address, 'Access  :', pointInfoFcsTp.access),
    createDataH('Manufacturer  :', pointInfoFcsTp.mfg, 'Build date  :', pointInfoFcsTp.birthday.slice(0, 10)),
    createDataH('Model  :', pointInfoFcsTp.model, 'Last update  :', pointInfoFcsTp.last_update.slice(0, 10)),
  ];

  return (
    <ModalWithTitle title={pointInfoFcsTp.name_id} containerSx={{ width: '50%' }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column">
        <CustomButton onClick={fullShort}> Full / Short</CustomButton>
        <TableContainer component={Paper}>
          <Table sx={{ width: '100%' }} aria-label="customized table">
            <TableBody>
              {rowsH.map((row) => (
                <TableRow key={row.a}>
                  <StyledTableCell component="th" scope="row" align="right">
                    {' '}
                    {row.a}{' '}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.b}</StyledTableCell>
                  <StyledTableCell align="right">{row.c}</StyledTableCell>
                  <StyledTableCell align="left">{row.d}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300 }} aria-label="customized table">
            <TableHead>
              {dataFcsTp.header.map((row, dataFcsIndex) => (
                <StyledTableRow key={keyGen()}>
                  {/*<StyledTableRow key={row[0] + dataFcsIndex}>*/}
                  {row.map((cellHeader, index) => (
                    <StyledTableCell2 key={keyGen()} align="left">
                      {/*<StyledTableCell2 key={`${cellHeader}${index}`} align="left">*/}
                      {cellHeader}
                    </StyledTableCell2>
                  ))}
                </StyledTableRow>
              ))}
            </TableHead>
            {full && (
              <TableBody>
                {dataFcsTp.body.map((row, dBodyIndex) => (
                  <StyledTableRow key={keyGen()}>
                    {/*<StyledTableRow key={row[0][0] + dBodyIndex}>*/}
                    {row.map((cellBody, index) => (
                      <StyledTableCell2 key={keyGen()} align="left">
                        {/*<StyledTableCell2 key={`${cellBody}${index}`} align="left">*/}
                        {cellBody}
                      </StyledTableCell2>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
            {!full && (
              <TableBody>
                {dataFcsTp.bodyFull.map((row, dBodyIndex) => (
                  <StyledTableRow key={keyGen()}>
                    {/*<StyledTableRow key={row[0][0] + dBodyIndex}>*/}
                    {row.map((cellBody, index) => (
                      <StyledTableCell2 key={keyGen()} align="left">
                        {/*<StyledTableCell2 key={`${cellBody}${index}`} align="left">*/}
                        {cellBody}
                      </StyledTableCell2>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>
    </ModalWithTitle>
  );
};

export default FcsTp;
