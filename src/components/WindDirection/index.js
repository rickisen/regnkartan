import React, { useEffect, useState } from "react";
import { View, Animated, Text } from "react-native";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import Arrow from "./Arrow";
import Background from "./Background";
import { selectWindDirection } from "../../redux/selectors/pointAnalysis";

export const useAnimation = ({ degrees, duration }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: degrees,
      duration,
    }).start();
  }, [degrees]);

  return animation;
};

function WindDirection({ size }) {
  const degrees = useSelector(selectWindDirection);
  const disabled = typeof degrees !== "number";
  const animation = useAnimation({
    degrees: (degrees || 0) - 90,
    duration: 400,
  });

  return (
    <View>
      <Background size={size} />
      <Animated.View
        style={{
          position: "absolute",
          transform: [
            { translateY: size / 2 - (25.094834 * (size / 100)) / 2 },
            {
              rotate: animation.interpolate({
                inputRange: [-90, 360],
                outputRange: ["-90deg", "360deg"],
              }),
            },
            { scale: 0.8 },
          ],
        }}
      >
        {!disabled && <Arrow size={size} />}
      </Animated.View>
      <Text>
        {disabled ? "Wind Direction unknown" : `Wind Direction: ${degrees}°`}
      </Text>
    </View>
  );
}

WindDirection.propTypes = {
  size: PropTypes.number,
};
WindDirection.defaultProps = {
  size: 100,
};

export default WindDirection;
