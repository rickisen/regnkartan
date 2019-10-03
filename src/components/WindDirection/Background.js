import React, { memo } from "react";
import { View } from "react-native";
import { Svg, Path, G, Circle } from "react-native-svg";
import PropTypes from "prop-types";

function Background({ size }) {
  const color = "rgba(0,0,0,0.2)";
  return (
    <View>
      <Svg version="1.1" viewBox="0 -1 27 28" height={size} width={size}>
        <G transform="translate(6.944337,6.6460468)">
          <G
            stroke={color}
            strokeWidth={0.1}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(1.3229167,-1.3229171)"
          >
            <Path
              fill={color}
              d="M 4.9528215,-3.9791188 V 5.3917813 7.915127 L 7.3316704,5.5362777 Z M 7.3316704,5.5362777 8.6981146,5.8777729 11.260488,1.6069951 Z M 4.9528215,7.915127 7.3316704,10.293976 16.847066,7.915127 H 7.4757021 Z m 0,0 -2.3788491,2.378849 2.3788491,9.515397 v -9.371365 z m 0,0 L 2.5739724,5.5362777 -6.9414234,7.915127 H 2.4294759 Z M 2.5739724,5.5362777 2.9154675,4.1693687 -1.35531,1.6069951 Z m 0,4.7576983 L 1.2070635,9.9524811 -1.35531,14.222794 Z m 4.757698,0 -0.341495,1.366445 4.2703126,2.562373 z"
            />
            <Path
              fill="transparent"
              d="M 4.9619124,-3.9882107 V 5.3826898 7.9060354 L 2.5830636,5.5271856 Z M 2.5830636,5.5271856 1.2166188,5.8686809 -1.3457545,1.5979033 Z M 4.9619124,7.9060354 2.5830636,10.284885 -6.9323324,7.9060354 h 9.3713641 z m 0,0 2.3788497,2.3788496 -2.3788497,9.515397 v -9.371365 z m 0,0 2.3788497,-2.3788498 9.5153959,2.3788498 H 7.4852579 Z M 7.3407621,5.5271856 6.9992668,4.1602768 11.270043,1.5979033 Z m 0,4.7576994 1.3669069,-0.3414959 2.562374,4.2703139 z m -4.7576985,0 0.3414953,1.366444 -4.2703134,2.562374 z"
            />
          </G>
        </G>
        <G>
          <Circle
            r="13.216039"
            cy="6.4639559"
            cx="6.4039931"
            stroke={color}
            fill="transparent"
            strokeWidth={0.2}
            transform="translate(6.9443369,6.6460467)"
          />
        </G>
      </Svg>
    </View>
  );
}

Background.propTypes = {
  size: PropTypes.number,
};

Background.defaultProps = {
  size: 100,
};

export default memo(Background);
