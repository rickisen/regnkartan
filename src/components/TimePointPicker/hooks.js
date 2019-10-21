import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";

export function usePickerWidth(saneDefault) {
  const [pickerWidth, setPickerWidth] = useState(saneDefault);
  const onLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }) => setPickerWidth(width);
  return [pickerWidth, onLayout];
}

export function useScrollBasedSelection(
  initialHour,
  pickerWidth,
  hourWidth,
  range,
  playing
) {
  const flatListRef = useRef();
  const [scrolled, setScrolled] = useState(initialHour);
  const onScroll = ({
    nativeEvent: {
      contentOffset: { x },
    },
  }) => {
    setScrolled(x);
  };

  // TODO: Figureout delta for smoother playing
  const playingTimeout = useRef(null);
  useEffect(() => {
    clearTimeout(playingTimeout.current);
    if (playing) {
      playingTimeout.current = setTimeout(() => {
        flatListRef.current.scrollToOffset({
          offset: scrolled + hourWidth / 12,
          animated: false,
        });
      }, 20);
    }
  }, [playing, flatListRef, scrolled]);

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

  return [over, under, minutes, selectedHour, onScroll, flatListRef];
}

export function useDelayedCallback(onSelectedHour, over, under, selectedHour) {
  const selectHourTimer = useRef(null);
  useEffect(() => {
    if (!over && !under) {
      clearTimeout(selectHourTimer.current);
      selectHourTimer.current = setTimeout(() => {
        onSelectedHour(selectedHour);
      }, 400);
    }
  }, [selectedHour, selectHourTimer, over, under]);
}

export function useDelayedRefreshOnOver(onRefresh, over, refreshing) {
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
}

export function useScrollToNow(range, hourWidth, pickerWidth, flatList) {
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

  return flatList;
}
