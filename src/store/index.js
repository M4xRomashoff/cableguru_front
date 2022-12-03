import React, { useContext, useMemo, useState } from 'react';
import initialUserStore from './userStore';
import { MODAL_STORE_NAME, TABLE_STORE_NAME, USER_STORE_NAME } from './storeName';
import initialTableStore from './tableStore';
import initialModalStore from './modalStore';
import { clearSession } from '../helpers/storage';

const StoreContext = React.createContext();

export const initialStore = {
  user: initialUserStore,
  table: initialTableStore,
  modal: initialModalStore,
};

// Global store
export function Store({ children }) {
  const [store, setStore] = useState(initialStore);

  const value = useMemo(() => ({ store, setStore }), [store]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = (storeName) => {
  const { store, setStore } = useContext(StoreContext);

  const changeStore = (newStoreValue) => {
    setStore((prevStore) => (({
      ...prevStore,
      [storeName]: {
        ...prevStore[storeName],
        ...newStoreValue,
      },
    })));
  };

  return {
    [`${storeName}Store`]: store[storeName],
    [`set${storeName[0].toUpperCase()}${storeName.slice(1)}Store`]: changeStore,
  };
};

export default StoreContext;

export const useUserStore = () => useStore(USER_STORE_NAME);
export const useTableStore = () => useStore(TABLE_STORE_NAME);
export const useModalStore = () => useStore(MODAL_STORE_NAME);

export const useLogoutStore = () => {
  const { setStore } = useContext(StoreContext);

  return () => {
    clearSession();
    setStore(initialStore);
  };
};
