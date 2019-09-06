import React, { useState, useEffect, useRef } from "react";
import { PropTypes } from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

import Ui from "../Ui";
import RadarOverlay from "./RadarOverlay";
import mapStyle from "./mapStyle";
import StatusBarBg from "../../../components/StatusBarBg";
import { FETCH_RECENT } from "../../../redux/modules/zip";

const initialRegion = {
  latitude: 59.364109178579795,
  latitudeDelta: 26.738496058255087,
  longitude: 17.24189467728138,
  longitudeDelta: 25.90066082775593,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

RadarMap.navigationOptions = {
  header: null,
};

RadarMap.propTypes = {
  navigation: PropTypes.object,
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
function RadarMap() {
  const [currentImage, setCurrentFile] = useState("latest"); // to be replaced by value in redux state
  const dispatch = useDispatch();
  const { chunks, unzippedFiles, selectedRange } = useSelector(
    ({ zip }) => zip
  );
  const mapRef = useRef(null);
  const onRegionChangeComplete = newRegion => bounceBackMap(newRegion, mapRef);
  useEffect(() => {
    dispatch({ type: FETCH_RECENT });
  }, []); // fetch recent zip-chunks when mounted

  return (
    <View style={styles.container}>
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
      <Ui
        chunks={chunks}
        selectedRange={selectedRange}
        currentImage={currentImage}
        radarFiles={unzippedFiles}
        setCurrentFile={setCurrentFile}
        fetchRecent={() => dispatch({ type: FETCH_RECENT })}
      />
    </View>
  );
}

export default RadarMap;
