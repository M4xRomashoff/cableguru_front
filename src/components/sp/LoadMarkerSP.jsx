import React, { useState, useEffect } from 'react';
import proj4 from 'proj4';
import { getDataSpRequest } from '../../api/dataBasesApi';
import { setSessionItem } from '../../helpers/storage';

// function convertCRS(lat, long) {
//   var newpoint = proj4('EPSG:3857', 'EPSG:4326', [lat, long]);
//   return newpoint;
// }

export function LoadMarkersSP() {
  const [markers, setMarkers] = useState([]);
  const arrayMrk = [];

  // setSessionItem('loaded', 20);
  useEffect(() => {
    getDataSpRequest().then((points) => {
      setMarkers(
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
    });
  }, []);
  const array = markers;
  return array;
}

export default LoadMarkersSP;
