import React, { memo, useRef, useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { Animated } from "react-native";
import { Svg, Path, Text, G, Line } from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);

function animationListener(animation) {
  if (this.ref && this.ref.current && this.ref.current.setNativeProps) {
    this.ref.current.setNativeProps({
      matrix: [1, 0, 0, 1, 1, animation.value],
    });
  }
}

function useCropAnimation({ degrees, duration }) {
  const d10 = Math.round(degrees / 10) * 100;
  const [offset] = useState(new Animated.Value(d10));
  const ref = useRef(null);

  useEffect(() => {
    Animated.timing(offset, {
      toValue: d10 - 100,
      duration,
      useNativeDriver: false,
      isInteraction: false,
    }).start();
  }, [d10]);

  offset.addListener(animationListener.bind({ ref }));

  return ref;
}

function Thermometer({ degrees, showFluid }) {
  const fluidHeight = 300 - degrees * 10;
  const ref = useCropAnimation({
    degrees,
    duration: 200,
  });

  return (
    <Svg viewBox="-65 100 150 200" width="75" height="100" version="1.1">
      <AnimatedG ref={ref}>
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
          <G fontSize="40px" x="159.34995" textAnchor="middle" fill="#000000">
            <G fill="#ff0000" x="-10">
              <Text y="960.70099">-30</Text>
              <Text y="860.70099">-20</Text>
              <Text y="760.70099">-10</Text>
            </G>
            <Text y="660.70099">0</Text>
            <Text y="560.70099">10</Text>
            <Text y="460.70096">20</Text>
            <Text y="360.70096">30</Text>
            <Text y="260.70096">40</Text>
            <Text y="160.70096">50</Text>
          </G>
        </G>
        <Path
          d="M 0.510984,-199.951 H 16.510322 V 601.29949 H 0.510984 Z"
          stroke="#000000"
          strokeWidth="1"
          fill="transparent"
        />
      </AnimatedG>
    </Svg>
  );
}

Thermometer.propTypes = {
  degrees: PropTypes.number,
};

Thermometer.defaultProps = {
  degrees: 0,
};

export default memo(Thermometer);
