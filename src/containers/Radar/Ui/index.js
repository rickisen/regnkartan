import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import {
  pad,
  generateDateCode,
  hourRangeFrom,
  begginingOfHour,
} from "../../../helpers/general";

import {
  SELECT_FILE,
  SELECT_HOUR,
} from "../../../redux/modules/radarSelection";
import { REFRESH_LATEST } from "../../../redux/modules/wheatherData";
import TimePointPicker from "../../../components/TimePointPicker";
import BottomSheet from "../../../components/BottomSheet";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
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

function selectTemperature({
  radarSelection: { stamp },
  pointAnalysis: { data },
}) {
  if (stamp && data && data.timeSeries && data.timeSeries.length > 0) {
    const relevantHour = begginingOfHour(new Date(stamp));
    const dataForHour = data.timeSeries.find(
      ({ validTime }) => new Date(validTime).getTime() === relevantHour
    );
    if (
      dataForHour &&
      dataForHour.parameters &&
      dataForHour.parameters.length > 0
    ) {
      const temp = dataForHour.parameters.find(p => p.name === "t");
      if (temp && temp.values && temp.values.length > 0) {
        return temp.values[0] + "°C";
      }
    }
  }
  return "";
}

function UI() {
  const chunks = useSelector(({ wheatherData: { chunks } }) => chunks);
  const chunksDone = allChunksDone(chunks);
  const dispatch = useDispatch();
  const [time, setTime] = useState("");
  const selectedTemperature = useSelector(selectTemperature);

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
            <Text style={{ textAlign: "right" }}>{selectedTemperature}</Text>
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
