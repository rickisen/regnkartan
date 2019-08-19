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
import MapView from "react-native-maps";

import Ui from "./Ui";
import RadarOverlay from "./RadarOverlay";
import mapStyle from "./mapStyle";
import StatusBarBg from "../../components/StatusBarBg";
import {
  FETCH_RECENT,
  FETCH_CHUNK,
  CLEAR_CACHE,
  propTypes,
} from "../../redux/modules/zip";
import { generateDateCode } from "../../helpers/general";

@connect(state => ({
  zip: state.zip,
}))
export default class Radar extends React.Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    ...propTypes,
    navigation: PropTypes.object.isRequired,
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

  timer = null;

  state = {
    currentImage: "latest",
  };

  componentDidMount() {
    // TODO: figure out a clever way to delete unneeded cached files
    // this.props.dispatch({ type: CLEAR_CACHE });
    this.fetchZip();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  fetchZip() {
    const date = new Date();
    this.props.dispatch({ type: FETCH_RECENT, date });
  }

  componentWillReceiveProps(nextProps) {
    const { unzippedFiles, selectedRange } = nextProps.zip;
    const { currentImage } = this.state;
    const oldUnzippedFiles = this.props.zip.unzippedFiles;
    if (unzippedFiles.length > 0 && oldUnzippedFiles.length === 0) {
      this.setState({
        currentImage: generateDateCode(selectedRange.end, true, true),
      });
    }
  }

  // Bounce the map region back if user drags it too far
  onRegionChangeComplete(newRegion) {
    const longDiff = newRegion.longitude - this.initialRegion.longitude;
    const latDiff = newRegion.latitude - this.initialRegion.latitude;
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
    const {
      dispatch,
      zip: { chunks, unzippedFiles, loadingZip, unzipping, selectedRange },
    } = this.props;

    return (
      <View style={styles.container}>
        <MapView
          ref={ref => (this.mapRef = ref)}
          onRegionChange={region => this.onRegionChangeComplete(region)}
          onRegionChangeComplete={region => this.onRegionChangeComplete(region)}
          provider="google"
          showUserLocation={true}
          rotateEnabled={false}
          minZoomLevel={4.5}
          maxZoomLevel={9}
          style={styles.map}
          customMapStyle={mapStyle}
          initialRegion={initialRegion}
        >
          <RadarOverlay files={unzippedFiles} requestedImage={currentImage} />
          <StatusBarBg />
        </MapView>
        <Ui
          chunks={chunks}
          selectedRange={selectedRange}
          currentImage={currentImage}
          radarFiles={unzippedFiles}
          setCurrentFile={ci => this.setState({ currentImage: ci })}
          fetchRecent={() => dispatch({ type: FETCH_RECENT })}
        />
      </View>
    );
  }
}
