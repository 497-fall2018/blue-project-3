import React, { Component } from 'react';
import { Body, Card, Content, CardItem, Right, Left, Thumbnail, Button, Icon } from 'native-base';
import { Image, Dimensions, Platform, StyleSheet, Text, View, ScrollView, FlatList, Animated } from 'react-native';

const style = StyleSheet.create({
    bold: {
        fontWeight: 'bold'
    }
})

class ResultCard extends Component {

    constructor(props){
        super(props);
        this.state={
            isrc: "https://www.dairyherd.com/sites/default/files/Pan%20Pizza%20Hut.jpg",
            name: "Name",
            note: "Note",
        };
    }

    render() {
        return (<Card>
                <CardItem>
                    <Left>
                        <Thumbnail source={{ uri: 'http://www.stickpng.com/assets/images/5842997fa6515b1e0ad75adf.png' }} />
                        <Body>
                        <Text style={style.bold}>{this.props.name}</Text>
                        <Text note>{this.props.note}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem cardBody>
                    <Image source={{ uri: this.state.isrc }} style={{ height: 200, width: null, flex: 1 }} />
                </CardItem>
                {/*<CardItem>*/}
                    {/*<Left>*/}
                        {/*<Button transparent>*/}
                            {/*/!* <Icon active name="thumbs-up" /> *!/*/}
                            {/*<Text>12 Likes</Text>*/}
                        {/*</Button>*/}
                    {/*</Left>*/}
                    {/*<Body>*/}
                    {/*<Button transparent>*/}
                        {/*/!* <Icon active name="chatbubbles" /> *!/*/}
                        {/*<Text>4 Comments</Text>*/}
                    {/*</Button>*/}
                    {/*</Body>*/}
                    {/*<Right>*/}
                        {/*<Text>11h ago</Text>*/}
                    {/*</Right>*/}
                {/*</CardItem>*/}
            </Card>)
    }
}

export default ResultCard;