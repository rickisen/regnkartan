import React, { useEffect } from "react";
import { PropTypes } from "prop-types";
import { useDispatch } from "react-redux";
import { StyleSheet, View } from "react-native";

import Ui from "./Ui";
import RadarMap from "./RadarMap";
import { CLEAR_CACHE } from "../../redux/modules/rainRadar";
import { ASSERT_LOCATION } from "../../redux/modules/permissions";

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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: CLEAR_CACHE }); //TODO: Do this on real app load
    dispatch({ type: ASSERT_LOCATION });
  }, []);

  return (
    <View style={styles.container}>
      <RadarMap />
      <Ui />
    </View>
  );
}

export default Radar;
