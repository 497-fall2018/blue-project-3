import React, { Component } from 'react';
import { TouchableHighlight, Image, Dimensions, Platform, StyleSheet, Text, View, ScrollView, FlatList, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import RNGooglePlaces from 'react-native-google-places';
import { Container, Form, Label, Item, Input, Body, Card, Content, CardItem, Right, Left, Thumbnail, Button, H1, H3, Fab } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Emoji from 'react-native-emoji';
import ResultCard from './resultCard.js'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons'
var firebase = require("firebase");

import { SafeAreaView, createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

import Modal from "react-native-modal";
var _ = require('lodash');
const apikey = "AIzaSyBJj7Qjf-xOnVFfIh-vRg3fLd2EP9F2dVk";
var config = {
  databaseURL: "https://nearusback.firebaseio.com",
  projectId: "nearusback",
}
firebase.initializeApp(config);

const rootref = firebase.database().ref();
type Props = {};
const screen = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  home_container: {
    flex: 1,
    justifyContent: 'center'
  },
  form: {
    marginVertical: 50,
    paddingHorizontal: 20
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

  modal: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 200
  }
});
class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  state = {
    username: "",
    channel: ""
  }
  //Function that creates empty channel (e.g., BlueTeam)

  userExistsCallback(id, exists) {
    if (exists) {
      this.updateSinglename(id, this.state.username);
    } else {
      this.createNewChannel(id);
      this.updateSinglename(id, this.state.username);
    }
    this.dispatchit();
  }
  dispatchit() {
    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Details', params: {
            channelname: this.state.channel,
            username: this.state.username
          }
        })
      ],
    }))
  }
  //This function updates the lat long of a given person in a channel
  updateSinglename(id, name) {
    firebase.database().ref('Users/' + id + '/' + name).update({
      name
    });
  }

  createNewChannel(id) {
    var ref = firebase.database().ref('Users');
    ref.child(id).set({
      name: id
    }).then((data) => {
      //success callback
      console.log('data ', data)
    }).catch((error) => {
      //error callback
      console.log('error ', error)
    })
  }

  channelidexist(id) {

    var ref = firebase.database().ref('Users');
    ref.child(id).once("value", snapshot => {
      var exists = (snapshot.val() !== null);
      this.userExistsCallback(id, exists);
    });

  }


  render() {

    return (
      <SafeAreaView style={styles.container}>
        <Container style={styles.home_container}>
          <Content>
            <H1 style={{ alignSelf: 'center', top: 50 }}>BlueNearUs</H1>
            <Form style={styles.form}>
              <Item floatingLabel>
                <Label>Meeting name</Label>
                <Input onChangeText={(text) => this.setState({ channel: text })} />
              </Item>
              <Item floatingLabel last>
                <Label>Your name</Label>
                <Input onChangeText={(text) => this.setState({ username: text })} />
              </Item>
              <Button full rounded style={{ marginTop: 20 }}
                onPress={() => {
                  if (this.state.channel != "" && this.state.username != "") {
                    this.channelidexist(this.state.channel)
                  }

                }}
              ><Text style={{ fontSize: 20, color: "#EFFFFF" }}>Enter </Text>
                <FontAwesome5 name="smile" style={{ fontSize: 20, color: "#EFFFFF" }} />
              </Button>
            </Form>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }
}

class DetailsScreen extends Component<Props> {
  static navigationOptions = {
    header: null
  }
  state = {
    friendMarkerKey: 1000,
    refreshMarker: true,
    modalOpen: false,
    active: false,
    getPlaces: true,
    people: [],
    contents: [],
    friend_markers: [{
      key: '99',
      coordinate: {
        latitude: 42.057806,
        longitude: -87.675877,
      },
      title: "Your Location",
      pinColor: "#00ff00",
      description: "This is where you are!",
    }],
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
    centroid_new: [{
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

  recalculateCentroid() {
    var coordinates = [];
    var answer;
    var i;
    for (i = 0; i < this.state.friend_markers.length; i++) {
      coordinates.push([this.state.friend_markers[i].coordinate.latitude, this.state.friend_markers[i].coordinate.longitude]);
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


  //Call Database Functions Within React Lifecycle Methods
  componentDidMount() {
    //Sample Functions You Can Call with Firebase
    // this.createNewChannel("BlueTeam");
    //this.writeUserData("Tim", "42.053472", "-87.672652", "BlueTeam");
    // this.writeUserData("Jordan", "42.058053", "-87.675137", "BlueTeam");
    // this.writeUserData("Andrew", "42.067079", "-87.692223","BlueTeam");
    //this.updateSingleData("Robbi", "42.057989", "-87.675641", "BlueTeam");
    //   this.readUserData("BlueTeam");
    //   this.readUserData("AquaTeam");
    // this.updateSingleData("Andrew", "42.067079", "-87.692227","AquaTeam")
    // this.deleteSingleData("Andrew", "BlueTeam");

  }



  //Given channel id, user can add a Name/Lat/Long to that channel
  writeUserData(name, lat, long, id) {
    firebase.database().ref('Users/' + id + '/' + name).set({
      lat,
      long,
      name,
    }).then((data) => {
      //success callback
      console.log('data ', data)
    }).catch((error) => {
      //error callback
      console.log('error ', error)
    })
  }



  //Function that creates empty channel (e.g., BlueTeam)
  createNewChannel(id) {
    firebase.database().ref('Users/' + id).set({
    }).then((data) => {
      //success callback
      console.log('data ', data)
    }).catch((error) => {
      //error callback
      console.log('error ', error)
    })
  }

  //This function asks for an id, or rather a channel name, and reads every single name and correspond lat/long, placing them into the people field in states
  writetopeople(arr) {
    let friends = []
    arr.forEach((child) => {
      let friend = {
        name: child.name,
        coordinate: {
          latitude: child.lat,
          longitude: child.long,
        }
      };
      friends.push(friend);
    });
    this.state.people = friends;
    console.log(this.state.people);
  }

  readUserData(id) {
    return firebase.database().ref('Users/' + id).once('value').then(snapshot => {
      const names = snapshot.val();
      return Object.keys(names).map(n => Object.assign({}, names[n]));
    })

  }
  async waitdata(id, friendName) {
    var friends = await this.readUserData(id);
    this.writetopeople(friends);
    this.state.people.map((item) => {
      console.log("here")
      console.log(item)
      if (item.name === friendName) {
        coordinate = item.coordinate;
        console.log("Andrew coordinates")
        console.log(coordinate)
      }
    });
    console.log(this.state.people); // 10
  }

  // This function deletes an individual name
  deleteSingleData(name, id) {
    firebase.database().ref('Users/' + id + '/' + name).remove();
  }

  //This function updates the lat long of a given person in a channel
  updateSingleData(name, lat, long, id) {
    firebase.database().ref('Users/' + id + '/' + name).update({
      lat,
      long,
    });
  }


  fetchbycategory = (lat, lon, type) => {
    this.state.result = [];
    this.state.contents = [];
    let distanceorradius = type == "parking" ? "radius=1000" : "rankby=distance"
    if (type == "library") {
      distanceorradius = "radius=900"
    }

    // type can be: cafe restaurant parking
    const urlFirst = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&${distanceorradius}&type=${type}&key=${apikey}
    `
    if (this.state.getPlaces == true) {
      fetch(urlFirst)
        .then(res => {
          return res.json();
        })
        .then(res => {
          console.log(res);
          res
          const arrayData = _.uniqBy([...this.state.result, ...res.results], 'id')
          console.log("Lib here")
          console.log(arrayData);

          if (type == "library") {
            element = -1;
            for (var i = 0; i < arrayData.length; i++) {
              if (arrayData[i].place_id == "ChIJa3IhiXTQD4gR6EGI1XZr8FA") {
                element = i;
                break;
              }
            }
            if (element != -1) {
              arrayData.splice(element, 1);
            }
          }
          this.state.result = arrayData;
          this.getPlaceMarkersFunc();
        })
        .catch(error => {
          console.log(error);
        });
      this.state.getPlaces = false;
    }
  }
  fetchpizz = (lat, lon) => {
    this.state.result = [];
    this.state.contents = [];
    const urlFirst = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=pizza&location=${lat},${lon}&radius=1000&key=${apikey}
    `
    if (this.state.getPlaces == true) {
      fetch(urlFirst)
        .then(res => {
          return res.json();
        })
        .then(res => {
          const arrayData = _.uniqBy([...this.state.result, ...res.results], 'id')

          console.log(arrayData);
          this.state.result = arrayData;

          this.getPlaceMarkersFunc();
        })
        .catch(error => {
          console.log(error);
        });
      this.state.getPlaces = false;
    }
  }

  openSearchModal(lat, lon) {
    if (this.state.getPlaces == true)
      RNGooglePlaces.getAutocompletePredictions('mudd', {
        type: 'establishments',
        latitude: lat,
        longitude: lon,
        radius: 1
      }).then((place) => {
        this.state.result = place;
        console.log("Place")
        console.log(place)
        this.getPlaceMarkersFunc();
        //console.log(this.state.contents)
      }).catch(error => console.log(error.message));

    this.state.getPlaces = false

  }

  getPlaceMarkersFunc() {

    this.state.result.map((item) => {
      try {
        urlphoto = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${apikey}`
      } catch (error) { return }

      var marker = {
        key: item.id,
        coordinate: {
          latitude: item.geometry.location.lat,
          longitude: item.geometry.location.lng,
        },
        photo: urlphoto,
        rating: item.rating,
        icon: item.icon,
        title: item.name,
        description: item.vicinity,
        pinColor: "#336CFF",
      };

      this.state.contents.push(marker);

    });

  }

  addFriendMarker(friendName) {
    friendName = "Andrew"
    if (this.state.refreshMarker == true) {
      this.waitdata("BlueTeam", friendName);
      // this.state.people.map((item) => {
      //   console.log("here")
      //   console.log(item)
      //   if (item.name === friendName) {
      //     coordinate = item.coordinate;
      //     console.log("Andrew coordinates")
      //     console.log(coordinate)
      //   }
      // });

      var friend_coordinate = {
        key: this.state.friendMarkerKey,
        coordinate: { latitude: 42.067079, longitude: -87.692223 },
        title: friendName,
        description: ""
      };
      this.state.friendMarkerKey = this.state.friendMarkerKey + 1
      this.state.friend_markers.push(friend_coordinate)
      new_centroid = this.recalculateCentroid()
      console.log("New centroid")
      console.log(new_centroid)
      var centroid_values = [{
        key: '0',
        coordinate: {
          latitude: new_centroid[0],
          longitude: new_centroid[1],
        },
        title: "Your Optimized Hangout Spot!",
        pinColor: "#8B008B",
        description: "",
      }]
      this.state.centroid_new = centroid_values;
    }
    this.state.refreshMarker = false;
  }


  render() {
    this.addFriendMarker()
    const { navigation } = this.props;
    const channel = navigation.getParam('channelname', 'noname');
    const user = navigation.getParam('username', 'nouser');
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
    //const latlng = {
    //latitude: centroid_coords[0],
    //longitude: centroid_coords[1],
    //}

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

              {/*{this.state.markers.map(marker => (
                <Marker
                  key={marker.key}
                  coordinate={marker.coordinate}
                  title={marker.title}
                  description={marker.description}
                />
              ))}*/}

              {this.state.friend_markers.map(marker => (
                <Marker
                  key={marker.key}
                  coordinate={marker.coordinate}
                  title={marker.title}
                  description={marker.description}
                />
              ))}

              {this.state.centroid_new.map(c => (
                <Marker
                  key={c.key}
                  coordinate={c.coordinate}
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
                  coordinate={item.coordinate}
                  title={item.title}
                  description={item.description}
                  pinColor={item.pinColor}
                />
              ))}
            </MapView>
            {/*<Fab
              active={this.state.active}
              direction="down"
              containerStyle={{}}
              style={{ backgroundColor: '#5067FF', top: '30%' }}
              position="topRight"
              onPress={() => this.setState({ active: !this.state.active })}>
            <FontAwesome5 name={"user"} />*/}
            <Button
              style={{
                backgroundColor: '#34A34F',
                marginTop: "10%",
                position: 'absolute',
                right: "3%",
                height: 20,
                width: 50,
                borderRadius: 100
              }}
              onPress={() => this.setState({ modalOpen: true })} >
              <Icon name="md-person-add" style={{ left: 13 }} size={25} color="#EFFFFF" />
            </Button>
            {/*</Fab>*/}
          </Animated.View>

          <Modal
            animationType={"none"}
            visible={this.state.modalOpen}>
            <View style={styles.modal}>
              <View>
                <Text>Add Friends</Text>
                <TouchableHighlight
                  onPress={() => {
                    this.setState({ modalOpen: !this.state.modalOpen });
                  }}>
                  <Text>Hide Modal</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

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

              <Button rounded light style={styles.btn}
                onPress={() => {
                  this.state.getPlaces = true;
                  this.fetchbycategory(latlng.latitude, latlng.longitude, "cafe");

                }} >
                <Emoji name="coffee" style={{ fontSize: 40 }} /></Button>
              <Button rounded light style={styles.btn}
                onPress={() => {
                  this.state.getPlaces = true;
                  this.fetchbycategory(latlng.latitude, latlng.longitude, "restaurant");

                }}
              ><Emoji name="fork_and_knife" style={{ fontSize: 40 }} /></Button>

              <Button rounded light style={styles.btn}
                onPress={() => {
                  this.state.getPlaces = true;
                  this.fetchbycategory(latlng.latitude, latlng.longitude, "library");
                }}
              ><Emoji name="books" style={{ fontSize: 40 }} /></Button>

              <Button rounded light style={styles.btn}
                onPress={() => {
                  this.state.getPlaces = true;
                  this.fetchbycategory(latlng.latitude, latlng.longitude, "parking");

                }}
              ><Emoji name="parking" style={{ fontSize: 40 }} /></Button>

            </View>
            <Content>
              {this.state.contents.map((item) => (
                <ResultCard
                  key={item.id}
                  name={item.title}
                  note={item.description}
                  icon={item.icon}
                  pic={item.photo}
                  rating={item.rating}
                />
              ))}
            </Content>
          </View>
        </Animated.ScrollView>
      </View>


    );
  }
}
const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Details: {
    screen: DetailsScreen,
  },
}, {
    initialRouteName: 'Home',
  });

export default createAppContainer(AppNavigator);
