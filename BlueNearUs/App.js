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

  rad2degr(rad) { return rad * 180 / Math.PI; }
  degr2rad(degr) { return degr * Math.PI / 180; }

  getLatLngCenter(latLngInDegr) {
    var LATIDX = 0;
    var LNGIDX = 1;
    var sumX = 0;
    var sumY = 0;
    var sumZ = 0;

    for (var i=0; i<latLngInDegr.length; i++) {
        var lat = this.degr2rad(latLngInDegr[i][LATIDX]);
        var lng = this.degr2rad(latLngInDegr[i][LNGIDX]);
        // sum of cartesian coordinates
        sumX += Math.cos(lat) * Math.cos(lng);
        sumY += Math.cos(lat) * Math.sin(lng);
        sumZ += Math.sin(lat);
    }

    var avgX = sumX / latLngInDegr.length;
    var avgY = sumY / latLngInDegr.length;
    var avgZ = sumZ / latLngInDegr.length;

    // convert average x, y, z coordinate to latitude and longtitude
    var lng = Math.atan2(avgY, avgX);
    var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    var lat = Math.atan2(avgZ, hyp);

    return ([this.rad2degr(lat), this.rad2degr(lng)]);
}


  calculateCentroid() {
    var coordinates=[];
    var answer;
    // this.state.markers.map(m => (
    //     coordinates.push({m.coordinate});
    //   ));
    var i;
    for (i=0;i<this.state.markers.length;i++) {
      coordinates.push([this.state.markers[i].coordinate.latitude,this.state.markers[i].coordinate.longitude]);
    }
    console.log(coordinates);
    answer=this.getLatLngCenter(coordinates);
    console.log(answer[0],answer[1]);
    return answer;
  }



  render() {
    centroid_coords=this.calculateCentroid();
    const latlng={
    latitude: centroid_coords[0],
    longitude: centroid_coords[1],
}
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
          coordinate={latlng}
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



