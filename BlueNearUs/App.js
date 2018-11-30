import React, { Component } from 'react';
import { Image, Dimensions, Platform, StyleSheet, Text, View, ScrollView, FlatList, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import RNGooglePlaces from 'react-native-google-places';
import { Body, Card, Content, CardItem, Right, Left, Thumbnail, Button, H3 , Fab} from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Emoji from 'react-native-emoji';
import ResultCard from './resultCard.js'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons'

type Props = {};
const screen = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  btn: {
    width: 60,
    height: 60,
    justifyContent: 'center'
  },
  map: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject,
  },
});


export default class App extends Component<Props> {

  state = {
    active: false,
    getPlaces:true,
    contents:[],
    latitude: null,
    longitude: null,
    user_lat: 42.057989,
    user_long: -87.675641,
    error: null,
    result: [],
    scroll: new Animated.Value(0),
    region: {
      latitude: 42.055214,
      longitude: -87.674894,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0421,
    },
    markers: [
      {
        key: '1',
        coordinate: {
          latitude: 42.053472,
          longitude: -87.672652,
        },
        title: "Person A",
        description: "Norris",
      },
      {
        key: '2',
        coordinate: {
          latitude: 42.05228,
          longitude: -87.688912,
        },
        title: "Person B",
        description: "Emerson St",
      },
      {
        key: '3',
        coordinate: {
          latitude: 42.067079,
          longitude: -87.692223,
        },
        title: "Person C",
        description: "Welsh-Ryan",
      },
    ],

    centroid: [{
      key: '0',
      coordinate: {
        latitude: 42.057705,
        longitude: -87.682356,
      },
      title: "Your Optimized Hangout Spot!",
      pinColor: "#8B008B",
      description: "Sherman Ave :)",
    }],
    your_location: [{
      key: '99',
      coordinate: {
        latitude: 42.057806,
        longitude: -87.675877,
      },
      title: "Your Location",
      pinColor: "#00ff00",
      description: "This is where you are!",
    }],


  };
  headerY = Animated.multiply(Animated.diffClamp(this.state.scroll, 0, 56), -1);
  rad2degr(rad) { return rad * 180 / Math.PI; }
  degr2rad(degr) { return degr * Math.PI / 180; }
  getLatLngCenter(latLngInDegr) {
    var LATIDX = 0;
    var LNGIDX = 1;
    var sumX = 0;
    var sumY = 0;
    var sumZ = 0;

    for (var i = 0; i < latLngInDegr.length; i++) {
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
    var coordinates = [];
    var answer;
    // this.state.markers.map(m => (
    //     coordinates.push({m.coordinate});
    //   ));
    var i;
    for (i = 0; i < this.state.markers.length; i++) {
      coordinates.push([this.state.markers[i].coordinate.latitude, this.state.markers[i].coordinate.longitude]);
    }
    if (this.state.latitude != null && this.state.latitude != null) {
      coordinates.push([this.state.user_lat, this.state.user_long]);
    }
    //console.log("Centroid...");
    //console.log(coordinates);
    answer = this.getLatLngCenter(coordinates);
    //console.log(answer[0], answer[1]);
    return answer;
  }

  openSearchModal(lat, lon) {
    if(this.state.getPlaces == true)
    RNGooglePlaces.getAutocompletePredictions('pizza', {
      type: 'establishments',
      latitude: lat,
      longitude: lon,
      radius: 1
    }).then((place) => {
      this.state.result = place;
      //console.log(place)
      this.getPlaceMarkersFunc();
      console.log(this.state.contents)
    }).catch(error => console.log(error.message));

    this.state.getPlaces = false

  }

  getPlaceMarkersFunc(){
    var key_id = 10
     this.state.result.map((item) => {
      RNGooglePlaces.lookUpPlaceByID(item.placeID)
      .then((placeCoords) => {
        console.log(placeCoords)
          var marker = {
            key: key_id,
            coordinate : {
              latitude: placeCoords.latitude,
              longitude: placeCoords.longitude,
            },
            title : placeCoords.name,
            description : placeCoords.address,
            pinColor: "#336CFF",
          };
        this.state.contents.push(marker);
        key_id = key_id + 1
      })
      .catch((error) => console.log(error.message));
   });
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
    //console.log("This is your location...");

    //console.log(this.state.latitude, this.state.longitude);
    centroid_coords = this.calculateCentroid();
    const latlng = {
      latitude: centroid_coords[0],
      longitude: centroid_coords[1],
    }

     this.openSearchModal(latlng.latitude, latlng.longitude)



    return (

      <View style={styles.container}>


        <Animated.ScrollView
          style={{ zIndex: 0 }}
          scrollEventThrottle={5}
          scrollEnabled={true}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scroll } } }], { useNativeDriver: true })}
        >
          <Animated.View style={{
            height: screen.height * 0.8,
            width: '100%',
            transform: [{ translateY: Animated.multiply(this.state.scroll, 0.5) }]
          }}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={this.state.region}
              showsUserLocation={true}
              showsCompass={true}
            >

              {this.state.markers.map(marker => (
                <Marker
                  key={marker.key}
                  coordinate={marker.coordinate}
                  title={marker.title}
                  description={marker.description}
                />
              ))}

              {this.state.centroid.map(c => (
                <Marker
                  key={c.key}
                  coordinate={latlng}
                  title={c.title}
                  description={c.description}
                  pinColor={c.pinColor}

                />
              ))}

              {this.state.your_location.map(y => (
                <Marker
                  key={y.key}
                  coordinate={y.coordinate}
                  title={y.title}
                  description={y.description}
                  pinColor={y.pinColor}
                />
              ))}
            {this.state.contents.map((item) => (
                <Marker
                key={item.key}
                coordinate= {item.coordinate}
                title={item.title}
                description={item.description}
                pinColor={item.pinColor}
            />
            ))}
            </MapView>
            <Fab
                active={this.state.active}
                direction="down"
                containerStyle={{ }}
                style={{ backgroundColor: '#5067FF'}}
                position="topRight"
                onPress={() => this.setState({ active: !this.state.active })}>
                <FontAwesome5 name={"user"} />
                <Button style={{ backgroundColor: '#FE5D26' }}>
                  <Text style={{fontSize: 20, color:"#EFFFFF"}}>A</Text>
                </Button>
                <Button style={{ backgroundColor: '#ff00bf' }}>
                  <Text style={{fontSize: 20, color:"#EFFFFF"}}>B</Text>
                </Button>
                <Button style={{ backgroundColor: '#EA2525' }}>
                  <Text style={{fontSize: 20, color:"#EFFFFF"}}>C</Text>
                </Button>
                <Button style={{ backgroundColor: '#34A34F' }}>
                  <Icon name="md-person-add" size={20} color="#EFFFFF"/>
                </Button>
            </Fab>

          </Animated.View>

          <View style={{
            transform: [{ translateY: -100 }],
            width: screen.width,
            paddingHorizontal: 30,
            // paddingVertical: 20,
            paddingTop: 20,
            backgroundColor: 'rgb(255,255,255)',
            borderRadius: 10,
            shadowColor: 'rgb(0,0,0)',
            shadowRadius: 10,
            shadowOffset: { width: 0, height: -9 },
            shadowOpacity: 0.15
          }}>
            <View style={{ ...StyleSheet.absoluteFillObject, top: 100, backgroundColor: 'rgb(255,255,255)' }} />
            <Content style={{ alignSelf: 'center', paddingBottom: 20 }}><H3 style={{ color: 'rgb(74,74,74)' }}>Hangout Places</H3></Content>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', height: 80, }}>

              <Button rounded light style={styles.btn}><Emoji name="coffee" style={{ fontSize: 40 }} /></Button>
              <Button rounded light style={styles.btn}><Emoji name="pizza" style={{ fontSize: 40 }} /></Button>
              <Button rounded light style={styles.btn}><Emoji name="fork_and_knife" style={{ fontSize: 40 }} /></Button>
              <Button rounded light style={styles.btn}><Emoji name="parking" style={{ fontSize: 40 }} /></Button>

            </View>
            <Content>
                {this.state.contents.map((item) => (
                    <ResultCard
                        name={item.title}
                        note={item.description}
                    />
                ))}
            </Content>
          </View>
        </Animated.ScrollView>
      </View>


    );
  }
}
