import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";

import RadarOverlay from "./RadarOverlay";
import mapStyle from "./mapStyle";
import StatusBarBg from "../../../components/StatusBarBg";

const INITIAL_REGION = {
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

function bounceBackMap(newRegion, mapRef) {
  const longDiff = newRegion.longitude - INITIAL_REGION.longitude;
  const latDiff = newRegion.latitude - INITIAL_REGION.latitude;
  if (
    mapRef.current &&
    (longDiff > 15 || longDiff < -15 || latDiff > 15 || latDiff < -10)
  ) {
    mapRef.current.animateToRegion(INITIAL_REGION);
  }
}

function useReZoomOnExtendedData(mapRef) {
  const extendedDataVisible = useSelector(
    ({ pointAnalysis: { visible } }) => visible
  );
  const lastCam = useRef(null);
  useEffect(() => {
    const { height, width } = Dimensions.get("window");

    if (extendedDataVisible) {
      mapRef.current.getCamera().then(cam => {
        lastCam.current = cam;
        mapRef.current
          .coordinateForPoint({
            x: width / 2,
            y: height * 0.8,
          })
          .then(zoomTo => {
            mapRef.current.animateCamera({ center: zoomTo }, { duration: 200 });
          });
      });
    } else if (lastCam.current) {
      mapRef.current.animateCamera(lastCam.current, { duration: 200 });
    }
  }, [extendedDataVisible, mapRef]);
}

// Also gets a navigation prop
function RadarMap() {
  const mapRef = useRef(null);
  const locationGranted = useSelector(
    ({ permissions: { granted } }) =>
      granted.findIndex(v => v === "LOCATION") >= 0
  );
  const onRegionChangeComplete = newRegion => bounceBackMap(newRegion, mapRef);
  useReZoomOnExtendedData(mapRef);

  return (
    <MapView
      ref={mapRef}
      onRegionChange={onRegionChangeComplete}
      onRegionChangeComplete={onRegionChangeComplete}
      pitchEnabled={false}
      provider="google"
      showsUserLocation={locationGranted}
      rotateEnabled={false}
      minZoomLevel={4.5}
      maxZoomLevel={9}
      style={styles.map}
      customMapStyle={mapStyle}
      initialRegion={INITIAL_REGION}
    >
      <RadarOverlay />
      <StatusBarBg />
    </MapView>
  );
}

export default RadarMap;
