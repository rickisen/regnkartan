import React from "react";
import { PropTypes } from "prop-types";
import { MapView, FileSystem } from "expo";

export default class RadarOverlay extends React.Component {
  static propTypes = {
    files: PropTypes.array,
    requestedImage: PropTypes.number
  }

  static defaultProps = {
    files: [],
    requestedImage: -1
  }

  radarCorners = {
    top: 70.3891859,
    left: 5.090008,
    right: 30.1889371,
    bottom: 53.1219345,
  };

  // This variable is purposly kept outside of local state since it will
  // consist of huge base64 strings, and we dont want those to be diffed
  // every update. Defaults to simple remote image of latest image
  loadedImage = "http://regn.rickisen.com/png/v1/latest.png";

  state = {
    currentImage: 0,
    imageLoaded: true
  };

  componentWillMount() {
    if (this.requestedImage >= 0 ) {
      this.loadImage(this.requestedImage)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { requestedImage } = nextProps
    if (this.props.requestedImage !== requestedImage && requestedImage >= 0) {
      this.loadImage(nextProps.requestedImage)
    }
  }

  loadImage(requestedImage) {
    const { files } = this.props
    if (files && files.length > 0 && files[requestedImage]) {
      FileSystem.readAsStringAsync(files[requestedImage])
      .then((data) => {
        this.setState({imageLoaded: false}, () => {
          this.loadedImage = 'data:image/png;base64,' + data
          this.setState({imageLoaded: true})
        })
      })
    }
  }

  render() {
    const { radarCorners, loadedImage } = this
    const { currentImage, imageLoaded } = this.state
    const bounds = [
      [radarCorners.top, radarCorners.left],
      [radarCorners.bottom, radarCorners.right],
    ]

    return(
      <MapView.Overlay
        image={{ uri: loadedImage }}
        bounds={bounds}
      />
    );
  }
}
