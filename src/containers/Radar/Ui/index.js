import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { pad, generateDateCode, hourRangeFrom } from "../../../helpers/general";
import TimePointPicker from "../../../components/TimePointPicker";
import BottomSheet from "../../../components/BottomSheet";
import TemperatureView from "./TemperatureView";
import WindView from "./WindView";
import { REFRESH_LATEST } from "../../../redux/modules/wheatherData";
import {
  SELECT_FILE,
  SELECT_HOUR,
} from "../../../redux/modules/radarSelection";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
});

function refreshLatest(hourStamp, dispatch) {
  dispatch({ type: REFRESH_LATEST });
}

function registerHour(hourStamp, dispatch) {
  dispatch({ type: SELECT_HOUR, hourStamp });
}

function registerTime(chunks, stamp, dispatch) {
  let uri = null;
  const dateCode = generateDateCode(stamp, true, true);
  for (var hour in chunks) {
    const chunk = chunks[hour];
    const chunkBegin = parseInt(hour);
    const chunkEnd = parseInt(hour) + chunk.chunkSize;

    if (
      chunk.status === "unpacked" &&
      stamp >= chunkBegin &&
      stamp < chunkEnd
    ) {
      uri = chunk.unpackedFiles.find(p => p.includes(dateCode));
    }
  }
  dispatch({ type: SELECT_FILE, uri, stamp, dateCode });
}

function UI() {
  const chunks = useSelector(({ wheatherData: { chunks } }) => chunks);
  const chunksDone = allChunksDone(chunks);
  const dispatch = useDispatch();
  const [time, setTime] = useState("");

  let timePointRange = hourRangeFrom();
  const refreshRangeInterval = useRef(null);
  useEffect(() => {
    clearInterval(refreshRangeInterval.current);
    refreshRangeInterval.current = setInterval(() => {
      timePointRange = hourRangeFrom();
    }, 1000 * 60);
    return () => {
      clearInterval(refreshRangeInterval.current);
    };
  }, []);

  return (
    <BottomSheet
      headerComponent={
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexGrow: 1, flexBasis: 0 }}>
            <Text>{chunksDone ? "" : "loading data..."}</Text>
          </View>
          <View style={{ flexGrow: 1, flexBasis: 0 }}>
            <Text style={{ textAlign: "center", fontSize: 20 }}>{time}</Text>
          </View>
          <View style={{ flexGrow: 1, flexBasis: 0 }}>
            <Text style={{ textAlign: "right" }}>{"hej"}</Text>
          </View>
        </View>
      }
    >
      <View style={styles.container}>
        <TimePointPicker
          chunks={chunks}
          range={timePointRange}
          onSelectedHour={hourStamp => {
            registerHour(hourStamp, dispatch);
          }}
          onSelected={stamp => {
            registerTime(chunks, stamp, dispatch);
            const d = new Date(stamp);
            setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
          }}
          onRefresh={hourStamp => {
            refreshLatest(hourStamp, dispatch);
          }}
          refreshing={!chunksDone}
        />
      </View>
      <TemperatureView />
      <WindView />
    </BottomSheet>
  );
}

function allChunksDone(chunks) {
  for (var stamp in chunks) {
    if (
      chunks[stamp].status !== "unpacked" &&
      chunks[stamp].status !== "unpack-fail" &&
      chunks[stamp].status !== "failed"
    ) {
      return false;
    }
  }
  return true;
}

export default UI;
