import React from "react";
import { Provider } from "react-redux";
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
} from "react-navigation";
import createAppStore from "./redux"; // pun intended

import Drawer from "./components/Drawer";
import Radar from "./containers/Radar/RadarMap";
import About from "./containers/About";

const RootNavigator = createAppContainer(
  createDrawerNavigator(
    {
      Home: createStackNavigator(
        { Radar, About },
        { initialRouteName: "Radar" }
      ),
    },
    {
      initialRouteName: "Home",
      contentComponent: Drawer,
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
