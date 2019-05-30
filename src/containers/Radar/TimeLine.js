import React from "react";
import { PropTypes } from "prop-types";
import { View, StyleSheet } from "react-native";
import { Svg } from "expo";

import { pad, timeFromDateCode } from "../../helpers/general";

const { Line, Text, G, Rect, Path } = Svg;

export default class TimeLine extends React.Component {
  static propTypes = {
    currentImage: PropTypes.string,
    chunks: PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.date,
        status: PropTypes.string,
      })
    ),
    selectedRange: PropTypes.shape({
      start: PropTypes.date,
      end: PropTypes.date,
      dateCodeRange: PropTypes.arrayOf(PropTypes.string),
    }),
  };

  static defaultProps = {
    chunks: [],
    selectedRange: {
      start: null,
      end: null,
      dateCodeRange: [],
    },
  };

  state = {
    selected: null,
  };

  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    svg: {},
    ui: {
      width: "100%",
    },
  });

  isHalfHourIncrement(dateCode) {
    if (typeof dateCode === "string" && dateCode.length === 10) {
      const minutes =
        dateCode[dateCode.length - 2] + dateCode[dateCode.length - 1];
      return minutes === "00" || minutes === "30";
    }
  }

  isFirstOnHour(dateCode) {
    if (typeof dateCode === "string" && dateCode.length === 10) {
      return (
        dateCode[dateCode.length - 2] === "0" &&
        dateCode[dateCode.length - 1] === "0"
      );
    }
    return false;
  }

  render() {
    const {
      chunks,
      selectedRange: { start, end, dateCodeRange },
      currentImage,
    } = this.props;

    if (!start || !end) {
      return null;
    }

    const { styles } = this;
    const svgWidth = 340;
    const lines = dateCodeRange.filter(this.isHalfHourIncrement);
    const selectedDate = timeFromDateCode(currentImage);

    return (
      <View style={styles.container}>
        <Svg
          width={svgWidth}
          height="100"
          viewBox={`0 0 ${svgWidth} 100`}
          style={styles.svg}
        >
          <G y="10">
            <Text fill="white" x={svgWidth / 2 - 55 / 2}>
              {`${pad(selectedDate.getDate())}/${pad(
                selectedDate.getHours()
              )}:${pad(selectedDate.getMinutes())}`}
            </Text>
            <Text fill="white">
              {`${pad(start.getDate())}/${pad(start.getHours())}:${pad(
                start.getMinutes()
              )}`}
            </Text>
            <Text x={svgWidth - 55} fill="white">
              {`${pad(end.getDate())}/${pad(end.getHours())}:${pad(
                end.getMinutes()
              )}`}
            </Text>
          </G>
          <G y="30">
            {lines.map((c, i) => {
              const xPos = (i / lines.length) * svgWidth;
              const opacity = 0.75;
              const firstOnHour = this.isFirstOnHour(c);
              return (
                <Line
                  key={c}
                  x1={xPos}
                  y2="0"
                  x2={xPos}
                  y1={firstOnHour ? "-10" : "-5"}
                  stroke={`rgba(255,255,255, ${opacity})`}
                  strokeWidth={1}
                />
              );
            })}
          </G>
          <G y={75}>
            {[...chunks].reverse().map((chunk, i) => {
              const margin = 2;
              const xPos = (i / chunks.length) * svgWidth + margin / 2;
              const width = svgWidth / chunks.length - margin;
              let bg = "";
              switch (chunk.status) {
                case "qued":
                  bg = "rgba(255,255,255,0.3)";
                  break;
                case "loading":
                  bg = "rgba(255,220,180,0.3)";
                  break;
                case "loaded":
                  bg = "rgba(255,255,180,0.4)";
                  break;
                case "unzipping":
                  bg = "rgba(200,220,120,0.4)";
                  break;
                case "unzipped":
                  bg = "rgba(175,200,100,0.5)";
                  break;
                case "failed":
                  bg = "rgba(255,100,100,0.4)";
                  break;
                case "unzip-fail":
                  bg = "rgba(255,100,255,0.4)";
                  break;
                default:
                  bg = "rgba(255,255,255,0.2)";
              }
              return (
                <Rect
                  x={xPos}
                  width={width}
                  height={5}
                  key={chunk.time}
                  fill={bg}
                />
              );
            })}
          </G>
          <G y={55}>
            <Line
              x1={0}
              y1={0}
              x2={svgWidth}
              y2={0}
              stroke={`rgba(0,0,0, ${0.5})`}
              strokeWidth={1}
            />
            <G
              scale={1}
              y={-25}
              x={
                (dateCodeRange.indexOf(currentImage) / dateCodeRange.length) *
                svgWidth
              }
            >
              <Path
                x={-10}
                fill="white"
                stroke="transparent"
                stroke-width="2"
                d="M15 3
                Q16.5 6.8 25 18
                A12.8 12.8 0 1 1 5 18
                Q13.5 6.8 15 3z"
              />
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}
