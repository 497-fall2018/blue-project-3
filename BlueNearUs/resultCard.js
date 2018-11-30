import React, { Component } from 'react';
import { Body, Card, Content, CardItem, Right, Left, Thumbnail, Button, Icon } from 'native-base';
import { Image, Dimensions, Platform, StyleSheet, Text, View, ScrollView, FlatList, Animated } from 'react-native';

class ResultCard extends Component {
    constructor(props){
        super(props);
        this.state={
            isrc: "",
            name:"",
            note: "",
        };
    }
    render() {
        return (<Card>
                <CardItem>
                    <Left>
                        <Thumbnail source={{ uri: 'http://www.stickpng.com/assets/images/5842997fa6515b1e0ad75adf.png' }} />
                        <Body>
                        <Text>NativeBase</Text>
                        <Text note>This is component</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem cardBody>
                    <Image source={{ uri: 'https://www.dairyherd.com/sites/default/files/Pan%20Pizza%20Hut.jpg' }} style={{ height: 200, width: null, flex: 1 }} />
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent>
                            {/* <Icon active name="thumbs-up" /> */}
                            <Text>12 Likes</Text>
                        </Button>
                    </Left>
                    <Body>
                    <Button transparent>
                        {/* <Icon active name="chatbubbles" /> */}
                        <Text>4 Comments</Text>
                    </Button>
                    </Body>
                    <Right>
                        <Text>11h ago</Text>
                    </Right>
                </CardItem>
            </Card>)
    }
}

export default ResultCard;