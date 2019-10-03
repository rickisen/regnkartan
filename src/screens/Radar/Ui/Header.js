import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: { flexGrow: 1, flexBasis: 0 },
});

function Header({ title, loading, Icon }) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text>{loading ? "loading data..." : ""}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>{title}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={{ textAlign: "right" }}>{Icon}</Text>
      </View>
    </View>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  Icon: PropTypes.any,
};

Header.defaultProps = {
  title: "",
  loading: true,
  Icon: () => {},
};

export default memo(Header);
