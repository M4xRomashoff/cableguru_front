import React, { useState, useEffect } from 'react';
import { Marker, Polyline, Popup, Tooltip } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import proj4 from 'proj4';
import { logAddInfo } from '../../api/logFileApi';
import CustomButton from '../Button';
import { changeItemState } from '../../api/changeItemState';
import { getCablePointsFromString } from '../../helpers/getCablePointsFromString';

function MultipleCables({ editMode, deleteMode, dragMode, drawingCable, setPointInfo, setPointInfoCable, cables, loadCables }) {
  function getCableOptions(item) {
    const size = parseInt(item.capacity);

    let cableOptions = { color: 'black' };
    if (size < 48) {
      cableOptions.weight = '2';
    }
    if (size >= 48 && size <= 144) {
      cableOptions.weight = '3';
    }
    if (size > 144 && size <= 196) {
      cableOptions.weight = '4';
    }
    if (size > 196 && size <= 432) {
      cableOptions.weight = '5';
    }
    if (size > 432 && size <= 864) {
      cableOptions.weight = '6';
    }
    if (size > 864) {
      cableOptions.weight = '7';
    }

    if (item.state === 0) {
      cableOptions.color = 'red'; // 0 - designed
    }
    if (item.state === 2) {
      cableOptions.color = 'black'; // 1 - placed
    }
    if (item.state === 3) {
      cableOptions.color = 'green'; // 2 - has active fibers
    }
    if (item.state === 1) {
      cableOptions.color = 'black'; // 3 - work in progress
      cableOptions.dashArray = '20,10';
      cableOptions.dashOffset = '5';
    }
    if (item.state === 4) {
      cableOptions.color = 'grey'; // 4 - abandoned
    }
    return cableOptions;
  }

  function onClickPolyline(item) {
    setPointInfoCable(item);
  }

  return cables.map((item, index) => {
    let is_complete = false;
    if (item.state === 0) is_complete = false;
    else is_complete = true;

    const points = getCablePointsFromString(item.points);
    const click = !editMode && !deleteMode && !drawingCable && !dragMode ? { click: () => onClickPolyline(item) } : {};
    return (
      <Polyline cableId={item.id} key={item.id} pathOptions={getCableOptions(item)} positions={points} eventHandlers={{ ...click }}>
        <Tooltip opacity={0.6} permanent>
          {item.name_id} size-{item.capacity}
        </Tooltip>
      </Polyline>
    );
  });
}

const PrepCablesList = ({ deleteMode, setPointInfo, setPointInfoCable, cables, loadCables }) => {
  return (
    <FeatureGroup>
      <MultipleCables deleteMode={deleteMode} setPointInfo={setPointInfo} setPointInfoCable={setPointInfoCable} cables={cables} loadCables={loadCables} />
    </FeatureGroup>
  );
};

export default PrepCablesList;
