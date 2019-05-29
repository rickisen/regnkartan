import React from "react";
import { PropTypes } from "prop-types";
import { TouchableOpacity, Text, Slider, StyleSheet, View } from "react-native";
import { BlurView } from "expo";

import { generateDateCodeRange } from "../../helpers/general";
import Loading from "./Loading";

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
    const { currentImage, setCurrentFile, selectedRange } = this.props;
    const dateCodeRange = generateDateCodeRange(selectedRange.start, selectedRange.end)

    return (
      <BlurView tint="dark" intensity={80} style={styles.uiContainer}>
        <View style={styles.ui}>
          <Slider
            minimumTrackTintColor={"#4090aa"}
            maximumTrackTintColor={"#0a2531"}
            thumbTintColor={"#fff"}
            style={styles.slider}
            step={1}
            maximumValue={dateCodeRange.length - 1}
            onValueChange={i => setCurrentFile(dateCodeRange[i])}
            value={dateCodeRange.length - 1 || dateCodeRange.indexOf(currentImage)}
          />
          <Text>{currentImage}</Text>
        </View>
      </BlurView>
    );
  }
}
