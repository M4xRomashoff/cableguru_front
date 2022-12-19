import React from 'react';
import { Marker, Polyline, Popup, Tooltip, CircleMarker } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import { getCablePointsFromString, getOnePointFromString } from '../../helpers/getCablePointsFromString';

function MultipleTraces({ trace, setTrace }) {
  let COLORS = [
    'rgb(72,139,194)', // blue
    'rgb(231,126,49)', // orange
    'rgb(0,153,0)', // green
    'rgb(150,75,0)', // brown
    'rgb(128,128,128)', // slate
    'rgb(255,255,255)', // white
    'rgb(255, 0, 0)', //red
    'rgb(0,0,0)', //black
    'rgb(255,255,0)', //yellow
    'rgb(218,112,214)', //violet
    'rgb(255,192,203)', // rose
    'rgb(0,255,255)', //aqua
  ];

  function getTracesOptionsFiber(index) {
    const ind = index - parseInt(index / 12) * 12;
    let traceOptions = { color: COLORS[ind] };
    traceOptions.weight = '4';
    traceOptions.dashArray = '30,10';
    traceOptions.dashOffset = '5';
    return traceOptions;
  }
  function getTracesOptionsBase() {
    let traceOptions = { color: 'rgb(255,255,103)' };
    traceOptions.dashArray = '20,10';
    traceOptions.dashOffset = '10';
    traceOptions.weight = '6';
    return traceOptions;
  }

  return trace.map((item) => {
    let points = [];
    if (item.points.length > 0) points = getCablePointsFromString(item.points);
    return (
      <div key={Math.random()}>
        {item.points.length > 0 && (
          <Polyline key={Math.random()} pathOptions={getTracesOptionsBase()} positions={points}>
            <Tooltip opacity={1} permanent>
              fiber-{item.fiber} ({item.cabSize})
            </Tooltip>
          </Polyline>
        )}
        {item.points.length > 0 && (
          <Polyline key={Math.random()} pathOptions={getTracesOptionsFiber(item.fiber - 1)} positions={points}>
            <Tooltip opacity={1} permanent>
              fiber-{item.fiber} ({item.cabSize})
            </Tooltip>
          </Polyline>
        )}

        {item.port > 0 && (
          <CircleMarker key={Math.random()} center={getOnePointFromString(item.portPoint)} radius={20} pathOptions={{ color: 'blue' }}>
            <Tooltip opacity={1} permanent>
              port#-{item.port}
            </Tooltip>
          </CircleMarker>
        )}
      </div>
    );
  });
}

const PrepTracesList = ({ trace, setTrace }) => {
  return (
    <FeatureGroup>
      <MultipleTraces trace={trace} setTrace={setTrace} />
    </FeatureGroup>
  );
};

export default PrepTracesList;
