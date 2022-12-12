import { API, API_multipart } from './api';
import { getSessionItem } from '../helpers/storage';
import proj4 from 'proj4';
import convertToString from '../helpers/CablePointsToString';

function convertCRS(lat, long) {
  var newpoint = proj4('EPSG:4326', 'EPSG:3857', [lat, long]);

  return newpoint;
}

export async function getDbList() {
  return await API.get('/data-bases').then(({ data }) => data);
}

export async function getDataCableRequest() {
  let project = getSessionItem('project');

  return await API.get(`/db-cables/${project?.dbName}`).then(({ data }) => data);
}

export async function getProjectOpitons() {
  let project = getSessionItem('project');

  return await API.get(`/db-project-options/${project?.dbName}`).then(({ data }) => data);
}

export async function getDataSpRequest() {
  let project = getSessionItem('project');
  return await API.get(`/db-sp/${project?.dbName}`).then(({ data }) => data);
}

export async function getConnections() {
  let project = getSessionItem('project');
  return await API.get(`/getConnections/${project?.dbName}`).then(({ data }) => data);
}

export async function getDataTpRequest() {
  let project = getSessionItem('project');

  return await API.get(`/db-tp/${project?.dbName}`).then(({ data }) => data);
}

export async function getSpData(spId) {
  if (spId) {
    let project = getSessionItem('project');
    let lang = getSessionItem('lang');

    return await API.get(`/db-sp-fcs/${project?.dbName},${spId},${lang}`).then(({ data }) => data);
  } else return [];
}

export async function getFewSp(itemsList) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/getFewSp/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      itemList: itemsList,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function getFewCab(itemsList) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/getFewCab/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      itemList: itemsList,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function getFewTp(itemsList) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/getFewTp/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      itemList: itemsList,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function getTpData(tpId) {
  let project = getSessionItem('project');
  let lang = getSessionItem('lang');

  return await API.get(`/db-tp-fcs/${project?.dbName},${tpId},${lang}`).then(({ data }) => data);
}

export async function getTpPortData(tpId) {
  let project = getSessionItem('project');
  const dbAndId = project?.dbName + ',' + tpId.toString();

  return await API.get(`/db-tp-ports/${project?.dbName},${tpId}`).then(({ data }) => data);
}

export async function saveTpPortData(tpId, data) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = `/db-tp-ports/${project?.dbName},${tpId}`;
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      ports: JSON.stringify(data),
      tpId: tpId,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function updateSeqNumbers(type, id, data) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = `/updateSeqNumbers/`;
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      cables: JSON.stringify(data),
      id: id,
      type: type,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function loadHistory(dbName) {
  return await API.get(`/getHistory/${dbName}`).then(({ data }) => data);
}

export async function getTrace(tpId, port) {
  let project = getSessionItem('project');
  const dbAndId = project?.dbName;

  return await API.get(`/db-getTrace/${project?.dbName},${tpId},${port}`).then(({ data }) => data);
}

export async function addSpItem(item) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/addSpItem/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      current_status: item.state,
      name_id: item.name_id,
      mfg: item.mfg,
      model: item.model,
      capacity: item.capacity,
      spl_type: item.spl_type,
      mount: item.mount,
      address: item.address,
      latitude: item.position[0], //convertCRS(item.position)[0],
      longitude: item.position[1], //convertCRS(item.position)[1],
      owner: item.owner,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function addTpItem(item) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/addTpItem/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      current_status: item.state,
      name_id: item.name_id,
      mfg: item.mfg,
      model: item.model,
      capacity: item.capacity,
      connector: item.connector,
      access: item.access,
      address: item.address,
      latitude: item.position[0], //convertCRS(item.position)[0],
      longitude: item.position[1], //convertCRS(item.position)[1],
      owner: item.owner,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function addCableItem(item) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/addCableItem/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      current_status: item.state,
      name_id: item.name_id,
      mfg: item.mfg,
      model: item.model,
      capacity: item.capacity,
      f_type: item.f_type,
      p_type: item.p_type,
      c_type: item.c_type,
      points: convertToString(item.points),
      owner: item.owner,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function updateSpItem(item) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;
  let url = '/updateSpItem/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      id: item.id,
      current_status: item.state,
      name_id: item.name_id,
      mfg: item.mfg,
      model: item.model,
      capacity: item.capacity,
      spl_type: item.spl_type,
      mount: item.mount,
      address: item.address,
      latitude: item.position[0],
      longitude: item.position[1],
      owner: item.owner,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function updateSpLatLng(items) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;
  let url = '/updateSpLatLng/';
  let options = {
    method: 'POST',
    url,
    data: {
      userId: parseInt(user_id),
      dbName,
      data: JSON.stringify(items),
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function updateTpItem(item) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/updateTpItem/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      id: item.id,
      current_status: item.state,
      name_id: item.name_id,
      mfg: item.mfg,
      model: item.model,
      capacity: item.capacity,
      connector: item.connector,
      access: item.access,
      address: item.address,
      latitude: item.position[0],
      longitude: item.position[1],
      owner: item.owner,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function updateTpLatLng(items) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;
  let url = '/updateTpLatLng/';
  let options = {
    method: 'POST',
    url,
    data: {
      userId: parseInt(user_id),
      dbName,
      data: JSON.stringify(items),
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function updateCableItem(item) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/updateCableItem/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      id: item.id,
      current_status: item.state,
      name_id: item.name_id,
      mfg: item.mfg,
      f_type: item.f_type,
      p_type: item.p_type,
      c_type: item.c_type,
      model: item.model,
      capacity: item.capacity,
      points: item.points,
      owner: item.owner,
      birthday: item.birthday,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function updateCableLatLng(items) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;
  let url = '/updateCableLatLng/';
  let options = {
    method: 'POST',
    url,
    data: {
      userId: parseInt(user_id),
      dbName,
      data: JSON.stringify(items),
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function updateConnectionsAdd(item) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/updateConnectionsAdd/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      spTpId: item.spTpId,
      spTpType: item.spTpType,
      cabId: item.cabId,
      pointIndex: item.pointIndex,
      conType: item.conType,
      cabSize: item.size,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function updateConnectionsRemove(item) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/updateConnectionsRemove/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      spTpId: item.spTpId,
      spTpType: item.spTpType,
      cabId: item.cabId,
      pointIndex: item.pointIndex,
      conType: item.conType,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

function createDataForUpdateConnections(newConnections, itemsToUpdate) {
  const data = [];
  itemsToUpdate.map((item) => {
    newConnections.map((conItem) => {
      if (item.cabId === conItem.cab_id) data.push(conItem);
    });
  });
  return data;
}

export async function updateConnections(newConnections, itemsToUpdate) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/updateConnections/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      data: JSON.stringify(createDataForUpdateConnections(newConnections, itemsToUpdate)),
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

function prepreDataFix(itemsToFix) {
  let data = [];
  itemsToFix.map((item) => {
    if (item.action === 'delete cable') data.push({ cabId: item.cabId, action: item.action, latlngs: [] });
    else if (item.latlngs.length > 0) data.push({ cabId: item.cabId, action: item.action, latlngs: convertToString(item.latlngs) });
  });
  return data;
}

export async function updateConnectionsFix(itemsToFix) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  const dataFix = prepreDataFix(itemsToFix);

  let url = '/updateConnectionsFix/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      dataFix: JSON.stringify(dataFix),
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function createNewProject(newName) {
  return await API.get(`/newProject/${newName}`).then(({ data }) => data);
}

export async function updateSplicesSp(data) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/updateSplicesSp/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      spId: data.spId,
      cabId1: data.cabId1,
      cabId2: data.cabId2,
      conType1: data.conType1,
      conType2: data.conType2,
      fStart1: data.fStart1,
      fStart2: data.fStart2,
      fEnd1: data.fEnd1,
      fEnd2: data.fEnd2,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function updateSplicesTp(data) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/updateSplicesTp/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      tpId: data.tpId,
      cabId1: data.cabId1,
      cabId2: data.cabId2,
      conType1: data.conType1,
      conType2: data.conType2,
      fStart1: data.fStart1,
      fStart2: data.fStart2,
      fEnd1: data.fEnd1,
      fEnd2: data.fEnd2,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function deleteSpItem(itemId) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;
  let url = '/deleteSpItem/';
  let options = {
    method: 'DELETE',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      spId: itemId,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function deleteTpItem(itemId) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;
  let url = '/deleteTpItem/';
  let options = {
    method: 'DELETE',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      tpId: itemId,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function deleteCableItem(itemId) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;
  let url = '/deleteCableItem/';
  let options = {
    method: 'DELETE',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      cableId: itemId,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function uploadDocument(file) {
  const form = new FormData();
  form.append('title', file.name);
  form.append('file', file);

  const project = getSessionItem('project');
  const { user_id, dbName } = project;
  const user = getSessionItem('user');
  const { user_name } = user;

  let url = '/uploadDocument/';
  let options = {
    method: 'POST',
    url,
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data',
      dbname: dbName,
      userid: user_id,
      username: user_name,
    },
  };
  let response = await API_multipart(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}
export async function uploadPicture(file, item) {
  const form = new FormData();
  form.append('title', file.name);
  form.append('file', file);

  let itemType = 'sp';
  if (item.connector) itemType = 'tp';
  const project = getSessionItem('project');
  const { user_id, dbName } = project;
  const user = getSessionItem('user');
  const { user_name } = user;

  let url = '/uploadPicture/';
  let options = {
    method: 'POST',
    url,
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data',
      itemid: item.id.toString(),
      itemtype: itemType,
      dbname: dbName,
      userid: user_id,
      username: user_name,
    },
  };
  let response = await API_multipart(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function downloadPicturesLinks(id, type) {
  let project = getSessionItem('project');
  return await API.get(`/getPicture/${project?.dbName},${id},${type}`).then(({ data }) => data);
}

export async function downloadDocumentsLinks() {
  let project = getSessionItem('project');
  return await API.get(`/getDocument/${project?.dbName}`).then(({ data }) => data);
}

export async function deleteDocument(item) {
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/deleteDocument/';
  let options = {
    method: 'DELETE',
    url,
    data: {
      userId: user_id,
      dbName: dbName,
      dir: item.dir,
      id:item.id,
    },
  };
  let response = await API_multipart(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function deletePicture(item) {
  let itemType = 'sp';
  if (item.connector) itemType = 'tp';
  const project = getSessionItem('project');
  const { user_id, dbName } = project;

  let url = '/deletePicture/';
  let options = {
    method: 'DELETE',
    url,
    data: {
      userId: user_id,
      dbName: dbName,
      itemId: item.item_id,
      itemType: item.item_type,
      dir: item.dir,
    },
  };
  let response = await API_multipart(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}
