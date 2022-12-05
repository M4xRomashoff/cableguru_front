import React from 'react';
import {
  Box, Modal, styled,
} from '@mui/material';

const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  maxHeight: '90vh',
  overflow: 'auto',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  boxShadow: 24,
  [theme.breakpoints.down('md')]: {
    width: '100vw',
  },
  [theme.breakpoints.up('md')]: {
    width: '65vw',
  },
}));

export default function CenteredModal({
  children, close, open, sx, containerSx,
}) {
  return (
    <Modal open={open} onClose={close} sx={sx}>
      <StyledContainer sx={containerSx}>
        {children}
      </StyledContainer>
    </Modal>
  );
}
