import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo";

import * as localTypes from "./localTypes";
import Chunkometer from "./Chunkometer";
import Ruler from "./Ruler";
import Slider from "./Slider";

export default class UI extends React.Component {
  static propTypes = {
    setCurrentFile: localTypes.setCurrentFile,
    currentImage: localTypes.currentImage,
    chunks: localTypes.chunks,
    selectedRange: localTypes.selectedRange,
  };

  static defaultProps = {
    chunks: [],
    selectedRange: {
      start: null,
      end: null,
      dateCodeRange: [],
    },
  };

  styles = StyleSheet.create({
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
      position: "absolute",
    },
    ui: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      margin: 20,
      minHeight: 75,
    },
  });

  render() {
    const { chunks, selectedRange, currentImage, setCurrentFile } = this.props;
    const { styles } = this;
    const { start, end, dateCodeRange } = selectedRange;
    const svgWidth = 340;

    if (!start || !end || !dateCodeRange) {
      return null;
    }

    return (
      <BlurView tint="dark" intensity={80} style={styles.uiContainer}>
        <View style={styles.container}>
          <Ruler
            selectedRange={selectedRange}
            currentImage={currentImage}
            svgWidth={svgWidth}
          />
          <Slider
            dateCodeRange={dateCodeRange}
            currentImage={currentImage}
            svgWidth={svgWidth}
            setCurrentFile={setCurrentFile}
          />
          <Chunkometer svgWidth={svgWidth} chunks={chunks} />
        </View>
      </BlurView>
    );
  }
}
