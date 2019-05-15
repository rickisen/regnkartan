import React from "react";
import { PropTypes } from "prop-types";
import { TouchableOpacity, Text, Slider, StyleSheet, View } from "react-native";
import { BlurView } from "expo";

export default class RadarUi extends React.Component {
  static propTypes = {
    radarFiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentImage: PropTypes.number.isRequired,
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
    const { radarFiles, currentImage, setCurrentFile } = this.props;

    return (
      <BlurView tint="dark" intensity={80} style={styles.uiContainer}>
        <View style={styles.ui}>
          {currentImage >= 0 && currentImage < radarFiles.length && (
            <Slider
              minimumTrackTintColor={"#4090aa"}
              maximumTrackTintColor={"#0a2531"}
              thumbTintColor={"#fff"}
              style={styles.slider}
              step={1}
              maximumValue={radarFiles.length - 1}
              onValueChange={i => setCurrentFile(i)}
              value={currentImage}
            />
          )}
        </View>
      </BlurView>
    );
  }
}
