import React, { memo } from "react";
import { Svg, Text } from "react-native-svg";

import Lines from "./Lines.js";
import { pad } from "../../helpers/general";

function Hour({ status, stamp, hourWidth, future, index }) {
  const date = new Date(stamp);
  const isStartOfDay = date.getHours() === 0;
  let opacity = 1;
  if (future && index) {
    opacity = 0.33333 * (1 / index);
  }
  return (
    <Svg
      key={"" + stamp}
      opacity={opacity}
      height="100"
      width={hourWidth}
      viewBox={`0 0 ${hourWidth} 100`}
    >
      <Lines isStartOfDay={isStartOfDay} hourWidth={hourWidth} />
      <Text textAnchor="middle" x={`${hourWidth / 2 + 1}`} y="40" fill="black">
        {status}
      </Text>
      <Text textAnchor="middle" x={`${hourWidth / 2 + 1}`} y="35" fill="black">
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
