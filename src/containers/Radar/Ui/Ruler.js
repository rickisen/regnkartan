import React from "react";
import { PropTypes } from "prop-types";
import { Svg } from "expo";

import { pad, timeFromDateCode } from "../../../helpers/general";

const { Line, Text, G } = Svg;

function isFirstOnHour(dateCode) {
  if (typeof dateCode === "string" && dateCode.length === 10) {
    return (
      dateCode[dateCode.length - 2] === "0" &&
      dateCode[dateCode.length - 1] === "0"
    );
  }
  return false;
}

function isHalfHourIncrement(dateCode) {
  if (typeof dateCode === "string" && dateCode.length === 10) {
    const minutes =
      dateCode[dateCode.length - 2] + dateCode[dateCode.length - 1];
    return minutes === "00" || minutes === "30";
  }
}

export default function({
  selectedRange: { dateCodeRange, start, end },
  currentImage,
  svgWidth,
}) {
  const lines = dateCodeRange.filter(isHalfHourIncrement);
  const selectedDate = timeFromDateCode(currentImage);

  return (
    <Svg width={svgWidth} height="40" viewBox={`0 0 ${svgWidth} 40`}>
      <G y="10">
        <Text fill="white" x={svgWidth / 2 - 55 / 2}>
          {`${pad(selectedDate.getDate())}/${pad(
            selectedDate.getHours()
          )}:${pad(selectedDate.getMinutes())}`}
        </Text>
        <Text fill="white">
          {`${pad(start.getDate())}/${pad(start.getHours())}:${pad(
            start.getMinutes()
          )}`}
        </Text>
        <Text x={svgWidth - 55} fill="white">
          {`${pad(end.getDate())}/${pad(end.getHours())}:${pad(
            end.getMinutes()
          )}`}
        </Text>
      </G>
      <G y="30">
        {lines.map((c, i) => {
          const xPos = (i / lines.length) * svgWidth;
          const opacity = 0.75;
          const firstOnHour = isFirstOnHour(c);
          return (
            <Line
              key={c}
              x1={xPos}
              y2="0"
              x2={xPos}
              y1={firstOnHour ? "-10" : "-5"}
              stroke={`rgba(255,255,255, ${opacity})`}
              strokeWidth={1}
            />
          );
        })}
      </G>
    </Svg>
  );
}
