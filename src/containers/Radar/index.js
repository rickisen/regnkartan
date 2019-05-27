import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  Slider,
} from "react-native";
import { BlurView, MapView } from "expo";

import RadarOverlay from "./RadarOverlay";
import RadarUi from "./RadarUi";
import mapStyle from "./mapStyle";
import StatusBarBg from "../../components/StatusBarBg";
import { FETCH_FULL, FETCH_RECENT } from "../../redux/modules/zip";

@connect(state => ({
  zip: state.zip,
}))
export default class Radar extends React.Component {
  static navigationOptions = {
    header: null,
  };

  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
  });

  initialRegion = {
    latitude: 59.364109178579795,
    latitudeDelta: 26.738496058255087,
    longitude: 17.24189467728138,
    longitudeDelta: 25.90066082775593,
  };

  timer = null

  state = {
    currentImage: -1,
  };

  componentDidMount() {
    this.fetchZip()

    // get a fresh zip for today every 5 minutes
    this.timer = setInterval( () => {
        this.fetchZip()
      }, 60 * 1000 * 5 )
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  fetchZip() {
    let date = new Date();
    this.props.dispatch({ type: FETCH_RECENT, date });
  }

  componentWillReceiveProps(nextProps) {
    const { unzippedFiles } = nextProps.zip
    const { currentImage } = this.state
    const oldUnzippedFiles = this.props.zip.unzippedFiles

    if (
      unzippedFiles.length > 0 &&
      (oldUnzippedFiles.length === 0 || currentImage === oldUnzippedFiles.length - 1)
    ) {
      this.setState({currentImage: unzippedFiles.length - 1})
    }
  }

  // Bounce map region back if user drags it too far
  onRegionChangeComplete(newRegion) {
    var longDiff = newRegion.longitude - this.initialRegion.longitude;
    var latDiff = newRegion.latitude - this.initialRegion.latitude;
    if (
      this.mapRef &&
      (longDiff > 15 || longDiff < -15 || latDiff > 15 || latDiff < -10)
    ) {
      this.mapRef.animateToRegion(this.initialRegion);
    }
  }

  render() {
    const { styles, initialRegion } = this;
    const { currentImage } = this.state;
    const { zip: { unzippedFiles, loadingZip, unzipping } } = this.props;

    return (
      <View style={styles.container}>
        <MapView
          ref={ref => (this.mapRef = ref)}
          onRegionChange={region => this.onRegionChangeComplete(region)}
          onRegionChangeComplete={region => this.onRegionChangeComplete(region)}
          provider="google"
          showUserLocation={true} // Does this work?
          rotateEnabled={false}
          minZoomLevel={4.5}
          maxZoomLevel={8}
          style={styles.map}
          customMapStyle={mapStyle}
          initialRegion={initialRegion}
        >
          <RadarOverlay
            files={unzippedFiles}
            requestedImage={currentImage}
          />
          <StatusBarBg />
        </MapView>
        <RadarUi
          currentImage={currentImage}
          radarFiles={unzippedFiles}
          setCurrentFile={i => this.setState({ currentImage: i })}
        />
      </View>
    );
  }
}
