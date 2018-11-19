import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  Slider,
} from "react-native";

import { FETCH_DAY } from "../redux/modules/radarImages";

@connect(state => ({
  radar: state.radar,
}))
export default class Radar extends React.Component {
  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    uiContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      currentImage: 0,
      preFetchLock: false,
      timeout: null,
    };
  }

  componentDidMount() {
    let day = new Date();
    this.props.dispatch({ type: FETCH_DAY, day });
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.radar.loadingDay &&
      !nextProps.radar.loadingDay &&
      nextProps.radar.files.length > 0
    ) {
      this.setState({ currentImage: nextProps.radar.files.length - 1 });

      // prefetch one image for every hour
      for (var i = 0, len = nextProps.radar.files.length; i < len; i += 5) {
        Image.prefetch(nextProps.radar.files[i].formats[0].link);
      }

      // and prefetch the closest ones
      for (var j = nextProps.radar.files.length - 1; j >= 0; j--) {
        if (nextProps.radar.files.length - j < 40) {
          Image.prefetch(nextProps.radar.files[j].formats[0].link);
        }
      }
    }
  }

  render() {
    const { radar, dispatch } = this.props;
    const { currentImage } = this.state;

    return (
      <ImageBackground
        source={{
          uri:
            "https://opendata-download-radar.smhi.se/explore/img/basemap.png",
        }}
        style={this.styles.container}
      >
        {radar.files.length > 0 &&
          !radar.loadingDay &&
          currentImage <= radar.files.length && (
            <ImageBackground
              source={{ uri: radar.files[currentImage].formats[0].link }}
              defaultSource={require("../components/radar_clean.png")}
              style={this.styles.uiContainer}
            >
              {radar.files.length > 0 && (
                <View style={{ flex: 10, justifyContent: "flex-end" }}>
                  <Text>{radar.files[currentImage].formats[0].updated}</Text>
                </View>
              )}
              {currentImage >= 0 &&
                currentImage < radar.files.length && (
                  <Slider
                    style={{ flex: 1, width: "90%", margin: 30, height: 30 }}
                    step={1}
                    maximumValue={radar.files.length - 1}
                    onValueChange={v => this.setState({ currentImage: v })}
                    value={this.state.currentImage}
                  />
                )}
            </ImageBackground>
          )}
      </ImageBackground>
    );
  }
}
