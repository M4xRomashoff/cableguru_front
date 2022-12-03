import React from "react";
import {
    Circle,
    Rectangle,
    LayersControl,
    LayerGroup,
    FeatureGroup,
    useMapEvents,
    Popup 
} from "react-leaflet";

const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
  ]

const FeatureGroupOne = () => {
    return (

        <FeatureGroup pathOptions={{ color: 'purple' }}>
            <Popup>Popup in FeatureGroup</Popup>
            <Circle center={[51.51, -0.06]} radius={200} />
            <Rectangle bounds={rectangle} />
          </FeatureGroup>

    );
};

export default FeatureGroupOne;