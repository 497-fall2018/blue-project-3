import React, { Component } from "react";
import { Container, Header, Content, Text, Button, Toast } from "native-base";
export class ToastButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false
    };
  }
  render() {
    return (
          <Button
            onPress={() =>
              Toast.show({
                text: "Wrong password!",
                buttonText: "Okay",
                buttonTextStyle: { color: "#008000" },
                buttonStyle: { backgroundColor: "#5cb85c" }
              })}
          >
            <Text>Toast</Text>
          </Button>
    );
  }
}