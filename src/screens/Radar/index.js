import React from "react";
import { PropTypes } from "prop-types";
import { StyleSheet, View } from "react-native";

import Ui from "./Ui";
import RadarMap from "./RadarMap";

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
  return (
    <View style={styles.container}>
      <RadarMap />
      <Ui />
    </View>
  );
}

export default Radar;
