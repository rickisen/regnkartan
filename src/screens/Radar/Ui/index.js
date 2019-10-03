import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { pad, hourRangeFrom } from "../../../helpers/general";
import TimePointPicker from "../../../components/TimePointPicker";
import BottomSheet from "../../../components/BottomSheet";
import TemperatureView from "./TemperatureView";
import WindView from "./WindView";
import Header from "./Header";
import {
  allChunks,
  allChunksDone,
  registerHour,
  registerTime,
  REFRESH_LATEST,
} from "../../../redux/modules/wheatherData";

const styles = StyleSheet.create({
  pickerContainer: {
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
});

function useNewRangeEveryMinute() {
  const [timePointRange, setTimePointRange] = useState(hourRangeFrom());

  const refreshRangeInterval = useRef(null);
  useEffect(() => {
    clearInterval(refreshRangeInterval.current);
    refreshRangeInterval.current = setInterval(() => {
      setTimePointRange(hourRangeFrom());
    }, 1000 * 60);
    return () => {
      clearInterval(refreshRangeInterval.current);
    };
  }, []);

  return timePointRange;
}

function UI() {
  const chunks = useSelector(allChunks);
  const chunksDone = useSelector(allChunksDone);
  const dispatch = useDispatch();
  const [time, setTime] = useState("");
  const timePointRange = useNewRangeEveryMinute();

  const onSelectedHour = hourStamp => {
    dispatch(registerHour(hourStamp));
  };
  const onSelected = stamp => {
    dispatch(registerTime(chunks, stamp));
    const d = new Date(stamp);
    setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
  };
  const onRefresh = () => {
    dispatch({ type: REFRESH_LATEST });
  };

  return (
    <BottomSheet
      headerComponent={
        <Header loading={!chunksDone} title={time} Icon={"hejje"} />
      }
    >
      <View style={styles.pickerContainer}>
        <TimePointPicker
          chunks={chunks}
          range={timePointRange}
          onSelectedHour={onSelectedHour}
          onSelected={onSelected}
          onRefresh={onRefresh}
          refreshing={!chunksDone}
        />
      </View>
      <TemperatureView />
      <WindView />
    </BottomSheet>
  );
}

export default UI;
