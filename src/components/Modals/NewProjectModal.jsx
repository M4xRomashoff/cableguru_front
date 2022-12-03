import React, { useState } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import useApi from '../../hooks/useApi';
import ModalWithTitle from './ModalWithTitle';
import CustomInput from '../Inputs';
import CustomButton from '../Button';
import { createNewProject } from '../../api/dataBasesApi';
import { useNavigate } from 'react-router-dom';
import { getSessionItem, setSessionItem } from '../../helpers/storage';
import { addAccessRequest } from '../../api/accessApi';
import { getUserDbRequest } from '../../api/userApi';

function findProject(newName, newUsersDb) {
  let project = {};
  newUsersDb.map((item) => {
    if (item.dbName === newName) project = item;
  });
  return project;
}

const NewProject = ({ onClose }) => {
  const [newName, setNewName] = useState('');

  const { isLoading: addAccessLoading, makeRequest: addAccess } = useApi({
    request: addAccessRequest,
    successMessage: 'Success',
  });
  const userId = getSessionItem('user').id;
  const navigate = useNavigate();
  const onChange = ({ value }) => setNewName(value);

  const changeAccessProps = () => ({
    user_id: userId,
    access_level: 1,
    dbNames: [newName],
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // check name

    const response = await createNewProject(newName);

    const onAddAccess = await addAccess(changeAccessProps());

    const newUsersDb = await getUserDbRequest(userId);

    setSessionItem('project', findProject(newName, newUsersDb));

    navigate(`/map`);
    onClose();
  };

  const { makeRequest: createComment, isLoading } = useApi({
    request: handleSubmit,
  });

  return (
    <ModalWithTitle title="Create New Project" containerSx={{ width: 400 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column" onSubmit={createComment}>
        <CustomInput multiline={true} sx={{ width: '100%' }} value={newName} onChange={onChange} label="Enter name for new project" />
        <CustomButton isLoading={isLoading} type="submit">
          Create
        </CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default NewProject;
