import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

const skyblue = "#AFD4FF";
const brown = "#E7A871";
const black = "#4A4A4A";
const red = "#D0011B";
const white = "#F8F8F8";

const trainHeight = 100;
const railwayHeight = 5;

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
    borderTopWidth: railwayHeight
  },
  train: {
    position: "absolute",
    width: "50%",
    height: trainHeight,
    backgroundColor: red,
    left: "50%",
    transform: "translate(-50%,-50%)",
    top: -trainHeight / 2 - railwayHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 300
  },
  window: {
    height: "50%",
    width: "10%",
    backgroundColor: black
  },
  cloud: {
    backgroundColor: white,
    borderRadius: 10,
    position: "absolute",
    transform: "translate(-50%,-50%)"
  }
});

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sky}>
          <View
            style={[
              { width: 30, height: "2.5%", top: "20%", left: "20%" },
              styles.cloud
            ]}
          />
          <View
            style={[
              { width: 50, height: "2.5%", top: "10%", left: "50%" },
              styles.cloud
            ]}
          />
          <View
            style={[
              { width: 35, height: "2.5%", top: "0%", left: "70%" },
              styles.cloud
            ]}
          />
          <View
            style={[
              { width: 35, height: "2.5%", top: "30%", left: "100%" },
              styles.cloud
            ]}
          />
          <View
            style={[
              { width: 50, height: "2.5%", top: "50%", left: "0%" },
              styles.cloud
            ]}
          />
          <View
            style={[
              { width: 60, height: "2.5%", top: "70%", left: "10%" },
              styles.cloud
            ]}
          />
          <View
            style={[
              { width: 60, height: "2.5%", top: "80%", left: "80%" },
              styles.cloud
            ]}
          />
        </View>
        <View style={styles.land}>
          <View style={styles.train}>
            <View style={styles.window} />
            <View style={styles.window} />
            <View style={styles.window} />
            <View style={styles.window} />
            <View style={styles.window} />
          </View>
        </View>
      </View>
    );
  }
}

export default App;