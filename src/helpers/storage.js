const SESSION_KEYS = ['user', 'userName', 'userId', 'dbOptions'];

export const getSessionItems = () => {
  const sessionStorage = {};

  SESSION_KEYS.forEach((key) => {
    const sessionItem = sessionStorage.getItem(key);
    sessionStorage[key] = sessionItem ? JSON.parse(sessionItem) : null;
  });

  return sessionStorage;
};

export const getSessionItem = (key) => {
  const sessionItem = sessionStorage.getItem(key);

  return sessionItem ? JSON.parse(sessionItem) : null;
};

export const setSessionItem = (key, data) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

export const setUserSession = (data) => setSessionItem('user', data);
export const getUserSession = () => getSessionItem('user');

export const clearSession = () => {
  sessionStorage.clear();
};

export const removeSessionItem = (key) => {
  sessionStorage.removeItem(key);
};