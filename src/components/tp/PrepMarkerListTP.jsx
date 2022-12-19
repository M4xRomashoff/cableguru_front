import React from 'react';
import L from 'leaflet';

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

import { Marker, Tooltip } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';

function MultipleMarkers({ editMode, deleteMode, dragMode, drawingCable, setPointInfoFCS, markers }) {
  function onClickMarker(item) {
    setPointInfoFCS(item);
  }
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

  return markers.map((item) => {
    const click = !editMode && !deleteMode && !drawingCable && !dragMode ? { click: () => onClickMarker(item) } : {};
    return (
      <Marker tpId={item.id} key={item.id} position={item.position} icon={getIcon(item.state)} eventHandlers={{ ...click }}>
        <Tooltip direction="bottom" offset={[0, 10]} opacity={0.6} permanent>
          {item.name_id}
        </Tooltip>
      </Marker>
    );
  });
}

const PrepMarkerListTP = ({ editMode, deleteMode, dragMode, drawingCable, setPointInfoFCS, markers }) => {
  return (
    <FeatureGroup>
      <MultipleMarkers editMode={editMode} deleteMode={deleteMode} dragMode={dragMode} drawingCable={drawingCable} setPointInfoFCS={setPointInfoFCS} markers={markers} />
    </FeatureGroup>
  );
};

export default PrepMarkerListTP;
