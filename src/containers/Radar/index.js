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
import { BlurView, MapView, Overlay } from "expo";

import RadarUi from "./RadarUi";
import StatusBarBg from "../../components/StatusBarBg";
import { FETCH_DAY } from "../../redux/modules/radarImages";

@connect(state => ({
  radar: state.radar,
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

  constructor(props) {
    super(props);

    this.initialRegion = {
      latitude: 59.364109178579795,
      latitudeDelta: 26.738496058255087,
      longitude: 17.24189467728138,
      longitudeDelta: 25.90066082775593,
    };

    this.state = {
      currentImage: 0,
      preFetchLock: false,
      timeout: null,
    };
  }

  componentDidMount() {
    let day = new Date();
    this.props.dispatch({ type: FETCH_DAY, day });
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.radar.loadingDay &&
      !nextProps.radar.loadingDay &&
      nextProps.radar.files.length > 0
    ) {
      this.setState({ currentImage: nextProps.radar.files.length - 1 });

      // prefetch one image for every hour
      for (var i = 0, len = nextProps.radar.files.length; i < len; i += 5) {
        Image.prefetch(nextProps.radar.files[i].formats[0].link);
      }

      // and prefetch the closest ones
      for (var j = nextProps.radar.files.length - 1; j >= 0; j--) {
        if (nextProps.radar.files.length - j < 40) {
          Image.prefetch(nextProps.radar.files[j].formats[0].link);
        }
      }
    }
  }

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
    const { styles } = this;
    const { radar, dispatch } = this.props;
    const { currentImage, showDebug } = this.state;

    //by conversion
    const radarCorners = {
      top: 70.3891859,
      left: 5.090008,
      right: 30.1889371,
      bottom: 53.1219345,
    };

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
          maxZoomLevel={8}
          style={styles.map}
          customMapStyle={mapStyle}
          initialRegion={this.initialRegion}
        >
          {radar.files.length > 0 &&
            !radar.loadingDay &&
            currentImage <= radar.files.length && (
              <MapView.Overlay
                image={{
                  uri:
                    "http://regn.rickisen.com/v1/" +
                    radar.files[currentImage].key +
                    ".png",
                }}
                bounds={[
                  [radarCorners.top, radarCorners.left], // top-left
                  [radarCorners.bottom, radarCorners.right], // bottom-right
                ]}
              />
            )}
          <StatusBarBg />
        </MapView>
        <RadarUi
          currentImage={currentImage}
          radarFiles={radar.files}
          setCurrentFile={i => this.setState({ currentImage: i })}
        />
      </View>
    );
  }
}

mapStyle = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#193341",
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      {
        color: "#2c5a71",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#29768a",
      },
      {
        lightness: -37,
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#406d80",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#406d80",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        visibility: "on",
      },
      {
        color: "#3e606f",
      },
      {
        weight: 2,
      },
      {
        gamma: 0.84,
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        weight: 0.6,
      },
      {
        color: "#1a3541",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [
      {
        visibility: "on",
      },
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#2c5a71",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road.arterial",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road.local",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];
