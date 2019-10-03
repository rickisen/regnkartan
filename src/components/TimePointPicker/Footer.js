import React from "react";
import { View, ActivityIndicator } from "react-native";

import Hour from "./Hour";
import { hourRangeFrom } from "../../helpers";

function Footer({ pickerWidth, hourWidth, range, refreshing }) {
  const amountOfFutureHours = Math.floor(pickerWidth / 2 / hourWidth);
  const hours = hourRangeFrom(
    range[range.length - 2] +
      amountOfFutureHours * 1000 * 60 * 60 -
      (refreshing ? 1 : 0),
    amountOfFutureHours
  );
  const currentHourCompleted = new Date().getUTCMinutes() / 60;
  const hourPad = (1 - currentHourCompleted) * hourWidth;

  return (
    <View
      style={{
        maxWidth: pickerWidth / 2 - hourWidth / 2 - hourPad,
        flexDirection: "row",
      }}
    >
      {hours.map((item, index) => {
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
      {refreshing && (
        <View
          syle={{
            width: hourWidth,
          }}
        >
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}

Footer.defaultProps = {
  refreshing: false,
};

export default Footer;
