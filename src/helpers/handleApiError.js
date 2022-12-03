const translatedApiError = {
  user: 'User',
  users: 'Users',
  role: 'Role',
  roles: 'Roles',
  email: 'E-mail',
  login: 'Login',
  phone: 'Phone',
  password: 'Password',
  first_name: 'First name',
  last_name: 'Last name',
  middle_name: 'Middle name',
  name: 'Name',
  server: 'Server',
  token: 'Token',
  access: 'Access',
};

export const handleApiError = (error, pushNotification) => {
  const noResponseFromServer = error?.data === undefined;
  const isHtmlError = typeof error?.data === 'string';

  if (isHtmlError || noResponseFromServer || typeof error?.data?.error === 'string') {
    pushNotification({
      message: error?.data?.error
        || (noResponseFromServer ? 'No response from server' : 'Something went wrong'),
    });
    return;
  }

  const errorNames = Object.keys(error.data);

  errorNames.forEach((errorName) => {
    pushNotification({ message: [`${translatedApiError[errorName]} > ${error.data[errorName]}`] });
  });
};
