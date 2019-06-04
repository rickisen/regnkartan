import React from "react";
import { PropTypes } from "prop-types";
import { MapView } from "expo";

export default class RadarOverlay extends React.Component {
  static propTypes = {
    files: PropTypes.array,
    requestedImage: PropTypes.string,
  };

  static defaultProps = {
    files: [],
    requestedImage: "default",
  };

  // WGS84 coordinates for the corners of the radar image
  bounds = [[70.3891859, 5.090008], [53.1219345, 30.1889371]];

  render() {
    const { bounds } = this;
    const { files, requestedImage } = this.props;
    let uri = "http://regn.rickisen.com/png/v1/latest.png";
    if (files.length > 0) {
      uri = files.find(p => p.includes(requestedImage));
    }

    return <MapView.Overlay image={{ uri }} bounds={bounds} />;
  }
}
