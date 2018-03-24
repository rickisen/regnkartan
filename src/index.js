import React from 'react'
import { Provider } from 'react-redux'
import { View } from 'react-native'
import { NativeRouter, Route } from 'react-router-native'
import createAppStore from './redux' // pun intended

import Nav from './components/Nav'
import Counters from './containers/Counters'
import About from './containers/About'

const store = createAppStore()

export default class Main extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
          <View>
            <Nav/>
            <Route exact path="/" component={Counters}/>
            <Route path="/about" component={About}/>
          </View>
        </NativeRouter>
      </Provider>
    )
  }
}
