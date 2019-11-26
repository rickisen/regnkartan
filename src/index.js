import React from "react";
import { Provider } from "react-redux";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import createAppStore from "./redux"; // pun intended

import Radar from "./screens/Radar";
import Loading from "./screens/Loading";

const RootNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Loading,
      Radar,
    },
    {
      initialRouteName: "Loading",
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
