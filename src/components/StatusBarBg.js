import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { BlurView } from "./BlurView";

export default class StatusBarHandler extends React.Component {
  styles = StyleSheet.create({
    container: {
      backgroundColor: "#fafafa", // android only
      height: Constants.statusBarHeight,
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
    },
  });

  render() {
    return (
      <BlurView tint="light" intensity={80} style={this.styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
      </BlurView>
    );
  }
}
