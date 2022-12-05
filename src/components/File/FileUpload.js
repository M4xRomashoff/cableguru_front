import React, { useEffect, useRef } from 'react';
import { Button, CircularProgress, FormHelperText } from '@mui/material';
import { getFileExtensions } from '../../helpers';
import UrlFromFile from './UrlFromFile';
import { blobToFile, removeAllInputFiles, removeFileFromFileList } from '../../helpers/fileHelper';
import { API } from '../../api/api';

export function FileUpload({
  required,
  extensions = ['pdf', 'docx', 'doc'],
  className = '',
  onChange = () => {},
  error,
  name,
  setFile,
  endIcon,
  fileName,
  files = [],
  id = 'file-upload',
  label = 'Choose File',
  buttonVariant = 'text',
}) {
  const fileRef = useRef();

  const changeInput = (e) => {
    if (setFile) return setFile(e, e.target.files[0], () => removeAllInputFiles(fileRef.current));

    return onChange(e, e.target.files);
  };

  const removeFile = (index) => {
    removeFileFromFileList(index, fileRef.current);
    changeInput({ target: fileRef.current });
  };

  const hasStringFile = files.some((file) => typeof file === 'string' && file);

  useEffect(() => {
    if (hasStringFile) {
      (async () => {
        const clonedFiles = files.slice();
        let index = 0;
        // eslint-disable-next-line no-restricted-syntax
        for await (const file of files) {
          if (typeof file === 'string') {
            try {
              const { data: fileData } = await API({
                url: file,
                responseType: 'blob',
              });
              clonedFiles.splice(index, 1, {
                document_name: fileName || index,
                file: blobToFile(fileData, `Документ ${index + 1}`),
              });
            } catch (e) {
              clonedFiles.splice(index, 1, { document_name: '', file: '' });
            }
          }
          index += 1;
        }
        onChange({ target: { name } }, clonedFiles);
      })();
    }
    /* eslint-disable-next-line */
  }, [files]);

  if (hasStringFile) return <CircularProgress />;

  return (
    <div className={`container-file-upload ${className}`}>
      {label && (
        <Button
          endIcon={endIcon}
          variant={buttonVariant}
          sx={{ pl: buttonVariant === 'text' ? 0 : '' }}
          component="label"
          htmlFor={id}
        >
          {`${label}${required ? ' *' : ''}`}
        </Button>
      )}
      {error && <FormHelperText error={!!error}>Required field</FormHelperText>}
      <input
        ref={fileRef}
        accept={extensions ? getFileExtensions(extensions) : undefined}
        onChange={changeInput}
        className="input-file-upload"
        id={id}
        name={name || id}
        type="file"
        hidden
      />
      {
        files.map((file, index) => file && (
          <UrlFromFile
            removeFile={() => removeFile(index)}
            key={file.id || file.name || index}
            download={false}
            file={file}
          />
        ))
      }
    </div>
  );
}
