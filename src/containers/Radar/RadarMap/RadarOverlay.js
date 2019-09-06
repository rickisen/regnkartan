import React, { memo } from "react";
import { PropTypes } from "prop-types";
import MapView from "react-native-maps";

// WGS84 coordinates for the corners of the radar image
const BOUNDS = [[70.3891859, 5.090008], [53.1219345, 30.1889371]];

function RadarOverlay({ files, requestedImage }) {
  let uri = "http://regn.rickisen.com/png/v1/latest.png";
  if (files.length > 0) {
    uri = files.find(p => p.includes(requestedImage));
  }

  return <MapView.Overlay image={{ uri }} bounds={BOUNDS} />;
}

RadarOverlay.propTypes = {
  files: PropTypes.array,
  requestedImage: PropTypes.string,
};

RadarOverlay.defaultProps = {
  files: [],
  requestedImage: "default",
};
export default memo(RadarOverlay);
