import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";

const skyblue = "#AFD4FF";
const brown = "#E7A871";
const black = "#4A4A4A";
const red = "#D0011B";
const white = "#F8F8F8";
const yellow = "rgba(255, 255, 5, 0.5)";

const trainHeight = Dimensions.get("window").height * 0.12;
const railwayHeight = 5;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    overflow: "hidden"
  },
  trainScene: {
    display: "flex",
    width: "100%"
  },
  sky: {
    backgroundColor: skyblue,
    width: "100%",
    flex: 6 / 7
  },
  land: {
    backgroundColor: brown,
    width: "100%",
    flex: 1 / 7,
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
    maxWidth: trainHeight * 3
  },
  window: {
    height: "50%",
    width: "40%",
    backgroundColor: black
  },
  windowGroup: {
    width: "25%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  trainSeparator: {
    position: "absolute",
    width: 5,
    height: "100%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    top: "50%",
    left: "50%",
    backgroundColor: black
  },
  trainFront: {
    width: 10,
    height: 10,
    position: "absolute",
    backgroundColor: black,
    bottom: 5
  },
  trainLight: {
    width: trainHeight / 5,
    height: trainHeight / 5,
    position: "absolute",
    backgroundColor: yellow,
    bottom: trainHeight * 0.8,
    boxShadow: `${yellow} 0px 1px 15px`
  },
  sign: {
    width: "100%",
    flex: 1,
    backgroundColor: black,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderColor: black,
    borderTopWidth: 20,
    borderBottomWidth: 20,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    padding: 10,
    zIndex: 1
  },
  innerSign: {
    position: "absolute",
    height: "50%",
    width: "100%",
    maxWidth: 500,
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

const moveTrain = (animatedTrainValue, value, offset) => {
  Animated.timing(animatedTrainValue, {
    toValue: value + offset
  }).start(() => moveTrain(animatedTrainValue, value, -offset));
};

const moveClouds = (
  animatedCloudsValue,
  direction,
  toValue = Dimensions.get("window").width * (direction === "left" ? 1 : -1)
) => {
  const isGoingRight = toValue > 0;
  const isGoingLeft = toValue < 0;
  // To simulate movement to one direction, we animate clouds when they move to the opposite direction.
  // For example, to simulate movement to the left, we animate clouds when they go to the right;
  // and to simulate movement to the right, we animate clouds when they go to the left.
  const shouldAnimate = direction === "left" ? isGoingRight : isGoingLeft;
  const duration = shouldAnimate ? 2000 : 0;
  Animated.timing(animatedCloudsValue, {
    toValue,
    duration
  }).start(() => moveClouds(animatedCloudsValue, direction, -toValue));
};

const initialTrainY = -trainHeight / 2 - railwayHeight;

class TrainScene extends Component {
  state = {
    trainY: new Animated.Value(initialTrainY),
    cloudsOffset: new Animated.Value(
      Dimensions.get("window").width *
        (this.props.direction === "left" ? -1 : 1)
    )
  };
  componentDidMount() {
    moveTrain(this.state.trainY, initialTrainY, -2.5);
    moveClouds(this.state.cloudsOffset, this.props.direction);
  }
  render() {
    return (
      <View style={[this.props.style, styles.trainScene]}>
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
            <View style={styles.windowGroup}>
              <View style={styles.window} />
              <View style={styles.window} />
              <View style={[{ left: -10 }, styles.trainFront]} />
              {this.props.direction === "left" ? (
                <View style={[styles.trainLight, { left: -trainHeight / 5 }]} />
              ) : null}
            </View>
            <View style={styles.trainSeparator} />
            <View style={styles.windowGroup}>
              <View style={styles.window} />
              <View style={styles.window} />
              <View style={[{ right: -10 }, styles.trainFront]} />
              {this.props.direction === "right" ? (
                <View
                  style={[styles.trainLight, { right: -trainHeight / 5 }]}
                />
              ) : null}
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }
}

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TrainScene style={{ flex: 1 }} direction="left" />
        <View style={styles.sign}>
          <Text style={styles.signText}>METRO TRANVIA MENDOZA</Text>
          <View style={[{ top: 0 }, styles.innerSign]} />
          <View style={[{ top: "50%" }, styles.innerSign]} />
        </View>
        <TrainScene style={{ flex: 1 }} direction="right" />
      </View>
    );
  }
}

export default App;
