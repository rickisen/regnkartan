import React from "react";
import { PropTypes } from "prop-types";
import { Text, Slider, StyleSheet, View } from "react-native";
import { BlurView } from "expo";

import TimeLine from "./TimeLine";

export default class RadarUi extends React.Component {
  static propTypes = {
    currentImage: PropTypes.string.isRequired,
    setCurrentFile: PropTypes.func.isRequired,
  };

  styles = StyleSheet.create({
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
    date: {
      color: "#fff",
    },
    slider: {
      alignSelf: "stretch",
    },
  });

  render() {
    const { styles } = this;
    const { chunks, currentImage, setCurrentFile, selectedRange } = this.props;

    return (
      <BlurView tint="dark" intensity={80} style={styles.uiContainer}>
        <View style={styles.ui}>
          <TimeLine
            chunks={chunks}
            selectedRange={selectedRange}
            currentImage={currentImage}
          />
          {selectedRange && selectedRange.dateCodeRange && (
            <Slider
              minimumTrackTintColor={"#4090aa"}
              maximumTrackTintColor={"#0a2531"}
              thumbTintColor={"#fff"}
              style={styles.slider}
              step={1}
              maximumValue={selectedRange.dateCodeRange.length - 1}
              onValueChange={i =>
                setCurrentFile(selectedRange.dateCodeRange[i])
              }
              value={
                selectedRange.dateCodeRange.length - 1 ||
                selectedRange.dateCodeRange.indexOf(currentImage)
              }
            />
          )}
          <Text>{currentImage}</Text>
        </View>
      </BlurView>
    );
  }
}
