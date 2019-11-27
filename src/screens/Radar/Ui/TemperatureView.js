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
  topic: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  text: {
    paddingHorizontal: 10,
  },
});

function TemperatureView() {
  const { temperature, wetBulb } = useSelector(selectTemperature);
  const showFluid = typeof temperature === "number";

  if (!showFluid) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Thermometer degrees={temperature} showFluid={showFluid} />
      <View>
        <Text style={styles.topic}>Temperature</Text>
        {showFluid && (
          <>
            <Text style={styles.text}>{`Temperature: ${temperature}°C`}</Text>
            {wetBulb && (
              <Text style={styles.text}>{`Wet Bulb: ${wetBulb}°C`}</Text>
            )}
          </>
        )}
      </View>
    </View>
  );
}

export default TemperatureView;
