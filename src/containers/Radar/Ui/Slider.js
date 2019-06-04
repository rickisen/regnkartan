import React from "react";
import { PropTypes } from "prop-types";
import { Svg } from "expo";

const { Line, Path, G } = Svg;

export default function({ dateCodeRange, currentImage, svgWidth }) {
  return (
    <Svg width={svgWidth} height="40" viewBox={`0 0 ${svgWidth} 40`}>
      <G y="25">
        <Line
          x1={0}
          y1={0}
          x2={svgWidth}
          y2={0}
          stroke={`rgba(0,0,0, ${0.5})`}
          strokeWidth={1}
        />
        <G
          scale={1}
          y={-25}
          x={
            (dateCodeRange.indexOf(currentImage) / dateCodeRange.length) *
            svgWidth
          }
        >
          <Path
            x={-10}
            fill="white"
            stroke="transparent"
            stroke-width="2"
            d="M15 3 Q16.5 6.8 25 18 A12.8 12.8 0 1 1 5 18 Q13.5 6.8 15 3z"
          />
        </G>
      </G>
    </Svg>
  );
}
