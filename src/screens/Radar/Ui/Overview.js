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
  errorTopic: {
    fontSize: 20,
    margin: 10,
    color: "#333",
    textAlign: "center",
  },
  errorPara: {
    fontSize: 16,
    margin: 10,
    color: "#666",
    textAlign: "center",
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
    pmean,
    icon,
    cloudCoverage,
    cloudCoverageMean,
  } = useSelector(getPointAnalysis);

  let disabled = false;
  if (
    visibility == undefined ||
    humidity == undefined ||
    (precipitation == undefined && pmean === undefined) ||
    icon == undefined ||
    (cloudCoverage == undefined && cloudCoverageMean === undefined)
  ) {
    disabled = true;
  }

  if (disabled) {
    return (
      <View>
        <Text style={styles.errorTopic}>Extended Data Not Available</Text>
        <Text style={styles.errorPara}>
          SMHI only offers historical point based weather data for a limited
          time.
        </Text>
      </View>
    );
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
            <Text style={styles.text}>{`Cloud Coverage: ${
              cloudCoverage === undefined ? cloudCoverageMean : cloudCoverage
            }%`}</Text>
            <Text style={styles.text}>{`Precipitation: ${
              precipitation === undefined ? pmean : precipitation
            }mm`}</Text>
          </>
        )}
      </View>
    </View>
  );
}

export default Overview;
