import React, { memo } from "react";
import { useSelector } from "react-redux";
import MapView from "react-native-maps";

// WGS84 coordinates for the corners of the radar image
const BOUNDS = [[70.3891859, 5.090008], [53.1219345, 30.1889371]];

function RadarOverlay() {
  const uri = useSelector(({ radarSelection: { uri } }) => uri);
  return <MapView.Overlay image={{ uri }} bounds={BOUNDS} />;
}

export default memo(RadarOverlay);
