import React, { memo, useState } from 'react';
import useApi from '../hooks/useApi';
import { API } from '../api/api';
import { Box } from '@mui/material';
import BackdropLoading from './BackdropLoading';

const fullScreenStyle = {
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 99999,
};

export const ImageFile = memo(({ link, width = 256, height = 256 }) => {
  const [url, setUrl] = useState('');
  const [fullScreenImage, setFullScreenImage] = useState(false);

  const { isLoading } = useApi({
    request: () => API({ url: link, responseType: 'blob' }),
    setter: ({ data }) => setUrl(window.URL.createObjectURL(data)),
    shouldRequest: !url,
  });

  const clickImage = () => {
    setFullScreenImage((prevState) => !prevState);
  };

  if (isLoading) return <BackdropLoading position='relative' isLoading />;

  return <Box
    sx={fullScreenImage ? fullScreenStyle : undefined}
    onClick={clickImage}
    width={width}
    height={height}
    component='img'
    src={url}
    alt=''
  />;
});
