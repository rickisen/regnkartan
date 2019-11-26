import React, { memo, useState } from "react";
import { Animated, Easing } from "react-native";
import PropTypes from "prop-types";

import Drop from "./Drop";

const useLoopAnimation = duration => {
  const [val] = useState(new Animated.Value(0));

  Animated.loop(
    Animated.timing(val, {
      toValue: 99,
      duration,
      useNativeDriver: true,
      easing: Easing.linear,
      isInteraction: false,
    }),
    { iterations: -1 }
  ).start();

  return val;
};

function Droplets({ duration, scale }) {
  const val = useLoopAnimation(duration);
  return (
    <Animated.View
      style={{
        transform: [
          {
            translateX: val.interpolate({
              inputRange: [0, 100],
              outputRange: [-600, -200],
            }),
          },
          { scale },
        ],
        flexDirection: "row",
        marginTop: 55,
      }}
    >
      <Drop />
      <Drop />
      <Drop />
    </Animated.View>
  );
}

Droplets.propTypes = {
  duration: PropTypes.number,
  scale: PropTypes.number,
};

Droplets.defaultProps = {
  duration: 1000,
  scale: 1,
};

export default memo(Droplets);
