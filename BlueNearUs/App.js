/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import MapView from 'react-native-maps';


type Props = {};

const styles=StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height:400,
    width:400,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});


export default class App extends Component<Props> {


  render() {
    return (
      <View style={styles.container}>
     <MapView
     style={styles.map}
    initialRegion={{
      latitude: 42.055214,
      longitude:  -87.674894,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0221,
    }}
  />
  </View>

    );
  }
}


