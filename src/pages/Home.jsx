import React, { useState } from 'react';
import '../components/Home/Home.css';
import { getUserDbRequest } from '../api/userApi';
import { getSessionItem, getUserSession } from '../helpers/storage';
import useApi from '../hooks/useApi';
import { Box, CircularProgress } from '@mui/material';
import Selector from '../components/Inputs/Selector';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/Button';
import AdminControls from '../components/AdminControls';
import { setSessionItem } from '../helpers/storage';
import NewProject from '../components/Modals/NewProjectModal';
import DelProject from '../components/Modals/DelProjectModal';

const Home = ({ setMenuLabel }) => {
  const [userDb, setUsersDb] = useState([]);
  const [userProject, setUserProject] = useState({});
  const [projectModal, setProjectModal] = useState(false);
  const [delProjectModal, setDelProjectModal] = useState(false);

  const navigate = useNavigate();

  const goToProject = () => {
    if (userProject.dbName) navigate(`/map`);
    else alert('select project, please');
  };

  function newProject() {
    setProjectModal(true);
  }
  function delProject() {
    setDelProjectModal(true);
  }

  const getUsersDb = async () => {
    const { id: userId } = getUserSession();
    const newUsersDb = await getUserDbRequest(userId);
    setUsersDb(newUsersDb);
  };

  const getOptions = async () => {
    const user = getUserSession();
    if (!user?.accessToken) return;
    return await getUsersDb();
  };

  const { isLoading } = useApi({
    request: getOptions,
    shouldRequest: true,
  });

  const onCloseNewProject = () => {
    setProjectModal(false);
  };
  const onCloseDelProject = () => {
    setDelProjectModal(false);
  };

  const changeUserProject = ({ value }) => {
    setUserProject(value);
    setMenuLabel('Project : ' + value.dbName);
    setSessionItem('project', value);
  };

  if (isLoading) return <CircularProgress />;
  let userAccessLevel = 0;
  const userAccessLevelTemp = getSessionItem('user');
  if (userAccessLevelTemp !== null) userAccessLevel = userAccessLevelTemp.access_level;

  return (
    <Box display="flex" pt={5} justifyContent="center" alignItems="center">
      {projectModal && <NewProject onClose={onCloseNewProject} />}
      {delProjectModal && <DelProject onClose={onCloseDelProject} />}
      <Box gap={2} display="flex" flexDirection="column" alignItems="flex-start" width="fit-content">
        <Selector sx={{ width: '250px' }} onChange={changeUserProject} value={userProject} label="Select User Project" fields={{ label: 'dbName', value: 'id' }} options={userDb} />
        <Box gap={2} display="flex" flexDirection="row" alignItems="flex-start" width="fit-content">
          <CustomButton onClick={goToProject}>Go to Project</CustomButton>
          {userAccessLevel >= 75 && <CustomButton onClick={newProject}>New Project</CustomButton>}
          {userAccessLevel >= 75 && <CustomButton onClick={delProject}>Delete Project</CustomButton>}
        </Box>
        <AdminControls />
      </Box>
    </Box>
  );
};

export default Home;
