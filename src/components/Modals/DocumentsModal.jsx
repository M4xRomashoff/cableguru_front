import React, { useEffect, useState } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from './ModalWithTitle';
import CustomButton from '../Button';
import { deleteDocument, downloadDocumentsLinks, uploadDocument } from '../../api/dataBasesApi';
import { logAddInfo } from '../../api/logFileApi';
import { ImageFile } from '../ImageFile';
import { getSessionItem } from '../../helpers/storage';
import { FileUpload } from '../File/FileUpload';
import { PublishSharp } from '@mui/icons-material';

const  DocumentsModal = ({ l, onClose}) => {
  const [file, setFile] = useState();
  const [docs, setDocs] = useState([]);

  async function getDocs() {
    const docs = await downloadDocumentsLinks();
    setDocs(docs);
  }

  useEffect(() => {
    getDocs();
  }, []);


  function getDocument(link) {
    const encodedLink = encodeURIComponent(link);
    let project = getSessionItem('project');
    return `/getDocument/${encodedLink}/link`;
  }

  async function handleUploadClick() {
    const {dbName} =getSessionItem('project');
    await uploadDocument(file, dbName);
    logAddInfo('project', 'document uploaded', file?.name);
    getDocs();
    setFile();
  }
  //
  async function onClickDelete(index) {
    const sure = window.confirm('Are you sure you want to delete?')

    if (!sure) return
    logAddInfo('project', 'document deleted', docs[index].file_name);

    await deleteDocument(docs[index]);
    const cloneDocs = docs.slice();
    cloneDocs.splice(index,1);
    setDocs(cloneDocs);
  }

  return (
    <ModalWithTitle
      title={l.Project_documents}
      containerSx={{ width: 600, height: 600 }}
      close={onClose}
      open
    >
      <Box component='form' display='flex' gap={2} alignItems='flex-start' flexDirection='column'>
        <FileUpload
          buttonVariant='contained'
          setFile={(_, file) => setFile(file)}
          id='file'
          name='file'
          files={[file]}
          extensions={['*']}
          endIcon={<PublishSharp />}
          label={l.New_Document}
        />
        {file && <CustomButton color="warning" onClick={handleUploadClick}>{l.Upload_Document}</CustomButton>}
        <Box display='flex' gap={2} flexDirection='column'>
          {Boolean(docs.length > 0) &&
            docs.map((doc, index) => (
              <Box display='flex' flexWrap='wrap' gap={2} flexDirection='row' key={doc.dir}>
                <a href={getDocument(doc.dir)}>{doc.file_name}</a>
                <p>uploaded on : </p>
                <p>{doc.date.slice(0, 10)}</p>
                <p>by: ({doc.user_name})</p>
                <CustomButton onClick={() => onClickDelete(index)}> {l.Delete_Document} </CustomButton>
              </Box>
            ))}
          {Boolean(docs.length === 0) && <p> {l.No_files}</p>}
        </Box>
      </Box>
    </ModalWithTitle>
  );
};

export default DocumentsModal;
