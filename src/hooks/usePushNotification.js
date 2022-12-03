import { useSnackbar } from 'notistack';

export const usePushNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  return ({
    message,
    variant = 'error',
    autoHideDuration = 5000,
    vertical = 'top',
    horizontal = 'center',
  }) => enqueueSnackbar(
    message,
    {
      anchorOrigin: { vertical, horizontal },
      preventDuplicate: true,
      variant,
      autoHideDuration,
    },
  );
};
