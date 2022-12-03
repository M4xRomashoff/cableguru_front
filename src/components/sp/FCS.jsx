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

const FCS = ({ onClose, pointInfoFCS, dataFcs }) => {
  if (dataFcs.body.length === 1) {
    dataFcs.body = [
      ['', ''],
      ['', ''],
    ];
    dataFcs.bodyFull = [
      ['', ''],
      ['', ''],
    ];
  }

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
    createDataH('ID  :', pointInfoFCS.name_id, 'Capacity  : ', pointInfoFCS.capacity),
    createDataH('Owner  :', pointInfoFCS.owner, 'Splice type  :', pointInfoFCS.spl_type),
    createDataH('Address  :', pointInfoFCS.address, 'Mount  :', pointInfoFCS.mount),
    createDataH('Manufacturer  :', pointInfoFCS.mfg, 'Build date  :', pointInfoFCS.birthday.slice(0, 10)),
    createDataH('Model  :', pointInfoFCS.model, 'Last update  :', pointInfoFCS.last_update.slice(0, 10)),
  ];

  return (
    <ModalWithTitle title={pointInfoFCS.name_id} containerSx={{ width: '50%' }} close={onClose} open>
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
              {dataFcs.header.map((row) => (
                <StyledTableRow key={keyGen()}>
                  {row.map((cellHeader) => (
                    <StyledTableCell2 key={keyGen()} align="left">
                      {cellHeader}
                    </StyledTableCell2>
                  ))}
                </StyledTableRow>
              ))}
            </TableHead>
            {full && (
              <TableBody>
                {dataFcs.body.map((row) => (
                  <StyledTableRow key={keyGen()}>
                    {row.map((cellBody) => (
                      <StyledTableCell2 key={keyGen()} align="left">
                        {cellBody}
                      </StyledTableCell2>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
            {!full && (
              <TableBody>
                {dataFcs.bodyFull.map((row) => (
                  <StyledTableRow key={keyGen()}>
                    {row.map((cellBody) => (
                      <StyledTableCell2 key={keyGen()} align="left">
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

export default FCS;
