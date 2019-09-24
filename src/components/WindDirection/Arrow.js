import React, { memo } from "react";
import { View } from "react-native";
import { Svg, G, Path } from "react-native-svg";
import PropTypes from "prop-types";

function Arrow({ size, degrees }) {
  return (
    <View>
      <Svg
        version="1.1"
        viewBox="0 0 50.725897 13.279349"
        height={25.094834 * (size / 100)}
        width={95.85996 * (size / 100)}
      >
        {/*rotate(${degrees}deg)*/}
        <G transform={`translate(12.361314,-285.06866)`}>
          <G style="fill:#000000;fill-opacity:1">
            <Path
              style="opacity:1;vector-effect:none;fill:#000000;fill-opacity:1;stroke:#030000;stroke-width:0.05267964;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              d="m 27.807589,298.29658 h 1.316332 c 0,0 5.20837,-4.84706 9.214327,-6.58824 -4.005957,-1.74119 -9.214327,-6.58825 -9.214327,-6.58825 h -1.316333 c 1.339998,2.2353 6.111702,6.65886 6.581662,6.58825 -0.469959,-0.0706 -5.241664,4.35294 -6.581661,6.58824 z"
            />
            <Path
              style="opacity:1;vector-effect:none;fill:#000000;fill-opacity:1;stroke:#030000;stroke-width:0.04014454;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              d="m -12.336227,287.47476 h 1.389121 l 4.8616894,4.23358 -4.8616894,4.23357 h -1.389121 l 4.398727,-4.23357 z"
            />
            <Path
              style="opacity:1;vector-effect:none;fill:#000000;fill-opacity:1;stroke:#030000;stroke-width:0.05291667;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              d="m -9.161197,291.44375 h 43.722394 v 0.52917 H -9.161197 Z"
            />
            <Path
              style="opacity:1;vector-effect:none;fill:#000000;fill-opacity:1;stroke:#030000;stroke-width:0.04014454;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              d="m -9.6903923,287.47476 h 1.3891201 l 4.8616896,4.23358 -4.8616896,4.23357 h -1.3891201 l 4.3987263,-4.23357 z"
            />
            <Path
              style="opacity:1;vector-effect:none;fill:#000000;fill-opacity:1;stroke:#030000;stroke-width:0.04014454;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              d="m -7.0445588,287.47476 h 1.3891201 l 4.86168957,4.23358 -4.86168957,4.23357 h -1.3891201 l 4.3987263,-4.23357 z"
            />
            <Path
              style="opacity:1;vector-effect:none;fill:#000000;fill-opacity:1;stroke:#030000;stroke-width:0.04014454;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              d="m -4.3987253,287.47476 h 1.3891201 l 4.8616894,4.23358 -4.8616894,4.23357 H -4.3987253 L 9.3666667e-7,291.70834 Z"
            />
          </G>
        </G>
      </Svg>
    </View>
  );
}

Arrow.propTypes = {
  size: PropTypes.number,
  degrees: PropTypes.number,
};
Arrow.defaultProps = {
  size: 100,
  degrees: 0,
};

export default memo(Arrow);
