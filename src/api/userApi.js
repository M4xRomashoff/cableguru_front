import { API } from './api';
import { getUserSession } from '../helpers/storage';

export async function loginUserRequest(data) {
  return API({
    url: '/users/login',
    method: 'POST',
    data,
  }).then(({ data }) => data);
}

export async function getUsersRequest() {
  return API.get('/users').then(({ data }) => data);
}

export async function createUserRequest(userData) {
  return API({
    url: '/users',
    method: 'POST',
    data: userData,
  }).then(({ data }) => data);
}

export async function refreshTokenRequest() {
  return API({
    method: 'POST',
    url: '/users/refresh-token',
    data: { refreshToken: getUserSession().refreshToken },
  }).then(({ data }) => data);
}

export async function getUserDbRequest(userId) {
  console.log('getUserDbRequest(userId) ', userId);
  let url = `/users/${userId}/db`;
  let options = {
    url,
    data: { userId },
  };
  let response = await API(options);
  console.log('response', response);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';
  if (responseOK) {
    return await response.data;
  }
}

export async function deleteUserRequest(userId) {
  return API({
    url: `/users/${userId}`,
    method: 'DELETE',
  }).then(({ data }) => data);
}
