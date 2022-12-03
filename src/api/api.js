/* eslint-disable */
import axios from 'axios';
import { getUserSession, setUserSession } from '../helpers/storage';
import { refreshTokenRequest } from './userApi';

export const API = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
  headers: { 'Content-Type': 'application/json' },
});

export const API_multipart = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
  headers: { 'Content-Type': 'multipart/form-data' },
});

API.interceptors.request.use(
  (config) => {
    const sessionUser = getUserSession();

    if (typeof sessionUser?.accessToken === 'string') config.headers.Authorization = sessionUser.accessToken;

    return config;
  },
  (error) => Promise.reject(error),
);

API_multipart.interceptors.request.use(
  (config) => {
    const sessionUser = getUserSession();

    if (typeof sessionUser?.accessToken === 'string') config.headers.Authorization = sessionUser.accessToken;

    return config;
  },
  (error) => Promise.reject(error),
);
let refreshPromise;

API.interceptors.response.use(
  (res) => {
    const newTokens = res?.headers?.authorization;

    if (newTokens) {
      const previousSessionUser = getUserSession();
      setUserSession({
        ...previousSessionUser,
        ...newTokens,
      });
    }

    return res;
  },
  async (err) => {
    console.error(err);
    if (err?.response?.data?.token === 'jwt expired') {
      const originalRequest = err.config;

      try {
        let freshUser;

        if (refreshPromise) {
          freshUser = await refreshPromise;
          refreshPromise = undefined;
        } else {
          refreshPromise = new Promise((resolve) => {
            refreshTokenRequest().then((user) => {
              freshUser = user;

              resolve(user);
            });
          });

          await refreshPromise;
        }

        setUserSession(freshUser);

        axios.defaults.headers.common['Authorization'] = 'Bearer ' + freshUser.accessToken;

        return API(originalRequest);
      } catch (e) {
        err.logout = true;
      }
    }

    return Promise.reject(err);
  },
);

API_multipart.interceptors.response.use(
  (res) => {
    const newTokens = res?.headers?.authorization;

    if (newTokens) {
      const previousSessionUser = getUserSession();
      setUserSession({
        ...previousSessionUser,
        ...newTokens,
      });
    }

    return res;
  },
  async (err) => {
    console.error(err);
    if (err?.response?.data?.token === 'jwt expired') {
      const originalRequest = err.config;

      try {
        let freshUser;

        if (refreshPromise) {
          freshUser = await refreshPromise;
          refreshPromise = undefined;
        } else {
          refreshPromise = new Promise((resolve) => {
            refreshTokenRequest().then((user) => {
              freshUser = user;

              resolve(user);
            });
          });

          await refreshPromise;
        }

        setUserSession(freshUser);

        axios.defaults.headers.common['Authorization'] = 'Bearer ' + freshUser.accessToken;

        return API(originalRequest);
      } catch (e) {
        err.logout = true;
      }
    }

    return Promise.reject(err);
  },
);
