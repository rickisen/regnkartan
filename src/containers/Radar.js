import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'

import { fetchDay } from '../redux/modules/radarImages'

@connect(state => ({
  radar: state.radar,
}))

export default class Radar extends React.Component {
  style = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageHolder: {
      flex: 1,
    },
    button: {
      backgroundColor: '#10aadd',
      height: 40,
      width: 40,
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
    }
  })

  constructor(props) {
    super(props)

    this.state = {
      currentImage: 0,
    }
  }

  componentDidMount() {
    this.props.dispatch(fetchDay('2018/03/25'))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.radar.loadingDay && !nextProps.radar.loadingDay && nextProps.radar.files.length > 0 ) {
      this.setState({currentImage: nextProps.radar.files.length - 1})
    }
  }

  render() {
    const { radar, dispatch } = this.props
    const { currentImage }  = this.state

    return (
      <ImageBackground
        source={{ uri: 'https://opendata-download-radar.smhi.se/explore/img/basemap.png' }}
        style={this.style.container}
      >
        {radar.loadingDay &&
          <Text>Loading...</Text>
        }
        {radar.files.length > 0 && !radar.loadingDay && currentImage <= radar.files.length &&
          <ImageBackground
            source={{ uri: radar.files[currentImage].formats[0].link }}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'flex-end'
            }}
          >
            {currentImage > 0 &&
              <TouchableOpacity
                style={this.style.button}
                onPress={() => this.setState({currentImage: currentImage - 1})}
              >
                <Text style={{color: '#ffffff', fontSize: 20}}> - </Text>
              </TouchableOpacity>
            }

            {currentImage < radar.files.length - 1 &&
              <TouchableOpacity
                style={this.style.button}
                onPress={() => this.setState({currentImage: currentImage + 1})}
              >
                <Text style={{color: '#ffffff', fontSize: 20}}> + </Text>
              </TouchableOpacity>
            }
          </ImageBackground>
        }
      </ImageBackground>
    )
  }
}
