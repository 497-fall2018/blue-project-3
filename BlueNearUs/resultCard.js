import React, { Component } from 'react';
import { Body, Card, Content, CardItem, Right, Left, Thumbnail, Button, Icon } from 'native-base';
import { Image, Dimensions, Platform, StyleSheet, Text, View, ScrollView, FlatList, Animated } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const style = StyleSheet.create({
    bold: {
        fontWeight: 'bold'
    }
})

class ResultCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isrc: "https://www.dairyherd.com/sites/default/files/Pan%20Pizza%20Hut.jpg",
            name: "Name",
            note: "Note",
            star: [],
            renderonce: true
        };
    }
    componentDidUpdate() {
        if (this.state.renderonce) {
            var rating = this.props.rating;
            for (let i = 0; i < Math.floor(rating % 6); i++) {
                this.state.star.push({ name: "star" });
            }
            var left = rating - Math.floor(rating % 6);
            if (left > 0 && left <= 0.6) {
                this.state.star.push({ name: "star-half" });
            } else if (left > 0.6) {
                this.state.star.push({ name: "star" });
            }
            this.state.renderonce = false;
        }

    }

    render() {
        return (<Card>
            <CardItem>
                <Left>
                    <Thumbnail source={{ uri: this.props.icon }} />
                    <Body>
                        <Text style={style.bold}>{this.props.name}</Text>
                        <Text note>{this.props.note}</Text>
                    </Body>
                </Left>
            </CardItem>
            <CardItem cardBody>
                <Image source={{ uri: this.props.pic }} style={{ height: 200, width: null, flex: 1 }} />
            </CardItem>
            <CardItem>
                <Left>
                    <Button transparent>
                        {this.state.star.map((item) => (
                            <FontAwesome5 name={item.name} />))}
                        <Text>{this.props.rating}</Text>
                    </Button>
                </Left>
                <Right>
                    <Icon name="arrow-forward" />
                </Right>
            </CardItem>
        </Card>)
    }
}

export default ResultCard;