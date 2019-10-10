import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";

import WeatherIcon from "../../../components/WeatherIcon";
import { getPointAnalysis } from "../../../redux/modules/pointAnalysis";

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

const Wsymb2Desc = [
  "Unknown",
  "Clear Sky",
  "Nearly Clear Sky",
  "Variable Cloudiness",
  "Half Clear Sky",
  "Cloudy Sky",
  "Overcast",
  "Fog",
  "Light Rain Showers",
  "Moderate Rain Showers",
  "Heavy Rain Showers",
  "Thunder Storm",
  "Light Sleet Showers",
  "Moderate Sleet Showers",
  "Heavy Sleet Showers",
  "Light Snow Showers",
  "Moderate Snow Showers",
  "Heavy Snow Showers",
  "Light Rain",
  "Moderate Rain",
  "Heavy Rain",
  "Thunder",
  "Light Sleet",
  "Moderate Sleet",
  "Heavy Sleet",
  "Light Snow",
  "Moderate Snow",
  "Heavy Snow",
];

function Overview() {
  const {
    visibility,
    humidity,
    precipitation,
    icon,
    cloudCoverage,
  } = useSelector(getPointAnalysis);

  let disabled = false;
  if (
    visibility == undefined ||
    humidity == undefined ||
    precipitation == undefined ||
    icon == undefined ||
    cloudCoverage == undefined
  ) {
    disabled = true;
  }

  return (
    <View style={styles.container}>
      <WeatherIcon size={75} Wsymb2={icon} />
      <View>
        <Text style={styles.topic}>
          {disabled ? "Unknown" : Wsymb2Desc[icon]}
        </Text>
        {!disabled && (
          <>
            <Text style={styles.text}>{`Humidity: ${humidity}%`}</Text>
            <Text style={styles.text}>{`Visibility: ${visibility}km`}</Text>
            <Text
              style={styles.text}
            >{`Cloud Coverage: ${cloudCoverage}%`}</Text>
            <Text
              style={styles.text}
            >{`Precipitation: ${precipitation}mm`}</Text>
          </>
        )}
      </View>
    </View>
  );
}

export default Overview;
