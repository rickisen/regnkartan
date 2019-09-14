import React, { memo } from "react";
import { Svg, Text } from "react-native-svg";

import Lines from "./Lines.js";
import { pad } from "../../helpers/general";
import { statusToColor } from "./helpers";

function Hour({ status, stamp, hourWidth }) {
  const date = new Date(stamp);
  const isStartOfDay = date.getHours() === 0;
  const statusColor = statusToColor(status);
  let opacity = 1;
  return (
    <Svg
      key={"" + stamp}
      opacity={opacity}
      height="100"
      width={hourWidth}
      viewBox={`0 0 ${hourWidth} 100`}
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
      {isStartOfDay && (
        <Text
          textAnchor="middle"
          x={`${hourWidth / 2 + 1}`}
          y="62"
          fill="black"
          fontSize="20"
        >
          {`${pad(date.getDate())}/${date.getMonth() + 1}`}
        </Text>
      )}
    </Svg>
  );
}

export default memo(Hour);
