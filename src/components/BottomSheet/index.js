import React, { Component } from "react";
import { Animated, StyleSheet, View, Dimensions } from "react-native";
import { BlurView } from "../BlurView";
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";

const USE_NATIVE_DRIVER = true;
const HEADER_HEIGHT = 50;

const windowHeight = Dimensions.get("window").height;
const SNAP_POINTS_FROM_TOP = [
  windowHeight * 0.4,
  windowHeight * 0.65,
  windowHeight * 0.78,
];

export default class BottomSheet extends Component {
  static defaultProps = {
    visibilityCallBack: () => {},
  };

  masterdrawer = React.createRef();
  drawer = React.createRef();
  drawerheader = React.createRef();
  constructor(props) {
    super(props);
    const START = SNAP_POINTS_FROM_TOP[0];
    const END = SNAP_POINTS_FROM_TOP[SNAP_POINTS_FROM_TOP.length - 1];

    this.state = {
      lastSnap: END,
    };

    this._lastScrollYValue = 0;
    this._lastScrollY = new Animated.Value(0);
    this._onRegisterLastScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this._lastScrollY } } }],
      { useNativeDriver: USE_NATIVE_DRIVER }
    );

    this._lastScrollY.addListener(({ value }) => {
      this._lastScrollYValue = value;
    });

    this._dragY = new Animated.Value(0);

    this._onGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this._dragY } }],
      { useNativeDriver: USE_NATIVE_DRIVER }
    );

    this._reverseLastScrollY = Animated.multiply(
      new Animated.Value(-1),
      this._lastScrollY
    );

    this._translateYOffset = new Animated.Value(END);

    this._translateY = Animated.add(
      this._translateYOffset,
      Animated.add(this._dragY, this._reverseLastScrollY)
    ).interpolate({
      inputRange: [START, END],
      outputRange: [START, END],
      extrapolate: "clamp",
    });
  }
  _onHeaderHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.BEGAN) {
      this._lastScrollY.setValue(0);
    }
    this._onHandlerStateChange({ nativeEvent });
  };
  _onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      let { velocityY, translationY } = nativeEvent;
      translationY -= this._lastScrollYValue;
      const dragToss = 0.05;
      const endOffsetY =
        this.state.lastSnap + translationY + dragToss * velocityY;

      let destSnapPoint = SNAP_POINTS_FROM_TOP[0];
      for (let i = 0; i < SNAP_POINTS_FROM_TOP.length; i++) {
        const snapPoint = SNAP_POINTS_FROM_TOP[i];
        const distFromSnap = Math.abs(snapPoint - endOffsetY);
        if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
          destSnapPoint = snapPoint;
        }
      }

      const END = SNAP_POINTS_FROM_TOP[SNAP_POINTS_FROM_TOP.length - 1];
      setTimeout(() => this.props.visibilityCallBack(destSnapPoint !== END), 0);

      this.setState({ lastSnap: destSnapPoint });
      this._translateYOffset.extractOffset();
      this._translateYOffset.setValue(translationY);
      this._translateYOffset.flattenOffset();
      this._dragY.setValue(0);
      Animated.spring(this._translateYOffset, {
        velocity: velocityY,
        tension: 68,
        friction: 12,
        toValue: destSnapPoint,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    }
  };

  render() {
    return (
      <TapGestureHandler
        maxDurationMs={100000}
        ref={this.masterdrawer}
        maxDeltaY={this.state.lastSnap - SNAP_POINTS_FROM_TOP[0]}
      >
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [{ translateY: this._translateY }],
              },
            ]}
          >
            <BlurView
              tint="light"
              intensity={80}
              style={[
                StyleSheet.absoluteFillObject,
                { borderRadius: 10, backgroundColor: "#fafafa" },
              ]}
            >
              <PanGestureHandler
                ref={this.drawerheader}
                simultaneousHandlers={[this.masterdrawer]}
                shouldCancelWhenOutside={false}
                onGestureEvent={this._onGestureEvent}
                onHandlerStateChange={this._onHeaderHandlerStateChange}
              >
                <Animated.View style={styles.header}>
                  <View
                    style={{
                      backgroundColor: "lightgrey",
                      borderRadius: 8,
                      height: 5,
                      width: 40,
                    }}
                  ></View>
                  {this.props.headerComponent}
                </Animated.View>
              </PanGestureHandler>
              <Animated.View style={styles.container}>
                {this.props.children}
              </Animated.View>
            </BlurView>
          </Animated.View>
        </View>
      </TapGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    padding: 5,
    paddingHorizontal: 10,
  },
});
