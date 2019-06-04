import React from "react";
import { PropTypes } from "prop-types";
import { View, Slider, StyleSheet } from "react-native";
import { BlurView } from "expo";

import Chunkometer from "./Chunkometer";
import Ruler from "./Ruler";
import Zlider from "./Slider";

export default class TimeLine extends React.Component {
  static propTypes = {
    setCurrentFile: PropTypes.func.isRequired,
    currentImage: PropTypes.string,
    chunks: PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.date,
        status: PropTypes.string,
      })
    ),
    selectedRange: PropTypes.shape({
      start: PropTypes.date,
      end: PropTypes.date,
      dateCodeRange: PropTypes.arrayOf(PropTypes.string),
    }),
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
          <Zlider
            dateCodeRange={dateCodeRange}
            currentImage={currentImage}
            svgWidth={svgWidth}
          />
          <Chunkometer svgWidth={svgWidth} chunks={chunks} />
          {dateCodeRange && (
            <Slider
              minimumTrackTintColor={"#4090aa"}
              maximumTrackTintColor={"#0a2531"}
              thumbTintColor={"#fff"}
              style={styles.slider}
              step={1}
              maximumValue={dateCodeRange.length - 1}
              onValueChange={i => setCurrentFile(dateCodeRange[i])}
              value={
                dateCodeRange.length - 1 || dateCodeRange.indexOf(currentImage)
              }
            />
          )}
        </View>
      </BlurView>
    );
  }
}
