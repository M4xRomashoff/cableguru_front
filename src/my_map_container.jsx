import React, { useState, useRef, useEffect, useMemo } from 'react';
import MyMap from './my_map';
import MyData from './my_data';
import { getDataCableRequest, getDataSpRequest, getDataTpRequest, getConnections, getProjectOpitons } from './api/dataBasesApi';
import { setSessionItem } from './helpers/storage';
import LossAndBudgetModal from './components/Modals/LossBudgetModal';
import SettingsModal from './components/Modals/SettingsModal';
import SearchModal from './components/Modals/SearchModal';
import PrintModal from './components/Modals/PrintModal';
import HistoryModal from './components/Modals/HistoryModal';
import DocumentsModal from './components/Modals/DocumentsModal';

let centerDefault = [51.515, -0.09];

function MyMapContainer({ setLocateMe, locateMe, l, documents, setDocuments, lb, setLb, setSetting, settings, search, setSearch, print, setPrint, history, setHistory, setTraceIsOpen, setRouteDetailsIsOpen, traceIsOpen, routeDetailsIsOpen }) {
  const [center, setCenter] = useState([]);
  const [readySp, setReadySp] = useState(false);
  const [readyTp, setReadyTp] = useState(false);
  const [readyCon, setReadyCon] = useState(false);
  const [readyCab, setReadyCab] = useState(false);
  const [markersSP, setMarkersSP] = useState([]);
  const [markersTP, setMarkersTP] = useState([]);
  const [cables, setCables] = useState([]);
  const [trace, setTrace] = useState([]);
  const [map, setMap] = useState(false);
  const [connections, setConnections] = useState([]);

  const loadConnections = async () => {
    let connections = await getConnections();
    setConnections(connections);
    setSessionItem('connections', connections);
    setReadyCon(true);
  };

  const loadMarkersSp = async () => {
    let markersSP = await getDataSpRequest().then((points) =>
      points.map((point) => ({
        position: [point.latitude, point.longitude],
        id: point.id,
        icon: point.current_status,
        name_id: point.name_id,
        mfg: point.mfg,
        model: point.model,
        capacity: point.capacity,
        spl_type: point.spl_type,
        mount: point.mount,
        address: point.address,
        birthday: point.birthday,
        last_update: point.last_update,
        owner: point.owner,
        state: point.current_status,
      })),
    );
    setMarkersSP(markersSP);

    if (markersSP?.length > 0) {
      let centerCalc = getCenter(markersSP);
      setCenter(centerCalc);
    } else setCenter(centerDefault);

    setReadySp(true);
  };

  const loadMarkersTp = async () => {
    let markersTP = await getDataTpRequest().then((points) =>
      points.map((point) => ({
        position: [point.latitude, point.longitude],
        id: point.id,
        icon: point.current_status,
        name_id: point.name_id,
        mfg: point.mfg,
        model: point.model,
        capacity: point.capacity,
        connector: point.connector,
        address: point.address,
        access: point.access,
        birthday: point.birthday,
        last_update: point.last_update,
        owner: point.owner,
        state: point.current_status,
      })),
    );
    setMarkersTP(markersTP);
    setReadyTp(true);
  };

  const loadCables = async () => {
    let cables = await getDataCableRequest().then((items) =>
      items.map((item) => ({
        id: item.id,
        name_id: item.name_id,
        mfg: item.mfg,
        model: item.model,
        capacity: item.capacity,
        f_type: item.f_type,
        p_type: item.p_type,
        c_type: item.c_type,
        birthday: item.birthday,
        last_update: item.last_update,
        points: item.points,
        owner: item.owner,
        state: item.current_status,
      })),
    );
    setCables(cables);
    setReadyCab(true);
  };

  const loadProjectOptions = async () => {
    const _data = await getProjectOpitons().then((data) => {
      const coefficient = parseFloat(data[0]?.coefficient);
      const connectorLoss = parseFloat(data[0]?.connectorLoss);
      const att1310 = parseFloat(data[0]?.att1310);
      const att1550 = parseFloat(data[0]?.att1550);
      const spliceLoss = parseFloat(data[0]?.spliceLoss);
      setSessionItem('projectOptions', { coefficient: coefficient, connectorLoss: connectorLoss, spliceLoss: spliceLoss, att1310: att1310, att1550: att1550 });
    });
  };

  useEffect(() => {
    loadProjectOptions();
    loadMarkersSp();
    loadMarkersTp();
    loadCables();
    loadConnections();
  }, []);

  function getCenter(markersSP) {
    let lat = 0;
    let lng = 0;
    let latArr = [];
    let lngArr = [];

    markersSP.map((item) => {
      latArr.push(item.position[0]);
      lngArr.push(item.position[1]);
    });

    let maxLat = Math.max.apply(null, latArr);
    let maxLng = Math.max.apply(null, lngArr);
    let minLat = Math.min.apply(null, latArr);
    let minLng = Math.min.apply(null, lngArr);

    lat = maxLat - (maxLat - minLat) / 2;
    lng = maxLng - (maxLng - minLng) / 2;
    return [lat, lng];
  }

  const onCloseLossAndBudgetModal = () => {
    setLb(false);
  };
  const onCloseSettingsModal = () => {
    setSetting(false);
  };
  const onCloseSearchModal = () => {
    setSearch(false);
  };
  const onClosePrintModal = () => {
    setPrint(false);
  };
  const onCloseHistoryModal = () => {
    setHistory(false);
  };
  const onCloseDocumentsModal = () => {
    setDocuments(false);
  };
  return (
    <div>
      {lb && <LossAndBudgetModal l={l} lb={lb} setLb={setLb} onClose={onCloseLossAndBudgetModal} markersTp={markersTP} markersSp={markersSP} />}
      {settings && <SettingsModal l={l} onClose={onCloseSettingsModal} />}
      {search && <SearchModal l={l} onClose={onCloseSearchModal} markersSp={markersSP} markersTp={markersTP} map={map} />}
      {print && <PrintModal l={l} onClose={onClosePrintModal} markersSp={markersSP} markersTp={markersTP} map={map} />}
      {history && <HistoryModal l={l} onClose={onCloseHistoryModal} markersSp={markersSP} markersTp={markersTP} map={map} />}
      {documents && <DocumentsModal l={l} onClose={onCloseDocumentsModal}  />}

      <MyData />
      {readyCab && readyCon && readyTp && readySp && (
        <MyMap
          locateMe={locateMe}
          setLocateMe={setLocateMe}
          l={l}
          traceIsOpen={traceIsOpen}
          routeDetailsIsOpen={routeDetailsIsOpen}
          setRouteDetailsIsOpen={setRouteDetailsIsOpen}
          setTraceIsOpen={setTraceIsOpen}
          trace={trace}
          setTrace={setTrace}
          center={center}
          connections={connections}
          setConnections={setConnections}
          loadConnections={loadConnections}
          markersSP={markersSP}
          setMarkersSP={setMarkersSP}
          loadMarkersSp={loadMarkersSp}
          setMap={setMap}
          map={map}
          markersTP={markersTP}
          setMarkersTP={setMarkersTP}
          loadMarkersTp={loadMarkersTp}
          setCables={setCables}
          cables={cables}
          loadCables={loadCables}
        />
      )}
    </div>
  );
}

export default MyMapContainer;
