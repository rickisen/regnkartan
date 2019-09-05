import React from "react";
import {
  Line,
  Text,
  G,
  Defs,
  LinearGradient,
  Stop,
  Svg,
} from "react-native-svg";
import { StyleSheet, View } from "react-native";

import * as localTypes from "./localTypes";
import { pad, generateDateCode } from "../../../helpers/general";

const hours = [...Array(24).keys()];

function msFromStartOfDay(datetime) {
  const datetimeStamp = datetime.getTime();
  const startOfDay = new Date(datetimeStamp);
  startOfDay.setHours(0);
  startOfDay.setMinutes(0);
  startOfDay.setMilliseconds(0);
  const startOfDayStamp = startOfDay.getTime();

  return datetimeStamp - startOfDayStamp;
}

// Makes slight centered gradient opacity
function calcOpacity(pos, max, gentle) {
  const half = max / 2;
  const fullRange = 1 - Math.abs(pos - half) / half;
  if (gentle) {
    return fullRange + 0.5 / 2; // So that we dont go fully from 0 to 1
  }
  return fullRange;
}

const initialState = {
  touching: false,
  firstTouch: -1,
  firstTime: 0,
  targetTime: 0,
};

export default class Ruler extends React.Component {
  static propTypes = {
    initialTime: localTypes.timestamp.isRequired,
    svgWidth: localTypes.svgWidth,
    setCurrentFile: localTypes.setCurrentFile,
  };

  static defaultProps = {
    svgWidth: 100,
    setCurrentFile: () => {},
  };

  state = initialState;

  styles = StyleSheet.create({
    touching: {},
    container: {
      flex: 1,
    },
    rotate: {
      transform: [{ rotateY: "45deg" }],
    },
  });

  componentDidUpdate(prevProps) {
    if (
      prevProps.initialTime != this.props.initialTime &&
      !this.state.touching
    ) {
      this.setState({ ...initialState, targetTime: this.props.initialTime });
    }
  }

  grantTouch = event => {
    this.setState({
      touching: true,
      firstTouch: event.nativeEvent.locationX,
      firstTime: this.props.initialTime,
      targetTime: this.props.initialTime,
    });
  };

  updatePos = event => {
    const { setCurrentFile } = this.props;
    const { firstTouch, firstTime } = this.state;
    let { targetTime } = this.state;

    let moved = 0;
    if (firstTouch) {
      moved = event.nativeEvent.locationX - firstTouch; // maybe round this for optimization
    }

    targetTime = firstTime - this.pxToMs(moved);
    setCurrentFile(generateDateCode(targetTime, true, true));
    this.setState({ targetTime });
  };

  releaseTouch = () => {
    this.setState({
      ...initialState,
      targetTime: this.state.targetTime,
    });
  };

  msToPx(ms) {
    const { svgWidth } = this.props;
    const widthInMS = 12 * 60 * 60 * 1000;
    return (svgWidth / widthInMS) * ms;
  }

  pxToMs(px) {
    const { svgWidth } = this.props;
    const widthInMS = 12 * 60 * 60 * 1000;
    return (widthInMS / svgWidth) * px;
  }

  render() {
    const styles = this.styles;
    const { svgWidth } = this.props;
    const { touching, targetTime } = this.state;
    const svgHeight = 70;
    const midpoint = new Date(targetTime);
    const dayOffset = this.msToPx(msFromStartOfDay(midpoint)) * -1;
    // Since all math up to this point uses the far left as 0 (origin/origo)
    const originToMid = this.msToPx((12 * 60 * 60 * 1000) / 2);
    const offset = dayOffset + originToMid;

    return (
      <View
        style={[styles.container, touching ? styles.touching : null]}
        onStartShouldSetResponder={() => true}
        onResponderGrant={this.grantTouch}
        onResponderMove={this.updatePos}
        onResponderReject={this.releaseTouch}
        onResponderTerminate={this.releaseTouch}
        onResponderRelease={this.releaseTouch}
      >
        <Svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2={svgWidth} y2="0">
              <Stop
                offset="0%"
                stopColor="black"
                stopOpacity={touching ? "0.5" : "0"}
              />
              <Stop offset="50%" stopColor="black" stopOpacity="1" />
              <Stop
                offset="100%"
                stopColor="black"
                stopOpacity={touching ? "0.5" : "0"}
              />
            </LinearGradient>
          </Defs>
          <G y="10">
            <Text fill="black" x={svgWidth / 2 - 70 / 2}>
              {`${pad(midpoint.getHours())}:${pad(midpoint.getMinutes())}`}
              {`-${pad(midpoint.getDate())}/${pad(midpoint.getMonth() + 1)}`}
            </Text>
          </G>
          <G x={svgWidth / 2}>
            <Line y1="15" y2="20" stroke="black" />
            <Line
              opacity="0.4"
              y1="20"
              y2="20"
              x1={svgWidth / 2}
              x2={svgWidth * -0.5}
              stroke="url(#grad)"
            />
            <Line y1="55" y2="60" stroke="black" />
            <Line
              opacity="0.5"
              y1="55"
              y2="55"
              x1={svgWidth / 2}
              x2={svgWidth * -0.5}
              stroke="url(#grad)"
            />
          </G>
          <G y="35">
            {hours.map((c, i) => {
              const doubleWidth = svgWidth * 2;
              const tick = doubleWidth / hours.length;
              // Make use of modulas and Math.abs to make the hours repeat when
              // rendering over the 24 hour point
              let xPos =
                ((i / hours.length) * doubleWidth + offset) % doubleWidth;
              if (xPos < 0) {
                xPos = xPos + doubleWidth;
              }
              const opacity = calcOpacity(xPos, svgWidth, touching);
              return (
                <G key={c + ""}>
                  <Line
                    x1={xPos}
                    y2="0"
                    x2={xPos}
                    y1="-10"
                    stroke={`rgba(0,0,0, ${opacity})`}
                    strokeWidth={1}
                  />
                  <Text
                    transform="rotate(0, 45, 45)"
                    opacity={opacity}
                    fontSize="10"
                    x={xPos - 5}
                    y="12"
                    fill="black"
                  >
                    {pad(c)}
                  </Text>
                  <Line
                    x1={xPos + tick / 2}
                    y2="0"
                    x2={xPos + tick / 2}
                    y1="-5"
                    stroke={`rgba(0,0,0, ${opacity})`}
                    strokeWidth={1}
                  />
                </G>
              );
            })}
          </G>
        </Svg>
      </View>
    );
  }
}
