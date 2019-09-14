import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { BlurView } from "expo-blur";

import { generateDateCode } from "../../../helpers/general";

import {
  SELECT_FILE,
  SELECT_HOUR,
} from "../../../redux/modules/radarSelection";
import { REFRESH_LATEST } from "../../../redux/modules/wheatherData";
import TimePointPicker from "../../../components/TimePointPicker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  uiContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
    position: "absolute",
    marginHorizontal: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  ui: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 20,
    minHeight: 75,
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
  useEffect(() => {
    setTimeout(() => {
      console.log("auto refreshing");
      refreshLatest(0, dispatch);
    }, 10000);
  }, []);

  return (
    <BlurView tint="light" intensity={80} style={styles.uiContainer}>
      <View style={styles.container}>
        <Text>{chunksDone ? "" : "loading data..."}</Text>
        <TimePointPicker
          chunks={chunks}
          onSelectedHour={hourStamp => {
            registerHour(hourStamp, dispatch);
          }}
          onSelected={stamp => {
            registerTime(chunks, stamp, dispatch);
          }}
          onRefresh={hourStamp => {
            refreshLatest(hourStamp, dispatch);
          }}
          refreshing={!chunksDone}
        />
      </View>
    </BlurView>
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
