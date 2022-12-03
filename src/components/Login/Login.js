import React, { useState } from 'react';
import './Login.css';
import { loginUserRequest } from '../../api/userApi';
import useApi from '../../hooks/useApi';
import useError from '../../hooks/useError';
import Button from '../Button';
import { Box, Typography } from '@mui/material';
import CustomInput from '../Inputs';
import { setUserSession } from '../../helpers/storage';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState({ password: '', userName: '' });
  const { error, setError } = useError();

  async function getData({ target }) {
    const result = await loginUserRequest({
      userName: target.userName.value,
      password: target.password.value,
    });

    setUserSession(result);

    navigate('/');
  }

  const changeLoginUser = ({ value, name }) => {
    setLoginUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { makeRequest, isLoading } = useApi({
    request: getData,
    onError: (error) => {
      if (error?.response?.data) setError(error?.response?.data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    makeRequest(e);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} gap={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
      <Typography fontSize={32} fontWeight="bold">
        Please Log In
      </Typography>
      <CustomInput name="userName" type="text" sx={{ minWidth: '280px' }} label="User name" value={loginUser.userName} error={error.userName} onChange={changeLoginUser} />
      <CustomInput sx={{ minWidth: '280px' }} label="Password" name="password" type="password" value={loginUser.password} error={error.password} onChange={changeLoginUser} />
      <Button type="submit" isLoading={isLoading}>
        Submit
      </Button>
    </Box>
  );
}
