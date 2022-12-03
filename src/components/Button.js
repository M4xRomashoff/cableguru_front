import React from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

const innerButtonSx = {
  position: 'relative',
  borderRadius: '2px',
  fontSize: '12px',
  height: 32,
};

export default function CustomButton({ isLoading, children, disabled, onClick, color, variant = 'contained', sx, startIcon, endIcon, download, type = 'button', href, target }) {
  return (
    <Button
      type={type}
      sx={{ ...innerButtonSx, ...sx }}
      download={download}
      target={target}
      href={href}
      disabled={disabled || isLoading}
      color={color}
      startIcon={!isLoading && startIcon}
      endIcon={!isLoading && endIcon}
      variant={variant}
      onClick={onClick}>
      {isLoading && <CircularProgress sx={{ position: 'absolute' }} size="1rem" />}
      <Box visibility={isLoading && 'hidden'}>{typeof children === 'string' ? <Typography>{children}</Typography> : children}</Box>
    </Button>
  );
}
