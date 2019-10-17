import React from "react";
import { Provider } from "react-redux";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import createAppStore from "./redux"; // pun intended

import Radar from "./screens/Radar";
import About from "./screens/About";

const RootNavigator = createAppContainer(
  createStackNavigator(
    {
      Home: Radar,
      About: About,
    },
    {
      initialRouteName: "Home",
    }
  )
);

const store = createAppStore();

export default class Main extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    );
  }
}
