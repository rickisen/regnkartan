import React from "react";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import MapView from "react-native-maps";

import { timeFromFilePath } from "../../../helpers/general.js";

// WGS84 coordinates for the corners of the radar image
const BOUNDS = [[70.3891859, 5.090008], [53.1219345, 30.1889371]];

function RadarOverlay() {
  const uri = useSelector(({ radarSelection: { uri } }) => uri);
  const time = new Date(timeFromFilePath(uri));
  return (
    <>
      <Text style={{ position: "absolute", top: 200, left: 100 }}>
        {`${time.getHours()}:${time.getMinutes()}`}
      </Text>
      <MapView.Overlay image={{ uri }} bounds={BOUNDS} />
    </>
  );
}

export default RadarOverlay;
