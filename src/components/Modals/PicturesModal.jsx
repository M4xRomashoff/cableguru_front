import React, { useEffect, useState } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from './ModalWithTitle';
import CustomButton from '../Button';
import { deletePicture, downloadPicturesLinks, uploadPicture } from '../../api/dataBasesApi';
import { logAddInfo } from '../../api/logFileApi';
import { ImageFile } from '../ImageFile';
import { getSessionItem } from '../../helpers/storage';
import { FileUpload } from '../File/FileUpload';
import { PublishSharp } from '@mui/icons-material';
import BackdropLoading from '../BackdropLoading';

const PicturesModal = ({ l, onClose, picturesInfo }) => {
  const [file, setFile] = useState();
  const [imagesLinks, setImagesLinks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  async function getImages(type) {
    const imagesLinks = await downloadPicturesLinks(picturesInfo.id, type);
    setImagesLinks(imagesLinks);
  }

  useEffect(() => {
    let type = 'sp';
    if (picturesInfo.connector) type = 'tp';

    getImages(type);
  }, []);

  function getPicture(link) {
    const encodedLink = encodeURIComponent(link);
    let project = getSessionItem('project');
    return `/getPicture/${project?.dbName},${encodedLink}/link`;
  }

  async function handleUploadClick() {
    setIsUploading(true);
    const upload = await uploadPicture(file, picturesInfo);
    if (upload) setIsUploading(false);
    logAddInfo(picturesInfo.name_id, l.Picture_Uploaded, file?.name);
    let type = 'sp';
    if (picturesInfo.connector) type = 'tp';
    setFile()
    getImages(type);
  }

  async function onClickDelete(index) {
    const sure = window.confirm(l.Are_you_sure_you_want_to_delete)

    if (!sure) return

    await deletePicture(imagesLinks[index]);
    let type = 'sp';
    if (picturesInfo.connector) type = 'tp';
    getImages(type);
  }

  return (
    <ModalWithTitle
      title={l.Pictures_for + picturesInfo.name_id}
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
          extensions={['png', 'svg', 'jpeg', 'jpg']}
          endIcon={<PublishSharp />}
          label={l.New_image}
        />
        {file && !isUploading &&<CustomButton color="warning" onClick={handleUploadClick}>{l.Upload_Picture}</CustomButton>}
        { isUploading && <BackdropLoading position='relative' isLoading />}
        <Box display='flex' gap={2} flexDirection='column'>
          {Boolean(imagesLinks.length > 0) &&
            imagesLinks.map((image, index) => (
              <Box display='flex' flexWrap='wrap' gap={2} flexDirection='row' key={image.dir}>
                <ImageFile link={getPicture(image.dir)} />
                <p>{image.user_name}</p>
                <p>uploaded on : </p>
                <p>{image.date.slice(0, 10)}</p>
                <CustomButton onClick={() => onClickDelete(index)}> {l.delete_picture} </CustomButton>
              </Box>
            ))}
        </Box>
      </Box>
    </ModalWithTitle>
  );
};

export default PicturesModal;
