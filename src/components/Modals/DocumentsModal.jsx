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
import useApi from '../../hooks/useApi';
import { API } from '../../api/api';
import BackdropLoading from '../BackdropLoading';


const  DocumentsModal = ({ l, onClose}) => {
  const [file, setFile] = useState();
  const [docs, setDocs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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
    setIsUploading(true);
    const {dbName} =getSessionItem('project');
    const upload = await uploadDocument(file, dbName);
    if (upload) setIsUploading(false);
    logAddInfo(l.project, l.document_uploaded, file?.name);
    getDocs();
    setFile();
  }


  //
  async function onClickDelete(index) {
    const sure = window.confirm(l.Are_you_sure_you_want_to_delete + docs[index].file_name +' ? ')

    if (!sure) return
    logAddInfo(l.project, l.document_deleted, docs[index].file_name);
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
        {file && !isUploading && <CustomButton color="warning" onClick={handleUploadClick}>{l.Upload_Document}</CustomButton>}
        { isUploading && <BackdropLoading position='relative' isLoading />}
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
