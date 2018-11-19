import React from "react";
import { PropTypes } from "prop-types";
import { StyleSheet, View } from "react-native";
import { BlurView, Constants } from "expo";

export default class StatusBarHandler extends React.Component {
  styles = StyleSheet.create({
    container: {
      height: Constants.statusBarHeight,
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
    },
  });

  render() {
    return (
      <BlurView tint="light" intensity={80} style={this.styles.container} />
    );
  }
}
