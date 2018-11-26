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
import { Container, Header, Title, Fab, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Toast} from 'native-base';
import { ToastButton } from './toast';



type Props = {};

const styles=StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // height:800,
    // width:400,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    // marginTop: '50%'
  },
  header: {
    ...StyleSheet.absoluteFillObject,
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});


export default class App extends Component<Props> {


  // static navigationOptions = {
  //   headerTitle: <Text> NearUS </Text>,
  //   headerRight: (
  //     <Button
  //       onPress={() => alert('This is a button!')}
  //       title="Info"
  //       color="#fff"
  //     />
  //   ),
  // };
  
  state = {
    showToast: false,
    latitude: null,
    longitude: null,
    user_lat:42.057989,
    user_long:-87.675641,
    error: null,
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
        title: "John",
        description: "This is the location of Person A",
      },
      {
        key: '2',
        coordinate: {
          latitude: 42.058053, 
          longitude: -87.675137, 
        },
        title: "Kelly",
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
    your_location: [{
      key: '99',
      coordinate: {
          latitude: 42.057989,   
          longitude: -87.675641, 
        },
        title: "Your Location",
        pinColor: "#00ff00",
        description: "This is where you are!",
    }],

    
  };

  rad2degr(rad) { return rad * 180 / Math.PI; }
  degr2rad(degr) { return degr * Math.PI / 180; }

//Norris: 42.053472, -87.672652
//Tech: 42.058053, -87.675137
//Mudd: 42.058320, -87.674434
//Welsh-Ryan: 42.067079, -87.692223
//E2: 42.052071, -87.684719
//EP: 42.049022, -87.677566
//The Garage: 42.059412, -87.673223
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
    if (this.state.latitude!=null && this.state.latitude!=null){
    coordinates.push([this.state.user_lat, this.state.user_long]);}
    console.log(coordinates);
    answer=this.getLatLngCenter(coordinates);
    console.log(answer[0],answer[1]);
    return answer;
  }

 

  render() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    console.log("This is your location...");
    console.log(this.state.latitude,this.state.longitude);
    centroid_coords=this.calculateCentroid();
    const latlng={
    latitude: centroid_coords[0],
    longitude: centroid_coords[1],
}
    const latlng2= {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    }
    return (

    <Container>
    <Header>
    <Left/>
    <Body>
      <Title>Header</Title>
    </Body>
    <Right />
  </Header>

    <View style={styles.container}>
     <MapView
      showsUserLocation={true}
      showsCompass={true}
      style={styles.map}
      height={600}
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

      {this.state.your_location.map(y => (
        <Marker
          key = {y.key}
          coordinate={y.coordinate}
          title={y.title}
          description={y.description}
          pinColor={y.pinColor}
        />
      ))}
    </MapView>

    <View style={{padding:10}}>
    <Text>Welcome to NearUs! Discover Friends Near You and Optimized Hangout Spot Instantly!</Text>
    </View>

    <View style={{marginBottom: 10, marginRight:5, flexDirection: 'row'}}>
      <Button bordered info iconLeft style={{padding:10, marginRight:20}}>
        <Text>John</Text>
      </Button>
      <Button bordered info iconLeft style={{padding:10}}>
        <Text>Kelly</Text>
      </Button>
      <Button dark style={{marginLeft:50, padding:10}}>
            <Icon name='add'/>
          </Button>
    </View>



     <Footer>
          <FooterTab>
          <Button full primary>
        <Text>Update Map</Text>
        </Button>
          </FooterTab>
        </Footer>
    </View>


    </Container>

    );
  }
}



