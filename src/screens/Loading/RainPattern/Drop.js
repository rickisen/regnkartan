import { Svg, LinearGradient, Defs, Path, Stop } from "react-native-svg";
import React, { memo } from "react";

function Drop() {
  return (
    <Svg viewBox="0 0 500 45" height="45px" width="400px">
      <Defs>
        <LinearGradient id="drop-grad" x1="0" x2="375" y1="0" y2="45">
          <Stop stopColor="#2676B0" offset="0" />
          <Stop stopColor="#65C8D6" offset="1" />
        </LinearGradient>
      </Defs>
      <Path
        id="drop"
        d="m0 22.5c-2e-5-12.426 10.074-22.5 22.5-22.5l330 .00014c12.426 0 22.5 10.074 22.5 22.5s-10.074 22.5-22.5 22.5l-330-.00014c-12.426 0-22.5-10.074-22.5-22.5z"
        fill="url(#drop-grad)"
      />
    </Svg>
  );
}

export default memo(Drop);
