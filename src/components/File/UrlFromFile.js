import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, Link,
} from '@mui/material';
import { getUrlFromFile } from '../../helpers/fileHelper';

function UrlFromFile({
  file,
  onClick = () => {},
  download = true,
  removeFile,
  isLoading,
  showOnlyLink,
}) {
  const [link, setLink] = useState('');

  const getFile = useCallback(async () => {
    const result = await getUrlFromFile(file);
    setLink(result);
  }, [file]);

  useEffect(() => {
    if (file) getFile();
    // eslint-disable-next-line
  }, [file]);

  if (!file && !showOnlyLink) return null;

  if (isLoading) return <CircularProgress />;

  const linkFileComponent = (
    <Link target="_blank" onClick={onClick} download={download} href={link} rel="noreferrer">
      {file.name}
    </Link>
  );

  if (showOnlyLink) return file ? linkFileComponent : <p>No file</p>;

  return (
    <Box display="flex" alignItems="center">
      {linkFileComponent}
      <Button sx={{ ml: 1 }} onClick={() => removeFile()}>
        Remove
      </Button>
    </Box>
  );
}

export default UrlFromFile;
