import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";

import Thermometer from "../../../components/Thermometer";
import { selectTemperature } from "../../../redux/modules/pointAnalysis";

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
  const showFluid = typeof selectedTemperature === "number";
  const temp = showFluid ? selectedTemperature + "°C" : null;

  return (
    <View style={styles.container}>
      <Thermometer degrees={selectedTemperature} showFluid={showFluid} />
      <Text style={styles.text}>{temp}</Text>
    </View>
  );
}

export default TemperatureView;
