import React from 'react';
import L from 'leaflet';
import mrk_slate from '../icons/sp_slate.png';
import mrk_orange from '../icons/sp_o.png';
import mrk_red from '../icons/sp_r.png';
import mrk_green from '../icons/sp_g.png';
import mrk_shadow from '../icons/sp_shadow.png';
import { logAddInfo } from '../../api/logFileApi';

function getIcon(status) {
  let iconUrl_link = mrk_slate;
  if (status === 0) {
    iconUrl_link = mrk_slate;
  } // 0 placed
  if (status === 1) {
    iconUrl_link = mrk_orange;
  } // 1 has connection
  if (status === 2) {
    iconUrl_link = mrk_red;
  } // 2 needs to be spliced
  if (status === 3) {
    iconUrl_link = mrk_green;
  } // 3 spliced

  const icon = L.icon({
    iconUrl: iconUrl_link,
    iconRetinaUrl: iconUrl_link,
    shadowUrl: mrk_shadow,
    iconSize: [24, 24],
    shadowSize: [24, 24], // size of the shadow
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    shadowAnchor: [8, 12], // the same for the shadow
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  });
  return icon;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function AddMarkerSP(latLng) {
  const name_id = 'sp-' + getRandomInt(100).toString();
  return {
    position: [latLng.lat, latLng.lng],
    id: getRandomInt(1000000),
    icon: getIcon(0),
    name_id: name_id,
    mfg: '-mfg-new',
    model: 'model-new',
    capacity: 1,
    spl_type: 'Single',
    mount: '',
    address: 'right here',
    birthday: '',
    last_update: '',
    owner: 'miself',
    state: 0,
  };
}

export default AddMarkerSP;
