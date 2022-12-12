import React, { useState } from 'react';
import './Home/Home.css';
import { Box } from '@mui/material';
import { logAddInfo } from '../api/logFileApi';
import useApi from '../hooks/useApi';
import ModalWithTitle from './Modals/ModalWithTitle';
import CustomInput from './Inputs';
import CustomButton from './Button';

const AddComment = ({ l, onClose, nameId }) => {
  const [comment, setComment] = useState('');

  const onChange = ({ value }) => setComment(value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await logAddInfo(nameId, l.comment, comment);
    onClose();
  };

  const { makeRequest: createComment, isLoading } = useApi({
    request: handleSubmit,
  });

  return (
    <ModalWithTitle title={l.Add_comment} containerSx={{ width: 400 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column" onSubmit={createComment}>
        <CustomInput multiline={true} sx={{ width: '100%' }} value={comment} onChange={onChange} label={l.comment} />
        <CustomButton isLoading={isLoading} type="submit">
          {l.Send_comment}
        </CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default AddComment;
