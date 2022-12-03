import { useEffect, useState } from 'react';
import { usePushNotification } from './usePushNotification';
import { handleApiError } from '../helpers';
import { clearSession } from '../helpers/storage';

export default function useApi({ request, onError, setter, shouldRequest = false, params, successMessage }) {
  const pushNotification = usePushNotification();
  const [isLoading, setIsLoading] = useState(shouldRequest);

  const makeRequest = async (params) => {
    setIsLoading(true);
    let result;

    try {
      result = await request(params);
      if (setter) await setter(result);
      if (successMessage) pushNotification({ message: successMessage, variant: 'success' });
    } catch (e) {
      if (onError) onError(e);

      if (e?.frontendError) {
        pushNotification({ message: e?.frontendError });
      } else {
        if (e?.logout) {
          clearSession();
          window.location.reload();
        }

        const apiError = e?.response;

        handleApiError(apiError, pushNotification);
      }
    }
    setIsLoading(false);
    return result;
  };

  useEffect(() => {
    if (shouldRequest) {
      makeRequest(params);
    }
  }, [shouldRequest, params]);

  return { makeRequest, isLoading };
}