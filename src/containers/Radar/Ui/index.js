import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { BlurView } from "expo-blur";

import { generateDateCode } from "../../../helpers/general";

import {
  SELECT_FILE,
  SELECT_HOUR,
} from "../../../redux/modules/radarSelection";
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

function registerHour(hourStamp, dispatch) {
  // drop future hours to prevent bugs
  const beginningOfCurrentHour = new Date();
  beginningOfCurrentHour.setUTCMinutes(0);
  beginningOfCurrentHour.setUTCSeconds(0);
  beginningOfCurrentHour.setUTCMilliseconds(0);
  if (hourStamp > beginningOfCurrentHour.getTime()) {
    console.log(
      "hourStamp, beginningOfCurrentHour",
      hourStamp,
      beginningOfCurrentHour.getTime()
    );
    return;
  }
  console.log("dispatching", new Date(hourStamp), beginningOfCurrentHour);
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
      chunk.status === "unzipped" &&
      stamp >= chunkBegin &&
      stamp < chunkEnd
    ) {
      uri = chunk.unzippedFiles.find(p => p.includes(dateCode));
    }
  }
  dispatch({ type: SELECT_FILE, uri, stamp, dateCode });
}

function UI() {
  const chunks = useSelector(({ zip: { chunks } }) => chunks);
  const chunksDone = allChunksDone(chunks);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

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
          onRefresh={() => {
            console.log("refrer");
            setRefreshing(true);
            setTimeout(() => setRefreshing(false), 1000);
          }}
          refreshing={refreshing}
        />
      </View>
    </BlurView>
  );
}

function allChunksDone(chunks) {
  for (var stamp in chunks) {
    if (
      chunks[stamp].status !== "unzipped" &&
      chunks[stamp].status !== "unzip-fail" &&
      chunks[stamp].status !== "failed"
    ) {
      return false;
    }
  }
  return true;
}

export default UI;
