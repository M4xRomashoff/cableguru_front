import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import mrk_slate from '../icons/sp_slate.png';
import mrk_orange from '../icons/sp_o.png';
import mrk_red from '../icons/sp_r.png';
import mrk_green from '../icons/sp_g.png';
import mrk_shadow from '../icons/sp_shadow.png';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import proj4 from 'proj4';

function convertCRS(lat, long) {
  var newpoint = proj4('EPSG:3857', 'EPSG:4326', [lat, long]);
  return newpoint;
}

function MultipleMarkers({ editMode, deleteMode, dragMode, drawingCable, setPointInfoFCS, markers }) {
  function onClickMarker(item) {
    setPointInfoFCS(item);
  }

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

  const [loggedInMarkers, setLoggedInMarkers] = useState([]);

  return markers.map((item, index) => {
    const click = !editMode && !deleteMode && !drawingCable && !dragMode ? { click: () => onClickMarker(item) } : {};
    return (
      <Marker spId={item.id} key={item.id} position={item.position} icon={getIcon(item.state)} eventHandlers={{ ...click }}>
        <Tooltip direction="bottom" offset={[0, 10]} opacity={0.6} permanent>
          {item.name_id}
        </Tooltip>
      </Marker>
    );
  });
}

const PrepMarkerListSP = ({ editMode, deleteMode, dragMode, drawingCable, setPointInfoFCS, markers }) => {
  return (
    <FeatureGroup>
      <MultipleMarkers editMode={editMode} deleteMode={deleteMode} dragMode={dragMode} drawingCable={drawingCable} setPointInfoFCS={setPointInfoFCS} markers={markers} />
    </FeatureGroup>
  );
};

export default PrepMarkerListSP;
