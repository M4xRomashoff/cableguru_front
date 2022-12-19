import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';

const innerStyle = {
  wordBreak: 'break-word'
}

export default function CustomText({ children, sx }) {
  const sxStyle = useMemo(() => ({ ...sx, ...innerStyle }), [sx])

  return (
    <Typography sx={sxStyle}>{children}</Typography>
  )
}