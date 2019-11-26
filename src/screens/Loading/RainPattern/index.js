import React, { memo } from "react";
import { View } from "react-native";
import RainTile from "./RainTile";

function RainPattern() {
  return (
    <View
      style={{
        transform: [{ scale: 0.75 }, { rotateZ: "45deg" }],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <RainTile />
        <RainTile />
        <RainTile />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <RainTile />
        <RainTile />
        <RainTile />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <RainTile />
        <RainTile />
        <RainTile />
      </View>
    </View>
  );
}

RainPattern.propTypes = {};
RainPattern.defaultProps = {};

export default memo(RainPattern);
