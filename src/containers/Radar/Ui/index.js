import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

import { propTypes as zipTypes } from "../../../redux/modules/zip";
import * as localTypes from "./localTypes";
import { generateDateCode } from "../../../helpers/general";
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

function UI({ chunks, selectedRange, setCurrentFile }) {
  const { start, end, dateCodeRange } = selectedRange;

  if (!start || !end || !dateCodeRange) {
    return null;
  }

  return (
    <BlurView tint="light" intensity={80} style={styles.uiContainer}>
      <View style={styles.container}>
        <TimePointPicker
          onSelected={stamp => {
            setCurrentFile(generateDateCode(new Date(stamp), true, true));
          }}
        />
      </View>
    </BlurView>
  );
}

UI.propTypes = {
  setCurrentFile: localTypes.setCurrentFile,
  currentImage: localTypes.currentImage,
  chunks: zipTypes.chunks,
  selectedRange: zipTypes.selectedRange,
};

UI.defaultProps = {
  chunks: null,
  selectedRange: {
    start: null,
    end: null,
    dateCodeRange: [],
  },
};

export default memo(UI);
