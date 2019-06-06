import React from "react";
import { PropTypes } from "prop-types";
import { Svg } from "expo";

import * as localTypes from "./localTypes";

const { Rect, G } = Svg;

const Chunkometer = ({ svgWidth, chunks }) => {
  return (
    <Svg width={svgWidth} height="20" viewBox={`0 0 ${svgWidth} 20`}>
      <G y={5}>
        {[...chunks].reverse().map((chunk, i) => {
          const margin = 2;
          const xPos = (i / chunks.length) * svgWidth + margin / 2;
          const width = svgWidth / chunks.length - margin;
          let bg = "";
          switch (chunk.status) {
            case "qued":
              bg = "rgba(255,255,255,0.0)";
              break;
            case "loading":
              bg = "rgba(255,255,255,0.1)";
              break;
            case "loaded":
              bg = "rgba(255,255,255,0.2)";
              break;
            case "unzipping":
              bg = "rgba(255,255,255,0.3)";
              break;
            case "unzipped":
              bg = "rgba(255,255,255,0.75)";
              break;
            case "failed":
              bg = "rgba(255,100,100,0.4)";
              break;
            case "unzip-fail":
              bg = "rgba(255,255,255,0.0)";
              break;
            default:
              bg = "rgba(255,255,255,0)";
          }
          return (
            <Rect
              x={xPos}
              width={width}
              height={8}
              rx={3}
              ry={3}
              key={chunk.time}
              fill={bg}
              stroke={`rgba(255,255,255, ${
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
  chunks: localTypes.chunks,
};

export default Chunkometer;
