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
  topic: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  text: {
    paddingHorizontal: 10,
  },
});

function WindView() {
  const { degrees, speed, gust } = useSelector(selectWindDirection);
  const disabled = typeof degrees !== "number";

  return (
    <View style={styles.container}>
      <WindDirection size={75} degrees={degrees} disabled={disabled} />
      <View>
        <Text style={styles.topic}>Wind</Text>
        <Text style={styles.text}>
          {disabled ? "" : `Direction: ${degrees}°`}
        </Text>
        <Text style={styles.text}>{disabled ? "" : `Speed: ${speed}m/s`}</Text>
        <Text style={styles.text}>
          {disabled ? "" : `Gust Speed: ${gust}m/s`}{" "}
        </Text>
      </View>
    </View>
  );
}

export default WindView;
