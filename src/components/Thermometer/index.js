import React, { memo, useRef, useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { Animated } from "react-native";
import { Svg, Path, Text, G, Line } from "react-native-svg";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

function animationListener(animation) {
  const d10 = parseInt(animation.value.toString()); //TODO: find better way of accessing
  let viewBox = `-65 100 150 200`;
  if (typeof d10 === "number") {
    viewBox = `-65 ${d10 * -1 + 200} 150 200`;
  }
  // this.ref.current.setNativeProps({ viewBox });
  this.setViewBox(viewBox);
}

function useAnimation({ d10, duration }) {
  const [animation] = useState(new Animated.Value(0));
  const [viewBox, setViewBox] = useState("-65 100 150 200");

  useEffect(() => {
    Animated.timing(animation, {
      toValue: d10,
      duration,
    }).start();
  }, [d10]);

  animation.addListener(animationListener.bind({ setViewBox }));

  return viewBox;
}

function Thermometer({ degrees }) {
  let showFluid = false;
  let fluidHeight = 300;
  // let viewBox = `-65 100 150 200`;
  let d10 = 100;
  if (typeof degrees === "number") {
    fluidHeight = 300 - degrees * 10;
    showFluid = true;
    d10 = Math.round(degrees / 10) * 100;
    // viewBox = `-65 ${d10 * -1 + 200} 150 200`;
  }

  const viewBox = useAnimation({
    d10,
    duration: 200,
  });

  return (
    <AnimatedSvg viewBox={viewBox} width="75" height="100" version="1.1">
      {showFluid && (
        <Path
          d={`M 0.5,${fluidHeight} H 16.521306 V 601.27839 H 0.5 Z`}
          fill="#ff0000"
          stroke="#000000"
          strokeWidth="1"
        />
      )}
      <G transform="translate(-99.339296,-345.4034)">
        <G
          transform="translate(0,-0.79758877)"
          stroke="#000000"
          strokeWidth="1"
        >
          <Line y2="945.70099" x2="39.349949" y1="945.70099" x1="89.349953" />
          <Line y2="925.70099" x2="69.349953" y1="925.70099" x1="89.349953" />
          <Line y2="905.70099" x2="69.349953" y1="905.70099" x1="89.349953" />
          <Line y2="885.70099" x2="69.349953" y1="885.70099" x1="89.349953" />
          <Line y2="865.70099" x2="69.349953" y1="865.70099" x1="89.349953" />
          <Line y2="845.70099" x2="39.349949" y1="845.70099" x1="89.349953" />
          <Line y2="825.70099" x2="69.349953" y1="825.70099" x1="89.349953" />
          <Line y2="805.70099" x2="69.349953" y1="805.70099" x1="89.349953" />
          <Line y2="785.70099" x2="69.349953" y1="785.70099" x1="89.349953" />
          <Line y2="765.70099" x2="69.349953" y1="765.70099" x1="89.349953" />
          <Line y2="745.70099" x2="39.349949" y1="745.70099" x1="89.349953" />
          <Line y2="725.70099" x2="69.349953" y1="725.70099" x1="89.349953" />
          <Line y2="705.70099" x2="69.349953" y1="705.70099" x1="89.349953" />
          <Line y2="685.70099" x2="69.349953" y1="685.70099" x1="89.349953" />
          <Line y2="665.70099" x2="69.349953" y1="665.70099" x1="89.349953" />
          <Line y2="645.70099" x2="39.349949" y1="645.70099" x1="89.349953" />
          <Line y2="625.70099" x2="69.349953" y1="625.70099" x1="89.349953" />
          <Line y2="605.70099" x2="69.349953" y1="605.70099" x1="89.349953" />
          <Line y2="585.70099" x2="69.349953" y1="585.70099" x1="89.349953" />
          <Line y2="565.70099" x2="69.349953" y1="565.70099" x1="89.349953" />
          <Line y2="545.70099" x2="39.349949" y1="545.70099" x1="89.349953" />
          <Line y2="525.70099" x2="69.349953" y1="525.70099" x1="89.349953" />
          <Line y2="505.70096" x2="69.349953" y1="505.70096" x1="89.349953" />
          <Line y2="485.70096" x2="69.349953" y1="485.70096" x1="89.349953" />
          <Line y2="465.70096" x2="69.349953" y1="465.70096" x1="89.349953" />
          <Line y2="445.70096" x2="39.349949" y1="445.70096" x1="89.349953" />
          <Line y2="425.70096" x2="69.349953" y1="425.70096" x1="89.349953" />
          <Line y2="405.70096" x2="69.349953" y1="405.70096" x1="89.349953" />
          <Line y2="385.70096" x2="69.349953" y1="385.70096" x1="89.349953" />
          <Line y2="365.70096" x2="69.349953" y1="365.70096" x1="89.349953" />
          <Line y2="345.70096" x2="39.349949" y1="345.70096" x1="89.349953" />
          <Line y2="325.70096" x2="69.349953" y1="325.70096" x1="89.349953" />
          <Line y2="305.70096" x2="69.349953" y1="305.70096" x1="89.349953" />
          <Line y2="285.70096" x2="69.349953" y1="285.70096" x1="89.349953" />
          <Line y2="265.70096" x2="69.349953" y1="265.70096" x1="89.349953" />
          <Line y2="245.70096" x2="39.349949" y1="245.70096" x1="89.349953" />
          <Line y2="225.70096" x2="69.349953" y1="225.70096" x1="89.349953" />
          <Line y2="205.70096" x2="69.349953" y1="205.70096" x1="89.349953" />
          <Line y2="185.70096" x2="69.349953" y1="185.70096" x1="89.349953" />
          <Line y2="165.70096" x2="69.349953" y1="165.70096" x1="89.349953" />
          <Line y2="145.70096" x2="39.349949" y1="145.70096" x1="89.349953" />
        </G>
        <G fontSize="40px" textAnchor="middle" fill="#000000">
          <Text fill="#ff0000" y="960.70099" x="159.34995" font-size="40px">
            -30
          </Text>
          <Text fill="#ff0000" y="860.70099" x="159.34995" font-size="40px">
            -20
          </Text>
          <Text fill="#ff0000" y="760.70099" x="159.34995" font-size="40px">
            -10
          </Text>
          <Text y="660.70099" x="159.34995" font-size="40px">
            0
          </Text>
          <Text y="560.70099" x="159.34995" font-size="40px">
            10
          </Text>
          <Text y="460.70096" x="159.34995" font-size="40px">
            20
          </Text>
          <Text y="360.70096" x="159.34995" font-size="40px">
            30
          </Text>
          <Text y="260.70096" x="159.34995" font-size="40px">
            40
          </Text>
          <Text y="160.70096" x="159.34995" font-size="40px">
            50
          </Text>
        </G>
      </G>
      <Path
        d="M 0.510984,-199.951 H 16.510322 V 601.29949 H 0.510984 Z"
        stroke="#000000"
        strokeWidth="1"
        fill="transparent"
      />
    </AnimatedSvg>
  );
}

Thermometer.propTypes = {
  degrees: PropTypes.number,
};

Thermometer.defaultProps = {
  degrees: 0,
};

export default memo(Thermometer);
