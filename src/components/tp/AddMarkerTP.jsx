import React from 'react';
import L from 'leaflet';

import mrk_shadow from '../icons/sp_shadow.png';
import mrk_hub_slate from '../icons/hub_slate.png';
import mrk_hub_orange from '../icons/hub_orange.png';
import mrk_hub_red from '../icons/hub_red.png';
import mrk_hub_green from '../icons/hub_green.png';
import mrk_connectors_slate from '../icons/connectors_slate.png';
import mrk_connectors_orange from '../icons/connectors_orange.png';
import mrk_connectors_red from '../icons/connectors_red.png';
import mrk_connectors_green from '../icons/connectors_green.png';
import mrk_service_slate from '../icons/service_slate.png';
import mrk_service_orange from '../icons/service_orange.png';
import mrk_service_red from '../icons/service_red.png';
import mrk_service_green from '../icons/service_green.png';
import { getSessionItem } from '../../helpers/storage';
import { logAddInfo } from '../../api/logFileApi';

function getIcon(status) {
  let iconUrl_link = mrk_hub_slate;
  if (status === 0) {
    iconUrl_link = mrk_hub_slate;
  } // 0 placed
  if (status === 1) {
    iconUrl_link = mrk_hub_orange;
  } // 1 has connection
  if (status === 2) {
    iconUrl_link = mrk_hub_red;
  } // 2 needs to be spliced
  if (status === 3) {
    iconUrl_link = mrk_hub_green;
  } // 3 spliced

  if (status === 4) {
    iconUrl_link = mrk_connectors_slate;
  } // 4 placed
  if (status === 5) {
    iconUrl_link = mrk_connectors_orange;
  } // 5 has connection
  if (status === 6) {
    iconUrl_link = mrk_connectors_red;
  } // 6 needs to be spliced
  if (status === 7) {
    iconUrl_link = mrk_connectors_green;
  } // 7 spliced

  if (status === 8) {
    iconUrl_link = mrk_service_slate;
  } // 8 placed
  if (status === 9) {
    iconUrl_link = mrk_service_orange;
  } // 9 has connection
  if (status === 10) {
    iconUrl_link = mrk_service_red;
  } // 10 needs to be spliced
  if (status === 11) {
    iconUrl_link = mrk_service_green;
  } // 11 spliced

  const icon = L.icon({
    iconUrl: iconUrl_link,
    iconRetinaUrl: iconUrl_link,
    // shadowUrl: mrk_shadow,
    iconSize: [30, 20],
    // shadowSize: [24, 24], // size of the shadow
    iconAnchor: [15, 10], // point of the icon which will correspond to marker's location
    // shadowAnchor: [8, 12],  // the same for the shadow
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  });
  return icon;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function AddMarkerTP(latLng) {
  return {
    position: [latLng.lat, latLng.lng],
    id: getRandomInt(1000000),
    icon: getIcon(0),
    name_id: 'tp-' + getRandomInt(1000).toString(),
    mfg: '-mfg-new',
    model: 'model-new',
    capacity: 24,
    connector: 'SC/UPC',
    access: 'door',
    address: 'right here',
    birthday: '',
    last_update: '',
    owner: 'miself',
    state: 0,
  };
}

export default AddMarkerTP;
