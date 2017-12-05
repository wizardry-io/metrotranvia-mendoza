import React, { Component } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

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
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
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
  sign: {
    position: "absolute",
    width: "75%",
    height: "50%",
    left: "50%",
    top: "30%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    backgroundColor: white,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderColor: black,
    borderTopWidth: 20,
    borderBottomWidth: 20,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    padding: 10,
    maxWidth: 500,
    maxHeight: 200
  },
  innerSign: {
    position: "absolute",
    height: "50%",
    width: "100%",
    backgroundColor: white,
    boxShadow: `${black} 0px 1px 15px`
  },
  signText: {
    fontSize: 35,
    fontWeight: "600",
    color: black,
    textAlign: "center",
    zIndex: 2
  },
  cloud: {
    backgroundColor: white,
    borderRadius: 10,
    position: "absolute",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }]
  },
  clouds: {
    width: "100%",
    height: "100%"
  }
});

const moveTrain = (trainY, value, offset) => {
  Animated.timing(trainY, {
    toValue: value + offset
  }).start(() => moveTrain(trainY, value, -offset));
};

const moveClouds = (initialValue, toValue = -1000) => {
  const duration = toValue < 0 ? 0 : 2000; // Only animate clouds when going from right to left
  Animated.timing(initialValue, {
    toValue,
    duration
  }).start(() => moveClouds(initialValue, -toValue));
};

const initialTrainY = -trainHeight / 2 - railwayHeight;

class App extends Component {
  state = {
    trainY: new Animated.Value(initialTrainY),
    cloudsOffset: new Animated.Value(0)
  };
  componentDidMount() {
    moveTrain(this.state.trainY, initialTrainY, -2.5);
    moveClouds(this.state.cloudsOffset);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sky}>
          <Animated.View
            style={[
              { transform: [{ translateX: this.state.cloudsOffset }] },
              styles.clouds
            ]}
          >
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
          </Animated.View>
        </View>
        <View style={styles.land}>
          <Animated.View style={[{ top: this.state.trainY }, styles.train]}>
            <View style={styles.window} />
            <View style={styles.window} />
            <View style={styles.window} />
            <View style={styles.window} />
            <View style={styles.window} />
          </Animated.View>
        </View>
        <View style={styles.sign}>
          <Text style={styles.signText}>METRO TRANVIA MENDOZA</Text>
          <View style={[{ top: 0 }, styles.innerSign]} />
          <View style={[{ top: "50%" }, styles.innerSign]} />
        </View>
      </View>
    );
  }
}

export default App;
