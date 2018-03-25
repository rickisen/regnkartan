import React from 'react'
import { PropTypes } from 'prop-types'
import {
  Link,
  withRouter,
} from 'react-router-native'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

class Nav extends React.Component {
  styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      height: 80,
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    child :{
      margin: 10,
    },
  })

  render() {
    return (
      <View style={[this.styles.container]}>
        {this.props.location.pathname === '/' ?
          <Link style={[this.styles.child]} to="/about" underlayColor='#f0f4f7' >
            <Text>Om Appen</Text>
          </Link>
          :
          <Link style={[this.styles.child]} to="/" underlayColor='#f0f4f7' >
            <Text>Tillbaks</Text>
          </Link>
        }
      </View>
    )
  }
}

export default withRouter(Nav)
