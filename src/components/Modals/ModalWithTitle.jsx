import React from 'react';
import { Box, Typography } from '@mui/material';
import CenteredModal from './CenteredModal';
import BackdropLoading from '../BackdropLoading';
import CloseModalButton from '../Buttons/CloseModalButton';

export default function ModalWithTitle({ children, open, title, subTitle, close, isLoading, containerSx, mainSx, sx }) {
  return (
    <CenteredModal close={close} open={open} sx={sx} containerSx={containerSx}>
      <Box>
        <Box p="12px">
          <Box mb={1} display="flex" justifyContent="space-between" alignItems="center">
            {title && <Typography fontSize={26}>{title}</Typography>}
            <CloseModalButton close={close} />
          </Box>
          {subTitle && <Typography h2>{subTitle}</Typography>}
        </Box>
        <Box position="relative" p="12px" sx={{ ...mainSx }}>
          <BackdropLoading isLoading={isLoading} />
          {children}
        </Box>
      </Box>
    </CenteredModal>
  );
}
