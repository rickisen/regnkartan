import React, { memo } from "react";
import { Svg, Text } from "react-native-svg";

import Lines from "./Lines.js";
import { pad } from "../../helpers/general";

function Hour({ status, stamp, hourWidth, index }) {
  const date = new Date(stamp);
  const isStartOfDay = date.getHours() === 0;
  const statusColor = statusToColor(status);
  let opacity = 1;
  if (status === "future" && index) {
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
      <Lines
        color={statusColor}
        isStartOfDay={isStartOfDay}
        hourWidth={hourWidth}
      />
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

function statusToColor(status) {
  switch (status) {
    case "qued":
      return "#777";
    case "loading":
      return "#555";
    case "loaded":
      return "#222";
    case "failed":
      return "#a00";
    case "unzipping":
      return "#111";
    case "unzipped":
      return "#000";
    case "unzip-fail":
      return "#a0a";
    case "future":
      return "#aaa";
    default:
      return "#aaa";
  }
}

export default memo(Hour);
