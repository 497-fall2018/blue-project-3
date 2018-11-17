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
import { Marker } from 'react-native-maps';


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
  state = {
    region: {
      latitude: 42.055214,
      longitude: -87.674894,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0221,
    },
    markers: [
      {
        key: '1',
        coordinate: {
          latitude: 42.053472, 
          longitude: -87.672652,
        },
        title: "Person A",
        description: "This is the location of Person A",
      },
      {
        key: '2',
        coordinate: {
          latitude: 42.058053, 
          longitude: -87.675137, 
        },
        title: "Person B",
        description: "This is the location of Person B",
      },
      {
        key: '3',
        coordinate: {
          latitude: 42.067079,  
          longitude: -87.692223,
        },
        title: "Person C",
        description: "This is the location of Person C",
      },
    ],

    centroid: [{
      key: '0',
      coordinate: {
          latitude: 42.062245,  
          longitude: -87.677697, 
        },
        title: "Your Optimized Hangout Spot!",
        pinColor: "#8B008B",
        description: "This is the centroid of your locations! :)",
    }],
    
  };

  render() {

    return (
      <View style={styles.container}>
     <MapView
      showsUserLocation={true}
      showsCompass={true}
      style={styles.map}
      initialRegion={this.state.region}
    >
      {this.state.markers.map(marker => (
        <Marker
          key = {marker.key}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
        />
      ))}

      {this.state.centroid.map(c => (
        <Marker
          key = {c.key}
          coordinate={c.coordinate}
          title={c.title}
          description={c.description}
          pinColor={c.pinColor}
        />
      ))}

    </MapView>
    </View>


    );
  }
}



