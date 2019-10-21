import React, { useEffect } from "react";
import { PropTypes } from "prop-types";
import { FlatList, View } from "react-native";
import { Svg, Path, G, Line } from "react-native-svg";

import { propTypes as chunkTypes } from "../../redux/modules/rainRadar";
import Hour from "./Hour";
import Footer from "./Footer";
import { hourRangeFrom } from "../../helpers";
import { chunkStatusForHour } from "./helpers";
import {
  usePickerWidth,
  useScrollBasedSelection,
  useDelayedCallback,
  useDelayedRefreshOnOver,
  useScrollToNow,
} from "./hooks";

function TimePointPicker({
  chunks,
  range,
  initialHour,
  onSelected,
  onSelectedHour,
  refreshing,
  onRefresh,
  symbols,
  setPlaying,
  playing,
}) {
  const hourWidth = 60;
  const [pickerWidth, onLayout] = usePickerWidth(375);
  const [
    over,
    under,
    minutes,
    selectedHour,
    onScroll,
    flatListRef,
  ] = useScrollBasedSelection(
    initialHour,
    pickerWidth,
    hourWidth,
    range,
    playing,
    setPlaying
  );

  // Run the callback and pass the selected timestamp, if selection changed
  useEffect(() => onSelected(selectedHour + minutes * 1000 * 60), [
    selectedHour,
    minutes,
  ]);

  // Runs the callback for every hour touched (with a timer to prevent
  // accidental loading)
  useDelayedCallback(onSelectedHour, over, under, selectedHour);

  // Runs onRefresh when paused above "over" threshold for a while;
  // TODO: make this work ok on android
  useDelayedRefreshOnOver(onRefresh, over, refreshing);

  // Directly scrolls the list to "now" on first load
  useScrollToNow(range, hourWidth, pickerWidth, flatListRef);

  return (
    <View onLayout={onLayout}>
      <View style={{ alignItems: "center" }}>
        <Svg
          width={pickerWidth}
          height="20"
          viewBox={`0 0 5.2916665 5.2916665`}
        >
          <G transform="translate(0,-291.70833)" id="layer1">
            <Line
              x1="2.7"
              y1="292"
              x2="2.7"
              y2="296"
              stroke="#222"
              strokeWidth="0.3333"
            />
          </G>
        </Svg>
      </View>
      <FlatList
        ref={flatListRef}
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
          const symbol = symbols.find(({ hour }) => hour === item);
          return (
            <Hour
              status={chunkStatusForHour(item, chunks)}
              stamp={item}
              hourWidth={hourWidth}
              index={index}
              Wsymb2={symbol && symbol.Wsymb2}
            />
          );
        }}
        keyExtractor={stamp => "" + stamp}
        onScroll={onScroll}
        onScrollBeginDrag={() => setPlaying(false)}
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
  symbols: [],
  setPlaying: () => {},
  playing: false,
};

TimePointPicker.propTypes = {
  chunks: chunkTypes.chunks,
  range: PropTypes.arrayOf(PropTypes.number),
  initialHour: PropTypes.number,
  onSelected: PropTypes.func,
  onSelectedHour: PropTypes.func,
  refreshing: PropTypes.bool,
  symbols: PropTypes.arrayOf(
    PropTypes.shape({
      hour: PropTypes.number,
      Wsymb2: PropTypes.number,
    })
  ),
  setPlaying: PropTypes.func,
  playing: PropTypes.bool,
};

export default TimePointPicker;
