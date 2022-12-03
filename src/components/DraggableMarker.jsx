import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Marker, Popup } from 'react-leaflet';

const center = {
  lat: 51.509,
  lng: -0.09,
};

function DraggableMarker(props) {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(center);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker position={position} draggable={draggable} eventHandlers={eventHandlers} icon={props.icon} key={props.keyid} ref={markerRef}>
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>{draggable ? props.keyid + '    key id' : 'Click here to make marker draggable'}</span>
      </Popup>
    </Marker>
  );
}

export default DraggableMarker;
