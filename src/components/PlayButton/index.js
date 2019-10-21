import React, { memo } from "react";
import { Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

/* eslint-disable no-undef */
const playingToUri = [
  require("../../../assets/icons/misc/pause.png"),
  require("../../../assets/icons/misc/play.png"),
];
/* eslint-enable no-undef */

function PlayButton({ size, playing, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        style={{ opacity: 0.4 }}
        width={size}
        height={size}
        source={playing ? playingToUri[0] : playingToUri[1]}
      />
    </TouchableOpacity>
  );
}

PlayButton.propTypes = {
  size: PropTypes.number,
  playing: PropTypes.bool,
  onPress: PropTypes.func,
};
PlayButton.defaultProps = {
  size: 32,
  playing: false,
  onPress: () => {},
};

export default memo(PlayButton);
