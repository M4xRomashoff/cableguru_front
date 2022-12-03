import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

export default function BackdropLoading({ isLoading = false, position = 'absolute', sx }) {
  if (!isLoading) return;
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        position,
        ...sx,
      }}
      open={isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
