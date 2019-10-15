import React, { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { PropTypes } from "prop-types";
import { FlatList, View } from "react-native";
import { Svg, Path, G } from "react-native-svg";

import { propTypes as chunkTypes } from "../../redux/modules/wheatherData";
import Hour from "./Hour";
import Footer from "./Footer";
import { hourRangeFrom } from "../../helpers";
import { chunkStatusForHour } from "./helpers";

function TimePointPicker({
  chunks,
  range,
  initialHour,
  onSelected,
  onSelectedHour,
  refreshing,
  onRefresh,
}) {
  const hourWidth = 60;

  const [pickerWidth, setPickerWidth] = useState(375); // maybe initialize with styled value?
  const onLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }) => setPickerWidth(width);

  const [scrolled, setScrolled] = useState(initialHour);
  const onScroll = ({
    nativeEvent: {
      contentOffset: { x },
    },
  }) => {
    setScrolled(x);
  };
  // Includes offsets so we get what's at the center of the list, instead of
  // the left most part of the screen
  const middleOfPicker = scrolled + pickerWidth / 2 - hourWidth / 2;
  let over = false;
  let under = false;
  let selectedHour = range[0];
  const selectedIndex = Math.floor(middleOfPicker / hourWidth);
  if (range[selectedIndex]) {
    selectedHour = range[selectedIndex];
  } else if (selectedIndex >= range.length - 1) {
    over = true;
  } else {
    under = true;
  }
  const minutes = Math.floor(
    ((middleOfPicker - selectedIndex * hourWidth) / hourWidth) * 60
  );

  // Run the callback and pass the selected timestamp, if selection changed
  useEffect(() => onSelected(selectedHour + minutes * 1000 * 60), [
    selectedHour,
    minutes,
  ]);

  // Run a callback for every hour touched (with a timer to prevent accidental
  // loading)
  const selectHourTimer = useRef(null);
  useEffect(() => {
    if (!over && !under) {
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      clearTimeout(selectHourTimer.current);
      selectHourTimer.current = setTimeout(() => {
        onSelectedHour(selectedHour);
      }, 400);
    }
  }, [selectedHour, selectHourTimer, over, under]);

  const refreshTimer = useRef(null);
  useEffect(() => {
    if (over && !refreshing) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).then(() => {
          onRefresh();
        });
      }, 400);
    }
  }, [over, refreshing, refreshTimer]);

  const flatList = useRef(null);
  useEffect(() => {
    const offsetInMinutes = (new Date().getTime() - range[0]) / 1000 / 60;
    const minutesPerPx = hourWidth / 60;
    const offsetToNow =
      offsetInMinutes * minutesPerPx - pickerWidth / 2 + hourWidth;

    setTimeout(() => {
      flatList.current.scrollToOffset({
        animated: true,
        offset: offsetToNow,
      });
    }, 10);
  }, []);
  return (
    <View
      onLayout={onLayout}
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Svg
          width={pickerWidth}
          height="20"
          viewBox={`0 0 5.2916665 5.2916665`}
        >
          <G transform="translate(0,-291.70833)" id="layer1">
            <Path
              id="rect4518"
              d="M 2.38125,291.70833 H 2.9104167 L 2.6458333,297 Z"
              fill="#666"
            />
          </G>
        </Svg>
      </View>
      <FlatList
        ref={flatList}
        data={range}
        initialScrollIndex={initialHour}
        ListFooterComponent={
          <Footer
            refreshing={refreshing}
            pickerWidth={pickerWidth}
            hourWidth={hourWidth}
            range={range}
          />
        }
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <Hour
              status={chunkStatusForHour(item, chunks)}
              stamp={item}
              hourWidth={hourWidth}
              index={index}
            />
          );
        }}
        keyExtractor={stamp => "" + stamp}
        onScroll={onScroll}
        getItemLayout={(data, index) => ({
          length: hourWidth,
          offset: hourWidth * index,
          index,
        })}
      />
    </View>
  );
}

TimePointPicker.defaultProps = {
  chunks: {},
  range: hourRangeFrom(),
  initialHour: hourRangeFrom().length - 1,
  onSelected: () => {},
  onSelectedHour: () => {},
  onRefresh: () => {},
  refreshing: false,
};

TimePointPicker.propTypes = {
  chunks: chunkTypes.chunks,
  range: PropTypes.arrayOf(PropTypes.number),
  initialHour: PropTypes.number,
  onSelected: PropTypes.func,
  onSelectedHour: PropTypes.func,
  refreshing: PropTypes.bool,
};

export default TimePointPicker;
