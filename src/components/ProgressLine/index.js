import React, { memo, useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", alignItems: "stretch" },
});

const useAnimation = ({ percent, duration }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: percent,
      duration,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, [percent]);

  return animation;
};

function ProgressLine({ percent, color, height, style }) {
  const [width, setWidth] = useState(300);
  const onLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }) => {
    setWidth(width);
  };
  const animation = useAnimation({
    percent,
    duration: 200,
  });

  return (
    <View onLayout={onLayout} style={[styles.container, style]}>
      <Animated.View
        style={{
          backgroundColor: color,
          height,
          width: 2,
          transform: [
            {
              scaleX: animation.interpolate({
                inputRange: [0, 100],
                outputRange: [0, width],
              }),
            },
          ],
          opacity: animation.interpolate({
            inputRange: [1, 5, 50, 80, 100],
            outputRange: [1, 0.2, 0.4, 0.8, 0],
          }),
        }}
      ></Animated.View>
    </View>
  );
}

ProgressLine.propTypes = {
  percent: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
ProgressLine.defaultProps = {
  percent: 0,
  color: "rgb(50,80,120)",
  height: 1,
};

export default memo(ProgressLine);
