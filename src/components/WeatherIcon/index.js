import React, { memo } from "react";
import { Image, View } from "react-native";
import PropTypes from "prop-types";

const symb2uri = [
  /* eslint-disable no-undef */
  require("../../../assets/icons/weatherSymbols/1_ClearSky.png"), // Wsymb2 api starts at 1, could have a default icon here
  require("../../../assets/icons/weatherSymbols/1_ClearSky.png"),
  require("../../../assets/icons/weatherSymbols/2_NearlyClearSky.png"),
  require("../../../assets/icons/weatherSymbols/3_VariableCloudiness.png"),
  require("../../../assets/icons/weatherSymbols/4_HalfClearSky.png"),
  require("../../../assets/icons/weatherSymbols/5_CloudySky.png"),
  require("../../../assets/icons/weatherSymbols/6_Overcast.png"),
  require("../../../assets/icons/weatherSymbols/7_Fog.png"),
  require("../../../assets/icons/weatherSymbols/8_LightRainShowers.png"),
  require("../../../assets/icons/weatherSymbols/9_ModerateRainShowers.png"),
  require("../../../assets/icons/weatherSymbols/10_HeavyRainShowers.png"),
  require("../../../assets/icons/weatherSymbols/11_ThunderStorm.png"),
  require("../../../assets/icons/weatherSymbols/12_LightSleetShowers.png"),
  require("../../../assets/icons/weatherSymbols/13_ModerateSleetShowers.png"),
  require("../../../assets/icons/weatherSymbols/14_HeavySleetShowers.png"),
  require("../../../assets/icons/weatherSymbols/15_LightSnowShowers.png"),
  require("../../../assets/icons/weatherSymbols/16_ModerateSnowShowers.png"),
  require("../../../assets/icons/weatherSymbols/17_HeavySnowShowers.png"),
  require("../../../assets/icons/weatherSymbols/18_LightRain.png"),
  require("../../../assets/icons/weatherSymbols/19_ModerateRain.png"),
  require("../../../assets/icons/weatherSymbols/20_HeavyRain.png"),
  require("../../../assets/icons/weatherSymbols/21_Thunder.png"),
  require("../../../assets/icons/weatherSymbols/22_LightSleet.png"),
  require("../../../assets/icons/weatherSymbols/23_ModerateSleet.png"),
  require("../../../assets/icons/weatherSymbols/24_HeavySleet.png"),
  require("../../../assets/icons/weatherSymbols/25_LightSnow.png"),
  require("../../../assets/icons/weatherSymbols/26_ModerateSnow.png"),
  require("../../../assets/icons/weatherSymbols/27_HeavySnow.png"),
];

function WeatherIcon({ Wsymb2, size, opacity }) {
  let disabled = true;
  let uri = "";
  if (typeof Wsymb2 === "number" && symb2uri.length >= Wsymb2 && Wsymb2 >= 0) {
    disabled = false;
    uri = symb2uri[Wsymb2];
  }
  return (
    <View style={{ width: size, alignItems: "middle", opacity }}>
      {!disabled && <Image source={uri} />}
    </View>
  );
}

WeatherIcon.propTypes = {
  Wsymb2: PropTypes.number,
  size: PropTypes.number,
  opacity: PropTypes.number,
};
WeatherIcon.defaultProps = {
  Wsymb2: 0,
  size: 32,
  opacity: 0.5,
};

export default memo(WeatherIcon);
