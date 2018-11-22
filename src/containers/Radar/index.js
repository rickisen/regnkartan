import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  Slider,
} from "react-native";
import { BlurView, MapView, Overlay } from "expo";

import RadarUi from "./RadarUi";
import StatusBarBg from "../../components/StatusBarBg";
import { FETCH_DAY } from "../../redux/modules/radarImages";

@connect(state => ({
  radar: state.radar,
}))
export default class Radar extends React.Component {
  static navigationOptions = {
    header: null,
  };

  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      currentImage: 0,
      preFetchLock: false,
      timeout: null,
    };
  }

  componentDidMount() {
    let day = new Date();
    this.props.dispatch({ type: FETCH_DAY, day });
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.radar.loadingDay &&
      !nextProps.radar.loadingDay &&
      nextProps.radar.files.length > 0
    ) {
      this.setState({ currentImage: nextProps.radar.files.length - 1 });

      // prefetch one image for every hour
      for (var i = 0, len = nextProps.radar.files.length; i < len; i += 5) {
        Image.prefetch(nextProps.radar.files[i].formats[0].link);
      }

      // and prefetch the closest ones
      for (var j = nextProps.radar.files.length - 1; j >= 0; j--) {
        if (nextProps.radar.files.length - j < 40) {
          Image.prefetch(nextProps.radar.files[j].formats[0].link);
        }
      }
    }
  }

  render() {
    const { styles } = this;
    const { radar, dispatch } = this.props;
    const { currentImage } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            longitudeDelta: 25.028292923748296,
            latitudeDelta: 21.65852361684243,
            longitude: 12.726598744228632,
            latitude: 60.277280957502605,
          }}
        >
          {radar.files.length > 0 &&
            !radar.loadingDay &&
            currentImage <= radar.files.length && (
              <MapView.Overlay
                image={{ uri: radar.files[currentImage].formats[0].link }}
                bounds={[
                  [70.0481802310529, 5.284852981567384], // find the right coordinates
                  [53.681407816665974, 29.781146049499515], // find the right coordinates
                ]}
              />
            )}
          <StatusBarBg />
        </MapView>
        <RadarUi
          currentImage={currentImage}
          radarFiles={radar.files}
          setCurrentFile={i => this.setState({ currentImage: i })}
        />
      </View>
    );
  }
}
