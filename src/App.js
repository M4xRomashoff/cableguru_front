import React, { useEffect, useState } from 'react';
import './styles/App.css';
import MyMapContainer from './my_map_container';
import Dashboard from './components/Dashboard/Dashboard';
import Preferences from './components/Preferences/Preferences';
import Login from './components/Login/Login';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getUserSession } from './helpers/storage';
import Header from './components/Header';
import { useUserStore } from './store';
import ModalDelete from './components/Modals/ModalDelete';

const Redirect = ({ userStore, setUserStore }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionUser = getUserSession();

    if (!sessionUser?.accessToken) {
      if (pathname !== '/login') navigate('/login');

      if (userStore) setUserStore({});
    } else {
      if (!userStore.id) setUserStore(sessionUser);
    }
  }, [pathname]);
};

function App() {
  const { userStore, setUserStore } = useUserStore();
  const [lb, setLb] = useState(false);
  const [settings, setSetting] = useState(false);
  const [search, setSearch] = useState(false);
  const [print, setPrint] = useState(false);
  const [history, setHistory] = useState(false);
  const [traceIsOpen, setTraceIsOpen] = useState(false);
  const [routeDetailsIsOpen, setRouteDetailsIsOpen] = useState(false);
  const [menuLabel, setMenuLabel] = useState('Home: Control Panel');

  return (
    <div className="App">
      <BrowserRouter>
        <ModalDelete />
        <Redirect setUserStore={setUserStore} userStore={userStore} />
        {userStore.id && (
          <Header
            setMenuLabel={setMenuLabel}
            menuLabel={menuLabel}
            setLb={setLb}
            setSetting={setSetting}
            setSearch={setSearch}
            setPrint={setPrint}
            setHistory={setHistory}
            setTraceIsOpen={setTraceIsOpen}
            setRouteDetailsIsOpen={setRouteDetailsIsOpen}
          />
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home setMenuLabel={setMenuLabel} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route
            path="/map"
            element={
              <MyMapContainer
                traceIsOpen={traceIsOpen}
                routeDetailsIsOpen={routeDetailsIsOpen}
                setRouteDetailsIsOpen={setRouteDetailsIsOpen}
                setTraceIsOpen={setTraceIsOpen}
                history={history}
                setHistory={setHistory}
                lb={lb}
                setLb={setLb}
                settings={settings}
                setSetting={setSetting}
                search={search}
                setSearch={setSearch}
                print={print}
                setPrint={setPrint}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
