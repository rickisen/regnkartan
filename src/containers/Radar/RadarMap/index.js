import React, { useRef } from "react";
import { PropTypes } from "prop-types";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";

import RadarOverlay from "./RadarOverlay";
import mapStyle from "./mapStyle";
import StatusBarBg from "../../../components/StatusBarBg";

const initialRegion = {
  latitude: 59.364109178579795,
  latitudeDelta: 26.738496058255087,
  longitude: 17.24189467728138,
  longitudeDelta: 25.90066082775593,
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

RadarMap.propTypes = {
  unzippedFiles: PropTypes.array,
  currentImage: PropTypes.string,
};

function bounceBackMap(newRegion, mapRef) {
  const longDiff = newRegion.longitude - initialRegion.longitude;
  const latDiff = newRegion.latitude - initialRegion.latitude;
  if (
    mapRef.current &&
    (longDiff > 15 || longDiff < -15 || latDiff > 15 || latDiff < -10)
  ) {
    mapRef.current.animateToRegion(initialRegion);
  }
}

// Also gets a navigation prop
function RadarMap({ currentImage, unzippedFiles }) {
  const mapRef = useRef(null);
  const onRegionChangeComplete = newRegion => bounceBackMap(newRegion, mapRef);

  return (
    <MapView
      ref={mapRef}
      onRegionChange={onRegionChangeComplete}
      onRegionChangeComplete={onRegionChangeComplete}
      provider="google"
      showUserLocation={true} // need to get permissions too
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
  );
}

export default RadarMap;
