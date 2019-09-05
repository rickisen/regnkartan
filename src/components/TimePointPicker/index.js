import React, { useState, useEffect, useRef } from "react";
import { PropTypes } from "prop-types";
import { FlatList, View, Text } from "react-native";
import { Svg, Line } from "react-native-svg";

import { propTypes as zipTypes } from "../../redux/modules/zip";
import Hour from "./Hour.js";
import { pad } from "../../helpers/general";

function TimePointPicker({ chunks, range, initialHour, onSelected }) {
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
  } else if (selectedIndex > range.length - 1) {
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

  const flatList = useRef(null);
  useEffect(() => {
    const offsetInMinutes = (new Date().getTime() - range[0]) / 1000 / 60;
    const minutesPerPx = hourWidth / 60;
    const offsetToNow =
      offsetInMinutes * minutesPerPx - pickerWidth / 2 + hourWidth / 2;

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
        justifyContent: "center",
        alignItems: "center",
        height: 150,
      }}
    >
      <View>
        <Text style={{ textAlign: "center" }}>
          {!over && !under
            ? `${pad(new Date(selectedHour).getHours())}:${pad(minutes)}`
            : " "}
        </Text>
      </View>
      <Svg width={pickerWidth} height="10" viewBox={`0 0 ${pickerWidth} 10`}>
        <Line
          stroke="black"
          x1={pickerWidth / 2}
          y1="0"
          x2={pickerWidth / 2}
          y2="10"
          strokeWidth="1"
        />
      </Svg>
      <FlatList
        ref={flatList}
        style={{ height: 100 }}
        contentContainerStyle={{ height: 100 }}
        data={range}
        initialScrollIndex={initialHour}
        ListFooterComponent={() => {
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
            </View>
          );
        }}
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
  initialHour: 99,
  onSelected: () => {},
};

TimePointPicker.propTypes = {
  chunks: zipTypes.chunks,
  range: PropTypes.arrayOf(PropTypes.number),
  initialHour: PropTypes.number,
  onSelected: PropTypes.func,
};

export function hourRangeFrom(start = new Date().getTime(), size = 100) {
  const now = new Date(start);
  now.setUTCMinutes(0);
  now.setUTCSeconds(0);
  now.setUTCMilliseconds(0);
  const endOfThisHour = now.getTime() + 1000 * 60 * 60;
  const startStamp = endOfThisHour - 1000 * 60 * 60 * (size - 1);
  const range = [];

  for (var hour = 0; hour < size; hour++) {
    range[hour] = startStamp + hour * 1000 * 60 * 60;
  }

  return range;
}

/** @function chunkStatusForHour
 * @param {number} hour - timestamp of the hour to check
 * @param {object} chunks - object holding the chunks to test against
 * @return {string} status, might be empty string
 */
export function chunkStatusForHour(hour, chunks) {
  if (!hour && !chunks) {
    return "";
  }

  for (var stamp in chunks) {
    const beginingOfChunk = parseInt(stamp);
    const endOfChunk = beginingOfChunk + chunks[stamp].chunkSize;
    if (hour >= beginingOfChunk && hour < endOfChunk) {
      return chunks[stamp].status;
    }
  }
  return "";
}

export default TimePointPicker;
