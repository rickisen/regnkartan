import React from "react";
import { PropTypes } from "prop-types";
import { StyleSheet, Text, View } from "react-native";

export default class About extends React.Component {
  styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  render() {
    return (
      <View style={this.styles.container}>
        <Text>Just a bad weather app</Text>
      </View>
    );
  }
}
