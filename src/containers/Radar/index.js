import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";

import Ui from "./Ui";
import RadarMap from "./RadarMap";
import { FETCH_RECENT } from "../../redux/modules/zip";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

Radar.navigationOptions = {
  header: null,
};

Radar.propTypes = {
  navigation: PropTypes.object,
};

// Also gets a navigation prop
function Radar() {
  const [currentImage, setCurrentFile] = useState(""); // to be replaced by value in redux state
  const dispatch = useDispatch();
  const { chunks, unzippedFiles } = useSelector(({ zip }) => zip);
  useEffect(() => {
    dispatch({ type: FETCH_RECENT });
  }, []); // fetch recent zip-chunks when mounted

  return (
    <View style={styles.container}>
      <RadarMap unzippedFiles={unzippedFiles} currentImage={currentImage} />
      <Ui
        chunks={chunks}
        currentImage={currentImage}
        radarFiles={unzippedFiles}
        setCurrentFile={setCurrentFile}
        fetchRecent={() => dispatch({ type: FETCH_RECENT })}
      />
    </View>
  );
}

export default Radar;
