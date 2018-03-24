import React from 'react'
import { PropTypes } from 'prop-types'
import {
  Link,
} from 'react-router-native'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default class Nav extends React.Component {
  styles = StyleSheet.create({
    container: {
      paddingTop: 25, //TODO: fix so its correct on all devices.
    }
  })

  render() {
    return (
      <View style={[ this.styles.container ]}>
        <Link to="/" underlayColor='#f0f4f7' >
          <Text>Karta</Text>
        </Link>
        <Link to="/about" underlayColor='#f0f4f7' >
          <Text>About</Text>
        </Link>
      </View>
    )
  }
}
