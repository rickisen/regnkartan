import React, { memo } from "react";
import { View } from "react-native";
import Row from "./Row";

function RainTile() {
  return (
    <View
      style={{
        width: 400,
        height: 400,
        overflow: "hidden",
      }}
    >
      <View>
        <Row duration={1000} />
        <Row duration={1200} />
      </View>
    </View>
  );
}

export default memo(RainTile);
