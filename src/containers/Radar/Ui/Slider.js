import React from "react";
import { Line, Path, G, Svg } from "react-native-svg";
import { View, StyleSheet } from "react-native";

import * as localTypes from "./localTypes";

export default class Slider extends React.Component {
  static propTypes = {
    dateCodeRange: localTypes.dateCodeRange,
    currentImage: localTypes.currentImage,
    svgWidth: localTypes.svgWidth,
    setCurrentFile: localTypes.setCurrentFile,
  };

  static defaultProps = {
    dateCodeRange: [],
    currentImage: "default",
    svgWidth: 0,
    setCurrentFile: () => {},
  };

  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  constructor(props, context) {
    super(props, context);

    this.state = {
      xOffset: props.svgWidth,
      touching: false,
    };
  }

  componentDidMount() {
    this.updatePos(this.props.svgWidth, true);
  }

  updatePos(locationX, released = false) {
    const xOffset = Math.min(this.props.svgWidth, Math.max(0, locationX));

    this.setState({ xOffset, touching: !released }, () => {
      const { xOffset } = this.state;
      const { setCurrentFile, svgWidth, dateCodeRange } = this.props;
      const wantedDateCodeIndex = Math.round(
        (xOffset / svgWidth) * (dateCodeRange.length - 1)
      );
      let wantedDateCode = dateCodeRange[0];
      try {
        wantedDateCode = dateCodeRange[wantedDateCodeIndex];
      } catch (e) {
        console.error("Problem with setting the wantedDateCodeIndex", e);
      }
      if (wantedDateCode) {
        setCurrentFile(wantedDateCode);
      }
    });
  }

  render() {
    const { svgWidth } = this.props;
    const { touching, xOffset } = this.state;
    const { styles } = this;

    return (
      <View
        style={styles.container}
        onStartShouldSetResponder={() => true}
        onResponderGrant={() => this.setState({ touching: true })}
        onResponderRelease={event =>
          this.updatePos(event.nativeEvent.locationX, true)
        }
        onResponderReject={() => this.setState({ touching: false })}
        onResponderTerminate={() => this.setState({ touching: false })}
        onResponderMove={event => this.updatePos(event.nativeEvent.locationX)}
      >
        <Svg width={svgWidth} height="40" viewBox={`0 0 ${svgWidth} 40`}>
          <G y="25">
            <Line
              x1={0}
              y1={0}
              x2={svgWidth}
              y2={0}
              stroke="black"
              opacity={touching ? "1" : "0.2"}
              strokeWidth={1}
            />
            <G scale={1} y={-25} x={xOffset}>
              <Path
                x={-10}
                fill="gray"
                stroke="transparent"
                d="M15 3 Q16.5 6.8 25 18 A12.8 12.8 0 1 1 5 18 Q13.5 6.8 15 3z"
              />
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}
