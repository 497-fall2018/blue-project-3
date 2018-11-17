import React, { Component } from 'react';
import { View, Text } from 'react-native';

class location extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
    };
  }

  // rad2degr(rad) { return rad * 180 / Math.PI; }
  // degr2rad(degr) { return degr * Math.PI / 180; }
getLatLngCenter(latLngInDegr) {
    var LATIDX = 0;
    var LNGIDX = 1;
    var sumX = 0;
    var sumY = 0;
    var sumZ = 0;

    for (var i=0; i<latLngInDegr.length; i++) {
        var lat = degr2rad(latLngInDegr[i][LATIDX]);
        var lng = degr2rad(latLngInDegr[i][LNGIDX]);
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

    return ([rad2degr(lat), rad2degr(lng)]);
}

//Norris: 42.053472, -87.672652
//Tech: 42.058053, -87.675137
//Mudd: 42.058320, -87.674434
//Welsh-Ryan: 42.067079, -87.692223
//E2: 42.052071, -87.684719
//EP: 42.049022, -87.677566
//The Garage: 42.059412, -87.673223
// var latLngInDegr=[[42.053472, -87.672652],[42.058053, -87.675137],[42.058320, -87.674434],[42.067079, -87.692223],[42.052071, -87.684719], [42.049022, -87.677566],[42.059412, -87.673223]];
// var centroid=getLatLngCenter(latLngInDegr);
// console.log(centroid[0],centroid[1]);

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
      </View>
    );
  }
}

export default location;