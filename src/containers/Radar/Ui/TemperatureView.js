import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";

import Thermometer from "../../../components/Thermometer";
import { selectTemperature } from "../../../redux/selectors/pointAnalysis.js";

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

function TemperatureView() {
  const selectedTemperature = useSelector(selectTemperature);
  const temp =
    typeof selectedTemperature === "number" ? selectedTemperature + "°C" : null;

  return (
    <View style={styles.container}>
      <Thermometer degrees={selectedTemperature} />
      <Text style={styles.text}>{temp}</Text>
    </View>
  );
}

export default TemperatureView;
