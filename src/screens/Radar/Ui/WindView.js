import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";

import WindDirection from "../../../components/WindDirection";
import { selectWindDirection } from "../../../redux/modules/pointAnalysis";

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flexDirection: "row",
  },
  text: {
    fontSize: 25,
    paddingHorizontal: 10,
  },
});

function WindView() {
  const degrees = useSelector(selectWindDirection);
  const disabled = typeof degrees !== "number";

  return (
    <View style={styles.container}>
      <WindDirection size={75} degrees={degrees} disabled={disabled} />
      <View>
        <Text style={styles.text}>
          {disabled ? "" : `Wind Direction: ${degrees}°`}
        </Text>
      </View>
    </View>
  );
}

export default WindView;
