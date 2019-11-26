import React from "react";
import { View, Text, Dimensions, Animated, StatusBar } from "react-native";
import PropTypes from "prop-types";

import ProgressLine from "../../components/ProgressLine";
import RainPattern from "./RainPattern";
import styles from "./styles";
import {
  useEntryAnimation,
  useMeanProgress,
  useDelayedNavigationOnProgress,
} from "./hooks";

function Loading({ navigation }) {
  const width = Dimensions.get("window").width;
  const meanProgress = useMeanProgress();
  const opacity = useEntryAnimation({ duration: 1000 });
  useDelayedNavigationOnProgress(navigation.navigate, meanProgress);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#29347A" barStyle="light-content" />

      <Animated.View style={{ opacity }}>
        <RainPattern />
      </Animated.View>

      <View style={[styles.label, { width: width * 0.75 }]}>
        <Text style={styles.labelText}>Downloading Data...</Text>
      </View>

      <ProgressLine
        percent={meanProgress}
        color="white"
        height={5}
        style={[styles.progressLine, { width }]}
      />
    </View>
  );
}

Loading.navigationOptions = {
  header: null,
};

Loading.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

Loading.defaultProps = {
  navigation: {
    navigate: () => {},
  },
};

export default Loading;
