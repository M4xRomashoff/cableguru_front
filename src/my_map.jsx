import React, { useState } from 'react';
import { LayersControl, MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { getSessionItem } from './helpers/storage';
import AddComments from './components/AddComments';
import TraceFiber from './components/TraceFiber';
import FCS_edit from './components/sp/FCS_edit';
import FCS_Tp_edit from './components/tp/FCS_Tp_edit';
import {
  addCableItem,
  addSpItem,
  addTpItem,
  deleteCableItem,
  deleteSpItem,
  deleteTpItem,
  getSpData,
  getTpData,
  updateCableLatLng,
  updateConnections,
  updateConnectionsFix,
  updateSpLatLng,
  updateTpLatLng,
} from './api/dataBasesApi';
import useApi from './hooks/useApi';
import BackdropLoading from './components/BackdropLoading';
import './components/leaflet-draw-toolbar/leaflet.draw.css';
import { makeStyles } from '@material-ui/core';
import cursorMarkerSP from './components/icons/sp_slate.png'
import cursorMarkerTP from './components/icons/hub_slate.png'

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import PrepMarkerListSP from './components/sp/PrepMarkerListSP';
import PrepMarkerListTP from './components/tp/PrepMarkerListTP';

import AddMarkerSP from './components/sp/AddMarkerSP';
import AddMarkerTP from './components/tp/AddMarkerTP';
import PrepCablesList from './components/Cable/PrepCableList';
import Cable_edit from './components/Cable/cable_edit';
import CreateCableItem from './components/Cable/AddCableItem';
import ConnectionControl from './components/ConnectionControl';
import SpliceFibers from './components/SpliceFibers';
import SpliceFibersTp from './components/SpliceFibersTp';
import { getCablePointsFromString } from './helpers/getCablePointsFromString';
import PrepTracesList from './components/Traces/PrepTracesList';
import RouteDetails from './components/Traces/RouteDetails';
import './styles/customButton.css';
import PicturesModal from './components/Modals/PicturesModal';
import { logAddInfo } from './api/logFileApi';
import PortLabelsModal from './components/Modals/PortLabelsModal';
import ChangeSeqNumbersSp from './components/ChangeSeqNumbersSp';
import ChangeSeqNumbersTp from './components/ChangeSeqNumbersTp';

function convertToString(points) {
  let text = '';
  let subItem = '';
  points.map((item) => {
    subItem = item.lat.toString() + ',' + item.lng.toString() + ' ';
    text = text + subItem;
  });
  return text;
}

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function isIn(arr, item) {
  let flag = false;
  arr.map((i) => {
    if (item.action === 'addPoint' || item.action === 'removePoint') {
      if (i.shapeType === item.shapeType && i.id === item.id && i.action === item.action && i.point === item.point && i.layer_latlngs === item.layer_latlngs) flag = true;
    } else if (i.shapeType === item.shapeType && i.id === item.id && i.action === item.action) flag = true;
  });
  return flag;
}

function isInRemoveArr(rArr, item) {
  let flag = false;
  rArr.map((i) => {
    if (item.action === 'movePoint' && item.id === i.id) flag = true;
  });
  return flag;
}

function makeUnicArray(arr) {
  let unic = [];
  arr.map((item) => {
    if (!isIn(unic, item)) unic.push(item);
  });

  let newUnic = [];
  let removeArr = [];
  unic.map((item) => {
    if (item.action === 'removePoint' && item.layer_latlngs.length === 0) removeArr.push(item);
  });

  unic.map((item) => {
    if (!isInRemoveArr(removeArr, item)) newUnic.push(item);
  });

  return newUnic;
}

const useStyles = makeStyles((theme) => ({
  map: {
    height: `calc(90vh - 90px)`,
    width: '60%',
    zIndex: 0,
  },
  buttonWrapper: {
    zIndex: 1,
    position: 'absolute',
    bottom: theme.spacing(2),
    marginLeft: '30%',
    marginBottom: '8%',
    transform: 'translateX(-50%)',
  },
  headerWrapper: {
    zIndex: 1,
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
}));
//--------------------------------------------------------------------------------------------------MyMap---------------

const MyMap = ({
  setTraceIsOpen,
  routeDetailsIsOpen,
  setRouteDetailsIsOpen,
  traceIsOpen,
  trace,
  setTrace,
  map,
  setMap,
  center,
  connections,
  setConnections,
  loadConnections,
  markersSP,
  setMarkersSP,
  loadMarkersSp,
  markersTP,
  setMarkersTP,
  loadMarkersTp,
  cables,
  setCables,
  loadCables,
}) => {
  const [centerHook, setCenterHook] = useState(center);

  const [pointInfo, setPointInfo] = useState({});
  const [connectionsPoint, setConnectionsPoint] = useState({});

  const [dataFcs, setDataFcs] = useState({ header: [], body: [], bodyFull: [] });
  const [dataFcsTp, setDataFcsTp] = useState({ header: [], body: [], bodyFull: [] });

  const [pointInfoFCS, setPointInfoFCS] = useState({});
  const [pointInfoFcsTp, setPointInfoFcsTp] = useState({});
  const [pointInfoCable, setPointInfoCable] = useState({});

  const [drawingCable, setDrawingCable] = useState(false);
  const [dragMode, setDragMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [spliceFibersPoint, setSpliceFibersPoint] = useState({});
  const [spliceFibersPointTp, setSpliceFibersPointTp] = useState({});
  const [changeSeqPoint, setChangeSeqPoint] = useState({});
  const [changeSeqPointTp, setChangeSeqPointTp] = useState({});

  const [spToLL, setSpToLL] = useState([]);
  const [tpToLL, setTpToLL] = useState([]);
  const [cableToLL, setCableToLL] = useState([]);

  const [picturesInfo, setPicturesInfo] = useState(false);
  const [portLabels, setPortLabels] = useState({});

  function getLayerBySpId(spId, myMap) {
    let _leaflet_id = 0;
    spToLL.map((item) => {
      if (item.spId === spId) _leaflet_id = item._leaflet_id;
    });
    const result = myMap._layers[_leaflet_id];
    return result;
  }

  function getLayerByTpId(tpId, myMap) {
    let _leaflet_id = 0;
    tpToLL.map((item) => {
      if (item.tpId === tpId) _leaflet_id = item._leaflet_id;
    });
    const result = myMap._layers[_leaflet_id];
    return result;
  }

  function getLayerByCableId(cableId, myMap) {
    let _leaflet_id = 0;
    cableToLL.map((item) => {
      if (item.cableId === cableId) _leaflet_id = item._leaflet_id;
    });
    const result = myMap._layers[_leaflet_id];
    return result;
  }

  async function updateAndSaveSpLatLng(newSpLatLng) {
    if (newSpLatLng.length === 0) return null;

    let cloneMarkerSp = markersSP.slice();
    newSpLatLng.map((newItem) => {
      cloneMarkerSp.map((item) => {
        if (item.id === newItem.id) {
          item.position = [newItem.latlng.lat, newItem.latlng.lng];
        }
      });
    });
    setMarkersSP(cloneMarkerSp);
    const result = await updateSpLatLng(newSpLatLng);
  }

  async function updateAndSaveTpLatLng(newTpLatLng) {
    if (newTpLatLng.length === 0) return null;

    let cloneMarkerTp = markersTP.slice();
    newTpLatLng.map((newItem) => {
      cloneMarkerTp.map((item) => {
        if (item.id === newItem.id) {
          item.position = [newItem.latlng.lat, newItem.latlng.lng];
        }
      });
    });
    setMarkersTP(cloneMarkerTp);
    const result = await updateTpLatLng(newTpLatLng);
  }

  async function updateAndSaveCableLatLng(newCableLatLngs) {
    if (newCableLatLngs.length === 0) return null;

    let cloneCables = cables.slice();
    newCableLatLngs.map((newItem) => {
      cloneCables.map((item) => {
        if (item.id === newItem.id) {
          item.points = convertToString(newItem.latlngs);
        }
      });
    });
    setCables(cloneCables);
    const result = await updateCableLatLng(newCableLatLngs);
    loadCables();
  }

  async function updateAndSaveConnectionsPoints(itemsToUpdate) {
    if (itemsToUpdate.length === 0) return null;
    const itemsToFix = [];
    let newConnections = connections.slice();

    itemsToUpdate.map((newItem) => {
      if (newItem.layerLatLng.length === 0)
        itemsToFix.push({
          cabId: newItem.cabId,
          action: 'delete cable',
        });
      else
        itemsToFix.push({
          cabId: newItem.cabId,
          action: 'remove point',
          latlngs: newItem.layerLatLng,
        });
    });

    if (itemsToFix.length > 0) {
      const resultFix = await updateConnectionsFix(itemsToFix);
      await loadConnections();
    }

    newConnections = connections.slice();
    itemsToUpdate.map((newItem) => {
      newConnections.map((item) => {
        if (newItem.cabId === item.cab_id) {
          if (newItem.point <= item.point && newItem.action === 'add') item.point = item.point + 1;
        }
      });
    });

    const result = await updateConnections(newConnections, itemsToUpdate);
    await loadConnections();
  }

  function saveChanges(changeRaw, map) {
    const change = makeUnicArray(changeRaw);
    if (change.length === 0) return null;
    const newSpLatLng = [];
    const newTpLatLng = [];
    const newCableLatLngs = [];
    const updateConnectionsId = [];
    change.map((item) => {
      //---------------- ADD POINT -----------------------------------------------
      if (item.action === 'addPoint') {
        updateConnectionsId.push({ cabId: item.id, point: item.point, action: 'add', layerLatLng: item.layer_latlngs });
      }
      //---------------- REMOVE POINT -----------------------------------------------
      if (item.action === 'removePoint') {
        updateConnectionsId.push({
          cabId: item.id,
          point: item.point,
          action: 'remove',
          layerLatLng: item.layer_latlngs,
        });
      }

      //---------------- DRAG, MOVE POINT -----------------------------------------------
      if (item.action === 'drag' || item.action === 'movePoint') {
        if (item.shapeType === 'sp') {
          const layerSp = getLayerBySpId(item.id, map);
          newSpLatLng.push({ id: item.id, latlng: layerSp._latlng });
        }
        if (item.shapeType === 'tp') {
          const layerTp = getLayerByTpId(item.id, map);
          newTpLatLng.push({ id: item.id, latlng: layerTp._latlng });
        }
        if (item.shapeType === 'cable') {
          const layerCable = getLayerByCableId(item.id, map);
          newCableLatLngs.push({ id: item.id, latlngs: layerCable._latlngs });
        }
      }
      //----------------DELETE-----------------------------------------------
      if (item.action === 'delete') {
        if (item.shapeType === 'sp') {
          const response = removeSpFromMarkers(item.id);
        }
        if (item.shapeType === 'tp') {
          const response = removeTpFromMarkers(item.id);
        }
        if (item.shapeType === 'cable') {
          const response = removeFromCables(item.id);
        }
      }
    });

    updateAndSaveConnectionsPoints(updateConnectionsId);
    updateAndSaveSpLatLng(newSpLatLng);
    updateAndSaveTpLatLng(newTpLatLng);
    updateAndSaveCableLatLng(newCableLatLngs);
  }

  function getCablesAndPoints(id, type) {
    const connections = getSessionItem('connections');
    const conList = [];
    if (type === 'sp') {
      connections.map((item) => {
        if (item.sp_id === id) conList.push(item);
      });
    }
    if (type === 'tp') {
      connections.map((item) => {
        if (item.tp_id === id) conList.push(item);
      });
    }
    return conList;
  }

  function updateCables(cabAndPoint, newLatLng, cables) {
    let newCables = cables.slice();
    cabAndPoint.map((cItem) => {
      newCables.map((item) => {
        if (item.id === cItem.cab_id) {
          let points = getCablePointsFromString(item.points);
          points[cItem.point] = { lat: newLatLng.lat, lng: newLatLng.lng };
          item.points = convertToString(points);
        }
      });
    });
    setCables(newCables);
  }

  async function removeSpFromMarkers(spId) {
    let cloneMarkerSp = markersSP.slice();
    cloneMarkerSp = cloneMarkerSp.filter((item) => item.id !== spId);
    setMarkersSP(cloneMarkerSp);
    const result = await deleteSpItem(spId);
    loadConnections();
  }

  async function removeTpFromMarkers(tpId) {
    let cloneMarkerTp = markersTP.slice();
    cloneMarkerTp = cloneMarkerTp.filter((item) => item.id !== tpId);
    setMarkersTP(cloneMarkerTp);
    const result = await deleteTpItem(tpId);
    loadConnections();
  }

  async function removeFromCables(cableId) {
    let cloneCables = cables.slice();
    cloneCables = cloneCables.filter((item) => item.id !== cableId);
    setCables(cloneCables);
    const result = await deleteCableItem(cableId);
    loadConnections();
  }

  const whenMapReady = ({ target: mapInstance }) => {
    const map = mapInstance;
    let changeArr = [];
    setMap(mapInstance);

    map.pm.setGlobalOptions({ cursorMarker: false, templineStyle: { color: 'red' }, continueDrawing: false });

    map.on('pm:drawstart', (e) => {
      console.log('e',e);
      if (e.shape === 'SP') {e.workingLayer._icon.src = cursorMarkerSP;
      e.workingLayer._icon.style="margin-left: -12px; margin-top: -41px; width: 25px; height: 25px; transform: translate3d(641px, 188px, 0px); z-index: 188;"}

      if (e.shape === 'TP') {e.workingLayer._icon.src = cursorMarkerTP;
        e.workingLayer._icon.style="margin-left: -12px; margin-top: -41px; width: 30px; height: 20px; transform: translate3d(641px, 188px, 0px); z-index: 188;"}

      setDrawingCable(true);
    });

    map.on('pm:drawend', (e) => {
      setDrawingCable(false);
    });

    map.on('pm:globalremovalmodetoggled', (e) => {
      if (e.enabled === true) setDeleteMode(true);
      if (e.enabled === false) setDeleteMode(false);
      saveChanges(changeArr, map);
      changeArr = [];
    });

    map.on('pm:globaleditmodetoggled', (e) => {
      if (e.enabled === true) setEditMode(true);
      if (e.enabled === false) setEditMode(false);
      saveChanges(changeArr, map);
      changeArr = [];
    });

    map.on('pm:globaldragmodetoggled', (e) => {
      if (e.enabled === true) setDragMode(true);
      if (e.enabled === false) setDragMode(false);
      saveChanges(changeArr, map);
      changeArr = [];
    });

    map.on('pm:remove', (e) => {
      if (e.layer.options.spId) changeArr.push({ shapeType: 'sp', id: e.layer.options.spId, action: 'delete' });
      if (e.layer.options.tpId) changeArr.push({ shapeType: 'tp', id: e.layer.options.tpId, action: 'delete' });
      if (e.layer.options.cableId) changeArr.push({
        shapeType: 'cable',
        id: e.layer.options.cableId,
        action: 'delete',
      });
    });

    map.on('layeradd', ({ layer }) => {
      if (layer.options?.spId) spToLL.push({ spId: layer.options?.spId, _leaflet_id: layer._leaflet_id });
      if (layer.options?.tpId) tpToLL.push({ tpId: layer.options?.tpId, _leaflet_id: layer._leaflet_id });
      if (layer.options?.cableId) {
        cableToLL.push({ cableId: layer.options?.cableId, _leaflet_id: layer._leaflet_id });
        layer.on('pm:vertexadded', (e) => {
          changeArr.push({
            shapeType: 'cable',
            id: e.layer.options.cableId,
            action: 'addPoint',
            point: e.indexPath[0],
            layer_latlngs: e.layer._latlngs,
          });
        });
        layer.on('pm:vertexremoved', (e) => {
          changeArr.push({
            shapeType: 'cable',
            id: e.layer.options.cableId,
            action: 'removePoint',
            point: e.indexPath[0],
            layer_latlngs: e.layer._latlngs,
          });
        });
      }

      layer.on('pm:edit', (e) => {
        if (e.layer.options.spId) changeArr.push({ shapeType: 'sp', id: e.layer.options.spId, action: 'movePoint' });
        if (e.layer.options.tpId) changeArr.push({ shapeType: 'tp', id: e.layer.options.tpId, action: 'movePoint' });
        if (e.layer.options.cableId) changeArr.push({
          shapeType: 'cable',
          id: e.layer.options.cableId,
          action: 'movePoint',
        });
      });

      layer.on('pm:change', (e) => {
        if (e.layer.options.spId) {
          const newLatLng = e.layer._latlng;
          const spId = e.layer.options.spId;
          const cablesAndPoints = getCablesAndPoints(spId, 'sp');
          if (cablesAndPoints.length > 0) {
            updateCables(cablesAndPoints, newLatLng, cables);
          }
        }
        if (e.layer.options.tpId) {
          const newLatLng = e.layer._latlng;
          const tpId = e.layer.options.tpId;
          const cablesAndPoints = getCablesAndPoints(tpId, 'tp');
          if (cablesAndPoints.length > 0) {
            updateCables(cablesAndPoints, newLatLng, cables);
          }
        }
      });
      layer.on('pm:dragend', (e) => {
        if (e.layer.options.spId) {
          const newLatLng = e.layer._latlng;
          const spId = e.layer.options.spId;
          const cablesAndPoints = getCablesAndPoints(spId, 'sp');
          if (cablesAndPoints.length > 0) {
            updateCables(cablesAndPoints, newLatLng, cables);
            cablesAndPoints.map((item) => {
              changeArr.push({ shapeType: 'cable', id: item.cab_id, action: 'movePoint' });
            });
            changeArr.push({ shapeType: 'sp', id: e.layer.options.spId, action: 'movePoint' });
          }
        }
        if (e.layer.options.tpId) {
          const newLatLng = e.layer._latlng;
          const tpId = e.layer.options.tpId;
          const cablesAndPoints = getCablesAndPoints(tpId, 'tp');
          if (cablesAndPoints.length > 0) {
            updateCables(cablesAndPoints, newLatLng, cables);
            cablesAndPoints.map((item) => {
              changeArr.push({ shapeType: 'cable', id: item.cab_id, action: 'movePoint' });
            });
            changeArr.push({ shapeType: 'tp', id: e.layer.options.tpId, action: 'movePoint' });
          }
        }
      });
    });

    map.pm.Toolbar.copyDrawControl('Marker', {
      name: 'SP',
      block: 'custom',
      title: 'Add New Splice Point',
      actions: ['cancel'],
      className: 'icoSplice',
    });
    map.pm.Toolbar.copyDrawControl('Marker', {
      name: 'TP',
      block: 'custom',
      title: 'Add New Termination Point',
      actions: ['cancel'],
      className: 'ico',
    });
    map.pm.Toolbar.copyDrawControl('Line', {
      name: 'Cable',
      block: 'custom',
      title: 'Add New Cable',
      actions: ['cancel'],
    });

    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: false,
      rotateMode: false,
      cutPolygon: false,
      drawCircleMarker: false,
      drawRectangle: false,
      drawPolyline: false,
      drawText: false,
      drawPolygon: false,
    });
    map.pm.Toolbar.changeControlOrder(['SP', 'TP', 'Cable', 'editMode', 'dragMode', 'removalMode']);

    map.on('pm:create', async (e) => {
      if (e.shape === 'SP') {
        const newMarker = AddMarkerSP(e.layer._latlng);
        await addSpItem(newMarker);
        logAddInfo(newMarker.name_id, 'Splice Point Added', 'new');

        mapInstance.removeLayer(e.marker);
        loadMarkersSp();
      }
      if (e.shape === 'TP') {
        const newMarker = AddMarkerTP(e.layer._latlng);
        await addTpItem(newMarker);
        logAddInfo(newMarker.name_id, 'Splice Point Added', 'new');
        mapInstance.removeLayer(e.marker);
        loadMarkersTp();
      }
      if (e.shape === 'Cable') {
        const newMarker = CreateCableItem(e.layer._latlngs);
        await addCableItem(newMarker);
        logAddInfo(newMarker.name_id, 'Splice Point Added', 'new');
        mapInstance.removeLayer(e.marker);
        loadCables();
      }
    });

    if (setMap) {
      setMap(mapInstance);
    }
  };

  const { isLoading: isSpLoading, makeRequest: getSpDataRequest } = useApi({
    request: () => getSpData(pointInfoFCS.id),
    setter: (data) => {
      setDataFcs(data);
    },
    shouldRequest: Boolean(pointInfoFCS.id),
  });
  const { isLoadingTp: isTpLoading, makeRequest: getTpDataRequest } = useApi({
    request: () => getTpData(pointInfoFcsTp.id),
    setter: (data) => {
      setDataFcsTp(data);
    },
    shouldRequest: Boolean(pointInfoFcsTp.id),
  });

  const onCloseComment = () => {
    setPointInfo({});
  };
  const onCloseFcs = () => {
    setPointInfoFCS({});
    setDataFcs({ header: [], body: [], bodyFull: [] });
  };
  const onCloseFcsTp = () => {
    setPointInfoFcsTp({});
    setDataFcsTp({ header: [], body: [], bodyFull: [] });
  };
  const onCloseFcsC = () => {
    setPointInfoCable({});
  };
  const onCloseConnections = () => {
    setConnectionsPoint({});
  };
  const onCloseSpliceFibers = () => {
    setSpliceFibersPoint({});
  };
  const onCloseSpliceFibersTp = () => {
    setSpliceFibersPointTp({});
  };
  const onCloseTraceFiber = () => {
    setTraceIsOpen(false);
  };
  const onCloseRouteDetails = () => {
    setRouteDetailsIsOpen(false);
  };
  const onClosePictures = () => {
    setPicturesInfo(false);
  };

  const onClosePortLabels = () => {
    setPortLabels({});
  };

  const onCloseChangeSeq = () => {
    setChangeSeqPoint({});
  };
  const onCloseChangeSeqTp = () => {
    setChangeSeqPointTp({});
  };

  const project = getSessionItem('project');
  let userAccessLevel = 0;
  const userAccessLevelTemp = getSessionItem('user');
  if (userAccessLevelTemp !== null) userAccessLevel = userAccessLevelTemp.access_level;

  function onClickTraceFiber() {
    setTraceIsOpen(true);
  }

  function onClickRouteDetails() {
    setRouteDetailsIsOpen(true);
  }

  function onClickTestButton() {
    setPicturesInfo({ id: 10, name_id: 'stuff' });
  }

  function updateState(type, id, state) {
    if (type === 'sp') {
      let cloneSp = markersSP.slice();
      for (let i = 0; i < cloneSp.length; i++) {
        if (cloneSp[i].id === id) {
          cloneSp[i].state = state;
          setMarkersSP(cloneSp);
          break;
        }
      }
    }
    if (type === 'tp') {
      let cloneTp = markersTP.slice();
      for (let i = 0; i < cloneTp.length; i++) {
        if (cloneTp[i].id === id) {
          cloneTp[i].state = state;
          setMarkersTP(cloneTp);
          break;
        }
      }
    }
  }

  return (
    <div>
      <BackdropLoading isLoading={isSpLoading || isTpLoading} />
      {portLabels.id &&
        <PortLabelsModal onClose={onClosePortLabels} portLabels={portLabels} getTpDataRequest={getTpDataRequest} />}
      {routeDetailsIsOpen && <RouteDetails
        trace={trace}
        setTrace={setTrace}
        onClose={onCloseRouteDetails}
        markersSp={markersSP}
        markersTp={markersTP}
        cables={cables}
      />}
      {traceIsOpen &&
        <TraceFiber trace={trace} setTrace={setTrace} onClose={onCloseTraceFiber} markersTp={markersTP} />}
      {pointInfo.id && <AddComments onClose={onCloseComment} nameId={pointInfo.name_id} />}
      {picturesInfo && <PicturesModal onClose={onClosePictures} picturesInfo={picturesInfo} />}
      {spliceFibersPointTp.id && (
        <SpliceFibersTp
          dataFcs={dataFcsTp}
          updateState={updateState}
          connections={connections}
          onClose={onCloseSpliceFibersTp}
          getTpDataRequest={getTpDataRequest}
          cables={cables}
          spliceFibersPointTp={spliceFibersPointTp}
        />
      )}
      {spliceFibersPoint.id && (
        <SpliceFibers
          dataFcs={dataFcs}
          updateState={updateState}
          connections={connections}
          onClose={onCloseSpliceFibers}
          getSpDataRequest={getSpDataRequest}
          cables={cables}
          spliceFibersPoint={spliceFibersPoint}
        />
      )}
      {changeSeqPoint.id && (
        <ChangeSeqNumbersSp
          dataFcs={dataFcs}
          connections={connections}
          onClose={onCloseChangeSeq}
          getSpDataRequest={getSpDataRequest}
          cables={cables}
          changeSeqPoint={changeSeqPoint}
        />
      )}
      {changeSeqPointTp.id && (
        <ChangeSeqNumbersTp
          dataFcs={dataFcsTp}
          connections={connections}
          onClose={onCloseChangeSeqTp}
          getTpDataRequest={getTpDataRequest}
          cables={cables}
          changeSeqPoint={changeSeqPointTp}
        />
      )}
      {connectionsPoint.id && (
        <ConnectionControl
          getSpDataRequest={getSpDataRequest}
          getTpDataRequest={getTpDataRequest}
          cables={cables}
          connections={connections}
          loadConnections={loadConnections}
          connectionsPoint={connectionsPoint}
          setConnectionsPoint={setConnectionsPoint}
          onClose={onCloseConnections}
          setDataFcs={setDataFcs}
          setDataFcsTp={setDataFcsTp}
          updateState={updateState}
        />
      )}

      {userAccessLevel >= 70 && Boolean(dataFcs.body.length) && (
        <FCS_edit
          setChangeSeqPoint={setChangeSeqPoint}
          setPicturesInfo={setPicturesInfo}
          setPointInfo={setPointInfo}
          loadMarkersSp={loadMarkersSp}
          onClose={onCloseFcs}
          pointInfoFCS={pointInfoFCS}
          dataFcs={dataFcs}
          markers={markersSP}
          setMarkersSp={setMarkersSP}
          setConnectionsPoint={setConnectionsPoint}
          setSpliceFibersPoint={setSpliceFibersPoint}
        />
      )}
      {userAccessLevel >= 70 && Boolean(pointInfoCable.id) && (
        <Cable_edit
          setCables={setCables}
          loadConnections={loadConnections}
          setPointInfo={setPointInfo}
          loadCables={loadCables}
          onClose={onCloseFcsC}
          pointInfoCable={pointInfoCable}
          cables={cables}
        />
      )}
      {userAccessLevel >= 70 && Boolean(dataFcsTp.body.length) && (
        <FCS_Tp_edit
          setChangeSeqPointTp={setChangeSeqPointTp}
          setPortLabels={setPortLabels}
          setPicturesInfo={setPicturesInfo}
          setPointInfo={setPointInfo}
          loadMarkersTp={loadMarkersTp}
          onClose={onCloseFcsTp}
          pointInfoFCS={pointInfoFcsTp}
          dataFcs={dataFcsTp}
          markers={markersTP}
          setMarkersTp={setMarkersTP}
          setConnectionsPoint={setConnectionsPoint}
          setSpliceFibersPointTp={setSpliceFibersPointTp}
        />
      )}

      <MapContainer
        center={centerHook}
        zoom={13}
        maxZoom={22}
        maxNativeZoom={19}
        scrollWheelZoom={true}
        whenReady={whenMapReady}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          maxZoom={22}
          maxNativeZoom={19}
        />

        <LayersControl position='topright'>
          <LayersControl.Overlay checked name='SP'>
            {Boolean(markersSP !== []) && (
              <PrepMarkerListSP
                editMode={editMode}
                deleteMode={deleteMode}
                dragMode={dragMode}
                drawingCable={drawingCable}
                setPointInfoFCS={setPointInfoFCS}
                markers={markersSP}
              />
            )}
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name='TP'>
            {Boolean(markersTP !== []) && (
              <PrepMarkerListTP
                editMode={editMode}
                deleteMode={deleteMode}
                dragMode={dragMode}
                drawingCable={drawingCable}
                setPointInfoFCS={setPointInfoFcsTp}
                markers={markersTP}
              />
            )}
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name='Cables'>
            {Boolean(cables !== []) && (
              <PrepCablesList
                editMode={editMode}
                deleteMode={deleteMode}
                dragMode={dragMode}
                drawingCable={drawingCable}
                loadCables={loadCables}
                setPointInfo={setPointInfo}
                setPointInfoCable={setPointInfoCable}
                cables={cables}
              />
            )}
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name='Trace'>
            <PrepTracesList trace={trace} setTrace={setTrace} />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default MyMap;
