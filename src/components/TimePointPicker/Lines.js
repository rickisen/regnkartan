import React, { memo } from "react";
import { Line } from "react-native-svg";

import { statusToColor } from "./helpers";

function RulerLines({ status, stamp, hourWidth }) {
  const everyTenth = hourWidth / 4;
  const everyHalf = hourWidth / 2;
  const minutes = Array.from(Array(hourWidth), (v, i) => i);
  const color = statusToColor(status);
  const nowStamp = new Date().getTime();
  const hourStamp = parseInt(stamp);

  // Have to pad with +1px because the first line will be half cropped from
  // beeing half outside the svg. Apparently lines anchor point is in its
  // center
  return (
    <>
      {minutes.map(minute => {
        let stroke = color;
        // So we dont show future time as unpacked
        if (
          status === "unpacked" &&
          hourStamp + 1000 * 60 * minute - 1000 * 60 * 30 > nowStamp
        ) {
          stroke = statusToColor("unset");
        }
        return minute % everyTenth === 0 || minute % everyHalf === 0 ? (
          <Line
            key={minute}
            x1={minute + 1}
            y2="0"
            x2={minute + 1}
            y1={
              minute % everyHalf === 0 ? (minute === everyHalf ? 20 : 15) : 10
            }
            stroke={stroke}
            strokeWidth="1"
          />
        ) : null;
      })}
    </>
  );
}

export default memo(RulerLines);
