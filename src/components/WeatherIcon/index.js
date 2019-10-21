import React, { memo } from "react";
import { Image } from "react-native";
import PropTypes from "prop-types";

/* eslint-disable no-undef */
export const symb2uri = [
  require("../../../assets/icons/weatherSymbols/0_Default.png"),
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
/* eslint-enable no-undef */

function WeatherIcon({ Wsymb2, size, opacity }) {
  const style = { width: size, height: size, opacity };
  let uri = symb2uri[0];
  if (typeof Wsymb2 === "number" && symb2uri.length >= Wsymb2 && Wsymb2 >= 0) {
    uri = symb2uri[Wsymb2];
  }

  return <Image style={style} source={uri} />;
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
