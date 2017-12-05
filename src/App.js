import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

const skyblue = "#AFD4FF";
const brown = "#E7A871";
const black = "#4A4A4A";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    overflow: "hidden"
  },
  sky: {
    backgroundColor: skyblue,
    width: "100%",
    height: "80%"
  },
  land: {
    backgroundColor: brown,
    width: "100%",
    height: "20%",
    borderTopStyle: "solid",
    borderTopColor: black,
    borderTopWidth: 5
  },
});

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sky} />
        <View style={styles.land} />
      </View>
    );
  }
}

export default App;
