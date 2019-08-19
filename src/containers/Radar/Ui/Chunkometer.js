import React from "react";
import { Rect, G, Svg } from "react-native-svg";

import * as localTypes from "./localTypes";
import { propTypes as zipTypes } from "../../../redux/modules/zip";

function timeRelativeInRange(time, { start, end }) {
  const max = end.getTime() - start.getTime();
  const current = time.getTime() - start.getTime();

  return current / max;
}

function statusToColor(status) {
  switch (status) {
    case "qued":
      return "rgba(100,100,100,0.0)";
    case "loading":
      return "rgba(100,100,100,0.1)";
    case "loaded":
      return "rgba(100,100,100,0.2)";
    case "unzipping":
      return "rgba(100,100,100,0.3)";
    case "unzipped":
      return "rgba(100,100,100,0.75)";
    case "failed":
      return "rgba(255,100,100,0.4)";
    case "unzip-fail":
      return "rgba(100,100,100,0.0)";
    default:
      return "rgba(100,100,100,0)";
  }
}

const Chunkometer = ({ svgWidth, chunks, selectedRange }) => {
  if (!chunks) {
    return null;
  }

  return (
    <Svg width={svgWidth} height="20" viewBox={`0 0 ${svgWidth} 20`}>
      <G y={5}>
        {chunks.toArray().map(([t, chunk]) => {
          const time = new Date(t);
          time.setHours(time.getUTCHours()); // migth not be the right thing to do
          const margin = 2;
          const xPos =
            timeRelativeInRange(time, selectedRange) * svgWidth + margin / 2;
          const xPosEnd =
            timeRelativeInRange(
              new Date(time.getTime() + chunk.chunkSize),
              selectedRange
            ) *
              svgWidth -
            margin / 2;
          const width = xPosEnd - xPos;
          const bg = statusToColor(chunk.status);
          return (
            <Rect
              x={xPos}
              width={width}
              height={8}
              rx={3}
              ry={3}
              key={time}
              fill={bg}
              stroke={`rgba(100,100,100, ${
                chunk.status === "unzipped" ? "0" : "0.5"
              })`}
            />
          );
        })}
      </G>
    </Svg>
  );
};

Chunkometer.propTypes = {
  svgWidth: localTypes.svgWidth,
  chunks: zipTypes.chunks,
};

export default Chunkometer;
