import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { pad, hourRangeFrom } from "../../../helpers";
import TimePointPicker from "../../../components/TimePointPicker";
import BottomSheet from "../../../components/BottomSheet";
import PlayButton from "../../../components/PlayButton";
import TemperatureView from "./TemperatureView";
import WindView from "./WindView";
import Overview from "./Overview";
import Header from "./Header";
import {
  EXTENDED_DATA_VISIBLE,
  selectWeatherSymbols,
} from "../../../redux/modules/pointAnalysis";
import {
  allChunks,
  allChunksDone,
  registerHour,
  registerTime,
  REFRESH_LATEST,
} from "../../../redux/modules/rainRadar";

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

function useVisibilityCallback() {
  const dispatch = useDispatch();

  const setVisibility = v => {
    dispatch({ type: EXTENDED_DATA_VISIBLE, visible: !!v });
  };

  const visible = useSelector(({ pointAnalysis: { visible } }) => visible);

  return [visible, setVisibility];
}

function UI() {
  const chunks = useSelector(allChunks);
  const chunksDone = useSelector(allChunksDone);
  const symbols = useSelector(selectWeatherSymbols);
  const dispatch = useDispatch();
  const [time, setTime] = useState("");
  const timePointRange = useNewRangeEveryMinute();
  const [showExtendedUi, visibilityCallBack] = useVisibilityCallback();
  const [playing, setPlaying] = useState(false);

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
      visibilityCallBack={visibilityCallBack}
      headerComponent={
        <Header
          loading={!chunksDone}
          title={time}
          Icon={
            <PlayButton
              onPress={() => setPlaying(!playing)}
              playing={playing}
            />
          }
        />
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
          symbols={symbols}
          setPlaying={setPlaying}
          playing={playing}
        />
      </View>
      {showExtendedUi && (
        <ScrollView horizontal={false}>
          <Overview />
          <TemperatureView />
          <WindView />
        </ScrollView>
      )}
    </BottomSheet>
  );
}

export default UI;
