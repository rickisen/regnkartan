import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";

/* eslint-disable no-undef */
const refreshSrc = require("../../../../assets/icons/misc/refresh.png");
/* eslint-enable no-undef */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: { flexGrow: 1, flexBasis: 0 },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexGrow: 1,
    flexBasis: 0,
  },
});

function Header({ title, Icon, onRefresh }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onRefresh} style={styles.textContainer}>
        <Image
          style={{ opacity: 0.4 }}
          width={32}
          height={32}
          source={refreshSrc}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>{title}</Text>
      </View>
      <View style={styles.iconContainer}>{Icon}</View>
    </View>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  Icon: PropTypes.any,
  onRefresh: PropTypes.func,
};

Header.defaultProps = {
  onRefresh: () => {},
  title: "",
  Icon: () => {},
};

export default memo(Header);
