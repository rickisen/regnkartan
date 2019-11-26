import React, { memo } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import Droplets from "./Droplets";

function Row({ duration }) {
  return (
    <>
      <View style={{ transform: [{ translateX: 375 / 2 }] }}>
        <Droplets duration={duration} />
      </View>
      <Droplets duration={duration * 1.1} />
    </>
  );
}

Row.propTypes = {
  duration: PropTypes.number,
};

Row.defaultProps = {
  duration: 1000,
};

export default memo(Row);
