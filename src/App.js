/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import * as React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import AppContainer from './config/routes/index'

export default class App extends React.Component {
  render() {
    return (
      <AppContainer />
    );
  }
}
