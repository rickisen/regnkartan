import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, Dimensions, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import MapView from "react-native-maps";

import RadarOverlay from "./RadarOverlay";
import mapStyle from "./mapStyle";
import LightningStrikes from "../../../components/LightningStrikes";
import StatusBarBg from "../../../components/StatusBarBg";
import {
  LOCATION_GRANTED,
  selectLocationGranted,
} from "../../../redux/modules/permissions";
import { SET_LAT_LON } from "../../../redux/modules/pointAnalysis";
import { selectStrikesAndStamp } from "../../../redux/modules/lightning";

function useReZoomOnExtendedData() {
  const mapRef = useRef(null);
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
  return mapRef;
}

function useBounceBackMap(mapRef) {
  return newRegion => {
    const longDiff = newRegion.longitude - INITIAL_REGION.longitude;
    const latDiff = newRegion.latitude - INITIAL_REGION.latitude;
    if (
      mapRef.current &&
      (longDiff > 15 || longDiff < -15 || latDiff > 15 || latDiff < -10)
    ) {
      mapRef.current.animateToRegion(INITIAL_REGION);
    }
  };
}

function useMarker() {
  const [marker, setMarker] = useState(null);
  const dispatch = useDispatch();
  const handlePress = ({
    nativeEvent: {
      coordinate: { latitude, longitude },
    },
  }) => {
    dispatch({ type: SET_LAT_LON, lat: latitude, lon: longitude });
    setMarker({ latitude, longitude });
  };
  const handleLongPress = ({
    nativeEvent: {
      coordinate: { latitude, longitude },
    },
  }) => {
    if (marker) {
      dispatch({ type: LOCATION_GRANTED }); //TODO: don't do this if no perm
      setMarker(null);
    } else {
      dispatch({ type: SET_LAT_LON, lat: latitude, lon: longitude });
      setMarker({ latitude, longitude });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };
  return [marker, handlePress, handleLongPress];
}

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

// Also gets a navigation prop
function RadarMap() {
  const mapRef = useReZoomOnExtendedData();
  const onRegionChangeComplete = useBounceBackMap(mapRef);
  const [marker, handlePress, handleLongPress] = useMarker();
  const locationGranted = useSelector(selectLocationGranted);
  const [strikes, stamp] = useSelector(selectStrikesAndStamp);

  return (
    <MapView
      ref={mapRef}
      onRegionChangeComplete={onRegionChangeComplete}
      onLongPress={handleLongPress}
      onPress={handlePress}
      pitchEnabled={false}
      provider="google"
      showsUserLocation={locationGranted && !marker}
      rotateEnabled={false}
      minZoomLevel={4.5}
      maxZoomLevel={9}
      style={styles.map}
      customMapStyle={mapStyle}
      initialRegion={INITIAL_REGION}
    >
      {marker && <MapView.Marker coordinate={marker} pinColor="#fff" />}
      <RadarOverlay />
      <StatusBarBg />
      {Platform.OS === "ios" && ( //TODO: Find fix for Android crash on adding any markers
        <LightningStrikes strikes={strikes} stamp={stamp} />
      )}
    </MapView>
  );
}

export default RadarMap;
