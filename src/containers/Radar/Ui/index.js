import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { BlurView } from "expo";

import { propTypes as zipTypes } from "../../../redux/modules/zip";
import * as localTypes from "./localTypes";
import Chunkometer from "./Chunkometer";
import Ruler from "./Ruler";
import Slider from "./Slider";

export default class UI extends React.Component {
  static propTypes = {
    setCurrentFile: localTypes.setCurrentFile,
    currentImage: localTypes.currentImage,
    fetchRecent: localTypes.fetchRecent,
    chunks: zipTypes.chunks,
    selectedRange: zipTypes.selectedRange,
  };

  static defaultProps = {
    chunks: null,
    selectedRange: {
      start: null,
      end: null,
      dateCodeRange: [],
    },
  };

  state = { svgWidth: 340 };

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
    const {
      chunks,
      selectedRange,
      currentImage,
      setCurrentFile,
      fetchRecent,
    } = this.props;
    const { styles } = this;
    const { start, end, dateCodeRange } = selectedRange;
    const { svgWidth } = this.state;

    if (!start || !end || !dateCodeRange) {
      return null;
    }

    return (
      <BlurView tint="dark" intensity={80} style={styles.uiContainer}>
        <View
          onLayout={({
            nativeEvent: {
              layout: { width },
            },
          }) =>
            this.setState({ svgWidth: width - styles.container.padding * 2 })
          }
          style={styles.container}
        >
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
          <Chunkometer
            selectedRange={selectedRange}
            svgWidth={svgWidth}
            chunks={chunks}
          />
          <TouchableOpacity onPress={fetchRecent}>
            <Text
              style={{
                color: "white",
                borderColor: "white",
                padding: 15,
                borderWidth: 1,
                borderRadius: 5,
                textAlign: "center",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    );
  }
}
