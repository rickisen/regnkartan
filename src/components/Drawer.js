import React from "react";
import { PropTypes } from "prop-types";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import Constants from 'expo-constants';

export default class Drawer extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func }),
  };

  styles = StyleSheet.create({
    container: {
      paddingTop: Constants.statusBarHeight,
      flex: 1,
      backgroundColor: "#2c5a71",
    },
    routes: {
      backgroundColor: "#193341",
    },
    header: {
      padding: 20,
      alignItems: "center",
    },
    headerText: {
      color: "black",
    },
    menuItem: {
      padding: 20,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    menuItemText: {
      color: "#fff",
    },
  });

  render() {
    const { styles } = this;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Regnkartan</Text>
        </View>
        <ScrollView style={styles.routes}>
          {["Radar", "About"].map(routeName => (
            <TouchableOpacity
              style={styles.menuItem}
              key={routeName}
              onPress={() => navigation.navigate(routeName)}
            >
              <Text style={styles.menuItemText}>{routeName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}
