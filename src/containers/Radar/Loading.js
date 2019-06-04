import React from "react";
import { PropTypes } from "prop-types";
import { StyleSheet, View, ActivityIndicator } from "react-native";

export default class Loading extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
  };

  styles = StyleSheet.create({
    container: {
      justifyContent: "flex-start",
      alignItems: "center",
    },
    spinner: {
      flex: 1,
      margin: 10,
    },
  });

  render() {
    const { styles } = this;
    const { show } = this.props;

    if (show) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" style={styles.spinner} />
        </View>
      );
    } else {
      return null;
    }
  }
}
