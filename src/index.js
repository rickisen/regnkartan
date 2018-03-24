import React from 'react'
import { Provider } from 'react-redux'
import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
} from 'react-native'
import {
  NativeRouter,
  Route,
  Link,
} from 'react-router-native'

import createStore from './redux'
import Counters from './containers/Counters'

const store = createStore()

const About = () => (
  <View>
    <Text>Om appen</Text>
  </View>
)

const Nav = ({ match }) => (
  <View>
    <Link
      to="/"
      underlayColor='#f0f4f7'
    >
      <Text>Karta</Text>
    </Link>
    <Link
      to="/about"
      underlayColor='#f0f4f7'
    >
      <Text>About</Text>
    </Link>
  </View>
)

export default Main = () => (
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

// AppRegistry.registerComponent('regnkartan', () => Main);
