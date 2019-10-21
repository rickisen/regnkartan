import React, { memo } from "react";
import { Svg, Text, Image } from "react-native-svg";

import Lines from "./Lines.js";
import { pad } from "../../helpers";
import { statusToColor } from "./helpers";
import { symb2uri } from "../../components/WeatherIcon";

function Hour({ status, stamp, hourWidth, Wsymb2 }) {
  const date = new Date(stamp);
  const statusColor = statusToColor(status);
  let opacity = 1;
  let uri = symb2uri[0];
  if (typeof Wsymb2 === "number" && symb2uri.length >= Wsymb2 && Wsymb2 >= 0) {
    uri = symb2uri[Wsymb2];
  }

  return (
    <Svg
      key={"" + stamp}
      opacity={opacity}
      height="65"
      width={hourWidth}
      viewBox={`0 0 ${hourWidth} 65`}
    >
      <Lines stamp={stamp} status={status} hourWidth={hourWidth} />
      <Text
        textAnchor="middle"
        x={`${hourWidth / 2 + 1}`}
        y="35"
        fill={statusColor}
      >
        {`${pad(date.getHours())}:00`}
      </Text>
      {uri && (
        <Image
          width={16}
          height={16}
          x={`${hourWidth / 2 - 8}`}
          y="40"
          href={uri}
        />
      )}
    </Svg>
  );
}

export default memo(Hour);
