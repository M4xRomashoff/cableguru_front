import React from 'react';
import { Typography } from '@mui/material';

export default function ModalColumnTitle({ children }) {
  return (
    <Typography h3 sx={{ mb: 2 }}>
      {children}
    </Typography>
  );
}
