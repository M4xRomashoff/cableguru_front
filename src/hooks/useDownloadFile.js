import { useState } from 'react';
import { downloadBlobFileOnClick } from '../helpers';
import { API } from '../api/api';
import useApi from './useApi';

export const useDownloadFile = ({ url, fileName, setLoading }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { makeRequest } = useApi({
    setIsLoading: setLoading || setIsLoading,
    request: async (prop = {}) => {
      const { data } = await API({ url: url || prop.url, responseType: 'blob' });
      downloadBlobFileOnClick(data, fileName);
    },
  });

  return { makeRequest, isLoading };
};
