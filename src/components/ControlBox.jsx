import React from 'react';
import { Box } from '@mui/material';

export default function ControlBox({ children }) {
  return (
    <Box display="flex" justifyContent="space-between" width="100%" p={2} bgcolor="lightgrey">
      {children}
    </Box>
  )
}