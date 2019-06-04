import React from "react";
import { PropTypes } from "prop-types";
import { Svg } from "expo";

const { Rect, G } = Svg;

export default function({ svgWidth, chunks }) {
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
              bg = "rgba(255,255,255,0.3)";
              break;
            case "loading":
              bg = "rgba(255,220,180,0.3)";
              break;
            case "loaded":
              bg = "rgba(255,255,180,0.4)";
              break;
            case "unzipping":
              bg = "rgba(200,220,120,0.4)";
              break;
            case "unzipped":
              bg = "rgba(175,200,100,0.5)";
              break;
            case "failed":
              bg = "rgba(255,100,100,0.4)";
              break;
            case "unzip-fail":
              bg = "rgba(255,100,255,0.4)";
              break;
            default:
              bg = "rgba(255,255,255,0.2)";
          }
          return (
            <Rect
              x={xPos}
              width={width}
              height={5}
              key={chunk.time}
              fill={bg}
            />
          );
        })}
      </G>
    </Svg>
  );
}
