import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
// import './flex.css';
import { Box } from '@mui/material';
import ModalWithTitle from './ModalWithTitle';
import CustomInput from '../Inputs';
import CustomButton from '../Button';
import { uploadPicture, downloadPicturesLinks, deletePicture, downloadPicture } from '../../api/dataBasesApi';
import { logAddInfo } from '../../api/logFileApi';

const PicturesModal = ({ onClose, picturesInfo }) => {
  const [file, setFile] = useState();
  const [imagesLinks, setImagesLinks] = useState([]);
  const urlHead = 'http://localhost:5555';
  //const urlHead = 'https://80.78.244.5:5555';

  function keyGen() {
    let number = Math.random();
    return number;
  }

  async function getImages(id, type) {
    const imagesLinks = await downloadPicturesLinks(id, type);
    setImagesLinks(imagesLinks);

    console.log('links',imagesLinks);

    return imagesLinks;
  }

  useEffect(() => {
    let type = 'sp';
    if (picturesInfo.connector) type = 'tp';
    const imagesFrom = getImages(picturesInfo.id, type);
  }, []);

  const handleFileChange = (e) => {
    if (e.event.target.files) {
      setFile(e.event.target.files[0]);
    }
  };

  async function getPicture(link){
    const response = await downloadPicture(link);
    console.log('resp',response);
    //return image;
  }

  async function handleUploadClick() {
    const res = await uploadPicture(file, picturesInfo);
    logAddInfo(picturesInfo.name_id, 'Picture Uploaded', file?.name);
    let type = 'sp';
    if (picturesInfo.connector) type = 'tp';
    const imagesFrom = getImages(picturesInfo.id, type);
  }

  async function onClickDelete(index) {
    const deleteImage = deletePicture(imagesLinks[index]);
    let type = 'sp';
    if (picturesInfo.connector) type = 'tp';
    const imagesFrom = getImages(picturesInfo.id, type);
  }

  async function onImageClick(index) {
    const url = urlHead + imagesLinks[index].dir;
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  }

  return (
    <ModalWithTitle title={'Pictures for :' + picturesInfo.name_id} containerSx={{ width: 600, height: 600 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column">
        <CustomInput type={'file'} accept={'image/*'} onChange={handleFileChange} />
        <CustomButton onClick={handleUploadClick}>Upload Picture</CustomButton>
        <Box display="flex" gap={2} flexDirection="column">
          {Boolean(imagesLinks.length > 0) &&
            imagesLinks.map((image, index) => (
              <Box display="flex" gap={2} flexDirection="row" key={keyGen()}>
                <img src={getPicture(image.dir)} width="250" height="250" onClick={() => onImageClick(index)} key={keyGen()} />
                <p>{image.user_name}</p>
                <p>uploaded on : </p>
                <p>{image.date.slice(0, 10)}</p>
                <CustomButton onClick={() => onClickDelete(index)}> delete picture </CustomButton>
              </Box>
            ))}
        </Box>
      </Box>
    </ModalWithTitle>
  );
};

export default PicturesModal;
