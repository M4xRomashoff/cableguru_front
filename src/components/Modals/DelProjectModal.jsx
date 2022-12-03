import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
import { Box, CircularProgress } from '@mui/material';
import useApi from '../../hooks/useApi';
import ModalWithTitle from './ModalWithTitle';
import CustomInput from '../Inputs';
import CustomButton from '../Button';
import { createNewProject, getDbList } from '../../api/dataBasesApi';
import { useNavigate } from 'react-router-dom';
import { getSessionItem, getUserSession, setSessionItem } from '../../helpers/storage';
import { addAccessRequest, removeAccessRequest, removeAccessRequestAndDelete } from '../../api/accessApi';
import { getUserDbRequest } from '../../api/userApi';
import ControlBox from '../ControlBox';
import Selector from '../Inputs/Selector';

function findProject(newName, newUsersDb) {
  let project = {};
  newUsersDb.map((item) => {
    if (item.dbName === newName) project = item;
  });
  return project;
}

const DelProject = ({ onClose }) => {
  const [newName, setNewName] = useState('');
  const [dbNames, setDbNames] = useState([]);
  const [dbOptions, setDbOptions] = useState([]);
  const { id: userId } = getUserSession();

  const { isLoading } = useApi({
    request: getUserDbRequest,
    setter: setDbOptions,
    shouldRequest: userId,
    params: userId,
  });

  const { isLoading: dbDeleting, makeRequest: deleteDbs } = useApi({
    request: removeAccessRequestAndDelete,
    successMessage: 'Success',
  });

  const getUsersDb = async () => {
    const { id: userId } = getUserSession();
    const dbList = await getUserDbRequest(userId);
    setDbNames(dbList);
  };

  const onDeleteSelected = () => {
    deleteDbs(changeAccessProps());

    // onClose();
  };

  const changeAccessProps = () => ({
    user_id: userId,
    access_level: 1,
    dbNames: dbNames.map(({ dbName }) => dbName),
  });

  if (isLoading) return <CircularProgress />;

  const changeDbNames = ({ value }) => setDbNames(value);

  return (
    <ModalWithTitle title="Delete Project(s)" containerSx={{ width: 400 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column">
        <ControlBox>
          <Selector
            multiple
            sx={{ width: '250px' }}
            onChange={changeDbNames}
            value={dbNames}
            fields={{
              label: 'dbName',
              id: 'dbName',
              value: 'dbName',
            }}
            label="Select projects to delete"
            options={dbOptions}
          />
          <CustomButton disabled={!dbNames.length} sx={{ ml: 2 }} color="warning" isLoading={dbDeleting} onClick={onDeleteSelected}>
            Delete
          </CustomButton>
        </ControlBox>
      </Box>
    </ModalWithTitle>
  );
};

export default DelProject;
