import { useState } from 'react';
import { getUserSession, setUserSession } from '../helpers/storage';

const getUser = () => {
  const sessionUser = getUserSession();

  if (typeof sessionUser?.accessToken === 'string') return sessionUser.accessToken;
};

export default function useUser() {
  const [user, setUser] = useState(getUser());

  const saveUser = data => {
    setUserSession(data)
    setUser(data);
  };

  return { setUser: saveUser, user };
}