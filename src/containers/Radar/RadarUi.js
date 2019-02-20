import React from "react";
import { PropTypes } from "prop-types";
import { TouchableOpacity, Text, Slider, StyleSheet, View } from "react-native";
import { BlurView } from "expo";

export default class RadarUi extends React.Component {
  static propTypes = {
    radarFiles: PropTypes.arrayOf(
      PropTypes.shape({
        formats: PropTypes.arrayOf(
          PropTypes.shape({ updated: PropTypes.string })
        ),
      })
    ).isRequired,
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
      justifyContent: "center",
      alignItems: "center",
      margin: 20,
    },
    slider: {
      alignSelf: "stretch",
    },
  });

  render() {
    const { styles } = this;
    const { radarFiles, currentImage, setCurrentFile } = this.props;

    return (
      <BlurView tint="light" intensity={80} style={styles.uiContainer}>
        <View style={styles.ui}>
          {radarFiles.length > 0 && (
            <View>
              <Text>
                {new Date(
                  radarFiles[currentImage].formats[0].updated
                ).toLocaleTimeString()}
              </Text>
            </View>
          )}
          {currentImage >= 0 &&
            currentImage < radarFiles.length && (
              <Slider
                style={styles.slider}
                step={1}
                maximumValue={radarFiles.length - 1}
                onValueChange={i => setCurrentFile(i)}
                value={currentImage}
              />
            )}
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: "#aad",
              bottom: 0,
              left: 0,
              right: 0,
            }}
            onPress={() => this.props.ToggleDebugg()}
          >
            <Text>Toggle Map</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    );
  }
}
