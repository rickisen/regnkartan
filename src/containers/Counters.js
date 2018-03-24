import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { StyleSheet, View, Text } from 'react-native'

import Counters from '../components/Counters'
import * as actionCreators from '../redux/modules/counters'

@connect(state => ({
  counters: state.counters,
}))

export default class Counterz extends React.Component {
  render() {
    const { counters, dispatch } = this.props

    return (
      <View>
        <Text>Counterz</Text>
        <Counters
          countersState={ counters }
          newCounter={(...args) => dispatch(actionCreators.newCounter(...args))}
          decrement={(...args) => dispatch(actionCreators.decrement(...args))}
          increment={(...args) => dispatch(actionCreators.increment(...args))}
          incrementWithDelay={(...args) => dispatch(actionCreators.incrementWithDelay(...args))}
        />
      </View>
    )
  }
}
