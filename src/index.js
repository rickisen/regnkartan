import React from 'react';
import {Provider} from 'react-redux';
import {View} from 'react-native';
import createAppStore from './redux'; // pun intended

import Radar from './containers/Radar';
import About from './containers/About';

const store = createAppStore();

export default class Main extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{height: '100%'}}>
          <Radar />
        </View>
      </Provider>
    );
  }
}
