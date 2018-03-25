import React from 'react'
import { Provider } from 'react-redux'
import { View } from 'react-native'
import { NativeRouter, Route } from 'react-router-native'
import createAppStore from './redux' // pun intended

import Nav from './components/Nav'
import Radar from './containers/Radar'
import About from './containers/About'

const store = createAppStore()

export default class Main extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
          <View style={{ height: '100%' }}>
            <Route exact path="/" component={Radar}/>
            <Route path="/about" component={About}/>
            <Nav/>
          </View>
        </NativeRouter>
      </Provider>
    )
  }
}
