import React, { useEffect, useState } from 'react';
import './styles/App.css';
import MyMapContainer from './my_map_container';
import Dashboard from './components/Dashboard/Dashboard';
import Preferences from './components/Preferences/Preferences';
import Login from './components/Login/Login';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getUserSession, setSessionItem } from './helpers/storage';
import Header from './components/Header';
import { useUserStore } from './store';
import ModalDelete from './components/Modals/ModalDelete';
import langPackRu from './assets/ru.json';
import langPackEn from './assets/en.json';


let userLang = navigator.language ;
let langDefault = langPackEn;

if (userLang.slice(0,2)==='en') {
  setSessionItem('lang','en');
  langDefault=langPackEn;

}
if (userLang.slice(0,2)==='ru') {
  setSessionItem('lang','ru');
  langDefault=langPackRu

}


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
  const [menuLabel, setMenuLabel] = useState();
  const [documents, setDocuments] = useState(false);
  const [l,setL]=useState(langDefault);
  const [locateMe, setLocateMe]=useState(false);
  const [contact, setContact]=useState(false);




  React.useEffect(() => {
    let userLang = navigator.language || navigator.userLanguage;
    console.log('userLang',userLang);

    if (userLang.split(0,2)==='en') {
      setSessionItem('lang','ru');
      setL(langPackRu);

    }
    if (userLang.split(0,2)==='ru') {
      setSessionItem('lang','ru');
      setL(langPackRu);
    }

    setMenuLabel(l.Control_Panel);

  }, [l]);



  return (
    <div className="App">
      <BrowserRouter>
        <ModalDelete />
        <Redirect setUserStore={setUserStore} userStore={userStore} />
        {userStore.id && (
          <Header
            setContact={setContact}
            setLocateMe={setLocateMe}
            l={l}
            setL={setL}
            setDocuments={setDocuments}
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
          <Route path="/" element={<Home setMenuLabel={setMenuLabel}   l={l}/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route
            path="/map"
            element={
              <MyMapContainer
                setContact={setContact}
                contact={contact}
                locateMe={locateMe}
                setLocateMe={setLocateMe}
                l={l}
                documents={documents}
                setDocuments={setDocuments}
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
