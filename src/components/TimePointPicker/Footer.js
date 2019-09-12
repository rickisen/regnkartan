import React from "react";
import { View, ActivityIndicator } from "react-native";

import Hour from "./Hour";
import { hourRangeFrom } from "../../helpers/general";

function Footer({ pickerWidth, hourWidth, range, refreshing }) {
  const amountOfFutureHours = Math.floor(pickerWidth / 2 / hourWidth);
  return (
    <View
      style={{
        width: pickerWidth / 2,
        flexDirection: "row",
      }}
    >
      {hourRangeFrom(
        range[range.length - 2] + amountOfFutureHours * 1000 * 60 * 60,
        amountOfFutureHours
      ).map((item, index) => {
        return (
          <Hour
            key={"" + item}
            stamp={item}
            hourWidth={hourWidth}
            index={index}
            status="future"
          />
        );
      })}
      <View
        syle={{
          opacity: 1,
          width: hourWidth,
        }}
      ></View>
    </View>
  );
}

Footer.defaultProps = {
  refreshing: false,
};

export default Footer;
