import React, { useEffect, useState } from 'react';
import '../components/Home/Home.css';
import AddUser from '../components/Home/AddUser';
import { deleteUserRequest, getUserDbRequest, getUsersRequest } from '../api/userApi';
import { getSessionItem, getUserSession } from '../helpers/storage';
import useApi from '../hooks/useApi';
import { CircularProgress } from '@mui/material';
import Selector from '../components/Inputs/Selector';
import CustomButton from '../components/Button';
import { useUserStore } from '../store';
import useDeleteModal from '../hooks/useDeleteModal';
import { addAccessRequest, removeAccessRequest } from '../api/accessApi';
import { getDbList } from '../api/dataBasesApi';
import ControlBox from './ControlBox';

function AdminControlsContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [dbOptions, setDbOptions] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [dbNamesToAdd, setDbNamesToAdd] = useState([]);
  const [dbNamesToRemove, setDbNamesToRemove] = useState([]);
  const [dbOptionsToAdd, setDbOptionsToAdd] = useState([]);
  const [dbOptionsToRemove, setDbOptionsToRemove] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  const { id } = getSessionItem('user'); // current user

  function filterUserList(users) {
    // filter itself out of from the list
    const { id } = getSessionItem('user');
    let newList = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].id !== id) newList.push(users[i]);
    }
    return newList;
  }

  const getUsers = async () => {
    const usersList = filterUserList(await getUsersRequest());
    setUsersList(usersList);
  };

  useApi({
    request: getUserDbRequest,
    setter: setDbOptionsToRemove,
    shouldRequest: selectedUser.id,
    params: selectedUser.id,
  });

  useApi({
    request: getUserDbRequest,
    setter: setDbOptions,
    shouldRequest: id,
    params: id,
  });

  useEffect(() => {
    if (selectedUser.id) {
      if (dbOptionsToRemove.length && dbOptions.length) {
        const dbNoAccess = [];
        let addFlag = true;
        for (let i = 0; i < dbOptions.length; i++) {
          for (let j = 0; j < dbOptionsToRemove.length; j++) {
            if (dbOptionsToRemove[j].dbName === dbOptions[i].dbName) {
              addFlag = false;
              break;
            }
          }
          if (addFlag) dbNoAccess.push(dbOptions[i]);
          addFlag = true;
        }
        setDbOptionsToAdd(dbNoAccess);
      } else setDbOptionsToAdd(dbOptions);
    }
  }, [dbOptionsToRemove, dbOptions]);

  const getOptions = async () => {
    const user = getUserSession();

    if (!user?.accessToken) return;

    const [usersData, usersList, dbList] = await Promise.all([getUsers()]);

    return { ...usersData, ...usersList, ...dbList };
  };

  const { isLoading } = useApi({
    request: getOptions,
    shouldRequest: true,
  });

  const { isLoading: addAccessLoading, makeRequest: addAccess } = useApi({
    request: addAccessRequest,
    successMessage: 'Success',
  });

  const { isLoading: removeAccessLoading, makeRequest: removeAccess } = useApi({
    request: removeAccessRequest,
    successMessage: 'Success',
  });

  const deleteUser = useDeleteModal();

  if (isLoading) return <CircularProgress />;

  const changeSelectedUser = ({ value }) => {
    setSelectedUser(value);
    setDbNamesToRemove([]);
    setDbNamesToAdd([]);
  };

  const onDeleteUser = () => {
    deleteUser({
      itemId: selectedUser.id,
      deleteItem: deleteUserRequest,
      message: 'Success',
      objectName: `${selectedUser.user_name}`,
      setter: async () => {
        await getUsers();
        setSelectedUser({});
      },
    });
  };

  const changeAccessProps = () => ({
    user_id: selectedUser.id,
    access_level: selectedUser.access_level,
    dbNames: dbNamesToAdd.map(({ dbName }) => dbName),
  });

  const changeAccessPropsR = () => ({
    user_id: selectedUser.id,
    dbNames: dbNamesToRemove.map(({ dbName }) => dbName),
  });

  const onAddAccess = () => addAccess(changeAccessProps());

  const onRemoveAccess = () => {
    removeAccess(changeAccessPropsR());
  };

  const changeDbNamesToAdd = ({ value }) => setDbNamesToAdd(value);

  const changeDbNamesToRemove = ({ value }) => setDbNamesToRemove(value);

  const changeAccessLoading = addAccessLoading || removeAccessLoading;

  const noSelectedUser = !selectedUser.id;

  return (
    <>
      <CustomButton className="button" onClick={() => setIsOpen(true)}>
        Add User
      </CustomButton>
      {isOpen && <AddUser onClose={() => setIsOpen(false)} getUsers={getUsers} />}
      <ControlBox>
        <Selector sx={{ width: '250px' }} onChange={changeSelectedUser} value={selectedUser} label="Select User" fields={{ label: 'user_name', value: 'id' }} options={usersList} />
        <CustomButton color="error" disabled={noSelectedUser} onClick={onDeleteUser} sx={{ width: '120px', marginTop: '4px' }}>
          Delete User
        </CustomButton>
      </ControlBox>
      <ControlBox>
        <Selector
          multiple
          disabled={noSelectedUser}
          sx={{ width: '250px', padding: '2px' }}
          onChange={changeDbNamesToAdd}
          value={dbNamesToAdd}
          fields={{
            label: 'dbName',
            id: 'dbName',
            value: 'dbName',
          }}
          label="Select Projects to Add"
          options={dbOptionsToAdd}
        />
        <CustomButton disabled={!dbOptionsToAdd.length} isLoading={changeAccessLoading} onClick={onAddAccess} sx={{ width: '120px', marginTop: '4px' }}>
          Add Access
        </CustomButton>
      </ControlBox>
      <ControlBox>
        <Selector
          multiple
          disabled={noSelectedUser}
          sx={{ width: '250px' }}
          onChange={changeDbNamesToRemove}
          value={dbNamesToRemove}
          fields={{
            label: 'dbName',
            id: 'dbName',
            value: 'dbName',
          }}
          label="Select Projects to Remove"
          options={dbOptionsToRemove}
        />
        <CustomButton disabled={!dbOptionsToRemove.length} sx={{ width: '160px', marginTop: '4px', ml: 1 }} color="warning" isLoading={changeAccessLoading} onClick={onRemoveAccess}>
          Remove Access
        </CustomButton>
      </ControlBox>
    </>
  );
}

export default function AdminControls() {
  const { userStore } = useUserStore();

  if (userStore?.access_level !== 80) return null;

  return <AdminControlsContainer />;
}
