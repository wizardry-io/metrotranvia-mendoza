import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import GestureRecognizer, { swipeDirections } from "./GestureRecognizer";

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
    borderStyle: "solid",
    borderColor: black,
    borderTopWidth: 20,
    borderBottomWidth: 20,
    borderLeftWidth: 10,
    borderRightWidth: 10,
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
  },
  nextTrainTime: {
    top: -Dimensions.get("window").height / 4,
    height: Dimensions.get("window").height / 4,
    width: "35%",
    transform: [{ translateX: "-50%" }],
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 300,
    backgroundColor: black,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 1
  },
  timeText: {
    display: "flex",
    backgroundColor: white,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    margin: 2.5,
    color: black
  }
});

class NextTrainTime extends Component {
  render() {
    return (
      <Animated.View style={[this.props.style, styles.nextTrainTime]}>
        {this.props.minutesLeft && (
          <Text
            style={[
              {
                flex: 4,
                fontSize: Dimensions.get("window").height * 0.08,
                fontWeight: 600
              },
              styles.timeText
            ]}
          >
            {this.props.minutesLeft}
          </Text>
        )}
        {this.props.nextTrainTime && (
          <Text
            style={[
              { flex: 1, fontSize: Dimensions.get("window").height * 0.02 },
              styles.timeText
            ]}
          >
            {this.props.nextTrainTime}
          </Text>
        )}
        {this.props.nextStop && (
          <Text
            style={[
              { flex: 2, fontSize: Dimensions.get("window").height * 0.02 },
              styles.timeText
            ]}
          >
            {this.props.nextStop}
          </Text>
        )}
      </Animated.View>
    );
  }
}

const moveTrainY = (animatedTrainValue, value, offset) => {
  Animated.timing(animatedTrainValue, {
    toValue: value + offset
  }).start(() => moveTrainY(animatedTrainValue, value, -offset));
};

const initialCloudOffset = Dimensions.get("window").width * 1.1;

const moveClouds = (
  animatedCloudsValue,
  direction,
  toValue = initialCloudOffset * (direction === "left" ? -1 : 1)
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
    trainX: new Animated.Value(0.5),
    trainY: new Animated.Value(initialTrainY),
    cloudsOffset: new Animated.Value(
      initialCloudOffset * (this.props.direction === "left" ? -1 : 1)
    )
  };
  componentDidMount() {
    moveTrainY(this.state.trainY, initialTrainY, -2.5);
    Animated.timing(this.state.trainX, {
      toValue: 1,
      delay: 1000,
      duration: 2000
    }).start();
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
                { width: 30, height: 10, top: "20%", left: "20%" },
                styles.cloud
              ]}
            />
            <View
              style={[
                { width: 50, height: 10, top: "10%", left: "50%" },
                styles.cloud
              ]}
            />
            <View
              style={[
                { width: 35, height: 10, top: "0%", left: "70%" },
                styles.cloud
              ]}
            />
            <View
              style={[
                { width: 35, height: 10, top: "30%", left: "100%" },
                styles.cloud
              ]}
            />
            <View
              style={[
                { width: 50, height: 10, top: "50%", left: "0%" },
                styles.cloud
              ]}
            />
            <View
              style={[
                { width: 60, height: 10, top: "70%", left: "10%" },
                styles.cloud
              ]}
            />
            <View
              style={[
                { width: 60, height: 10, top: "80%", left: "80%" },
                styles.cloud
              ]}
            />
          </Animated.View>
        </View>
        <View style={styles.land}>
          <NextTrainTime
            nextStop={this.props.nextStop}
            minutesLeft={this.props.minutesLeft}
            nextTrainTime={this.props.nextTrainTime}
            style={{
              left: this.state.trainX.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  this.props.direction === "left" ? "-135%" : "210%",
                  "50%"
                ]
              })
            }}
          />
          <Animated.View
            style={[
              {
                top: this.state.trainY,
                left:
                  this.props.direction === "left"
                    ? this.state.trainX.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"]
                      })
                    : this.state.trainX.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["100%", "0%"]
                      })
              },
              styles.train
            ]}
          >
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

class Sign extends Component {
  state = {
    signScale: new Animated.Value(1),
    text: "METRO TRANVIA MENDOZA"
  };
  componentDidMount() {
    Animated.timing(this.state.signScale, {
      toValue: 0,
      duration: 1000,
      delay: 1000
    }).start(() =>
      this.setState({ text: this.props.currentStop }, () =>
        Animated.timing(this.state.signScale, {
          toValue: 1,
          duration: 1000
        }).start()
      )
    );
  }
  componentDidUpdate() {
    if (this.props.currentStop !== this.state.text) {
      Animated.timing(this.state.signScale, {
        toValue: 0,
        duration: 500
      }).start(() =>
        this.setState({ text: this.props.currentStop }, () =>
          Animated.timing(this.state.signScale, {
            toValue: 1,
            duration: 500
          }).start()
        )
      );
    }
  }
  render() {
    return (
      <View style={styles.sign}>
        <Animated.View
          style={[
            {
              top: 0,
              left: 0,
              right: 0,
              marginRight: "auto",
              marginLeft: "auto"
            },
            styles.innerSign
          ]}
        />
        <Animated.View
          style={[
            {
              top: "50%",
              left: 0,
              right: 0,
              marginRight: "auto",
              marginLeft: "auto"
            },
            styles.innerSign
          ]}
        />
        <Animated.View
          style={{
            width: "100%",
            height: "100%",
            transform: [{ scaleY: this.state.signScale }],
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={styles.signText}>{this.state.text}</Text>
          <Animated.View
            style={[
              {
                transform: [
                  {
                    skewX: this.state.signScale.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["10deg", "0deg"]
                    })
                  }
                ],
                top: 0
              },
              styles.innerSign
            ]}
          />
          <Animated.View
            style={[
              {
                transform: [
                  {
                    skewX: this.state.signScale.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["-10deg", "0deg"]
                    })
                  }
                ],
                top: "50%"
              },
              styles.innerSign
            ]}
          />
        </Animated.View>
      </View>
    );
  }
}

const stations = ["MENDOZA", "PEDRO MOLINA", "SAN MARTIN"];

// Source: http://www.transportes.mendoza.gov.ar/mtm/
const times = {
  weekdays: {
    MENDOZA: [
      "6:35",
      "6:52",
      "7:09",
      "7:26",
      "7:43",
      "8:00",
      "8:17",
      "8:34",
      "8:51",
      "9:08",
      "9:25",
      "9:42",
      "9:59",
      "10:16",
      "10:33",
      "10:50",
      "11:07",
      "11:24",
      "11:41",
      "11:58",
      "12:15",
      "12:32",
      "12:49",
      "13:06",
      "13:23",
      "13:40",
      "13:57",
      "14:14",
      "14:31",
      "14:48",
      "15:10",
      "15:27",
      "15:44",
      "16:01",
      "16:18",
      "16:35",
      "16:52",
      "17:09",
      "17:26",
      "17:43",
      "18:00",
      "18:17",
      "18:34",
      "18:51",
      "19:08",
      "19:25",
      "19:42",
      "19:59",
      "20:16",
      "20:33",
      "20:50",
      "21:07",
      "21:24",
      "21:41",
      "21:58",
      "22:12",
      "22:47",
      "23:17"
    ],
    "PEDRO MOLINA": [
      "6:40",
      "6:57",
      "7:14",
      "7:31",
      "7:48",
      "8:05",
      "8:22",
      "8:39",
      "8:56",
      "9:13",
      "9:30",
      "9:47",
      "10:04",
      "10:21",
      "10:38",
      "10:55",
      "11:12",
      "11:29",
      "11:46",
      "12:03",
      "12:20",
      "12:37",
      "12:54",
      "13:11",
      "13:28",
      "13:45",
      "14:02",
      "14:19",
      "14:36",
      "14:53",
      "15:15",
      "15:32",
      "15:49",
      "16:06",
      "16:23",
      "16:40",
      "16:57",
      "17:14",
      "17:31",
      "17:48",
      "18:05",
      "18:22",
      "18:39",
      "18:56",
      "19:13",
      "19:30",
      "19:47",
      "20:04",
      "20:21",
      "20:38",
      "20:55",
      "21:12",
      "21:29",
      "21:46",
      "22:03",
      "22:16",
      "22:51",
      "23:21"
    ],
    "SAN MARTIN": [
      "6:47",
      "7:04",
      "7:21",
      "7:38",
      "7:55",
      "8:12",
      "8:29",
      "8:46",
      "9:03",
      "9:20",
      "9:37",
      "9:54",
      "10:11",
      "10:28",
      "10:45",
      "11:02",
      "11:19",
      "11:36",
      "11:53",
      "12:10",
      "12:27",
      "12:44",
      "13:01",
      "13:18",
      "13:35",
      "13:52",
      "14:09",
      "14:26",
      "14:43",
      "15:00",
      "15:22",
      "15:39",
      "15:56",
      "16:13",
      "16:30",
      "16:47",
      "17:04",
      "17:21",
      "17:38",
      "17:55",
      "18:12",
      "18:29",
      "18:46",
      "19:03",
      "19:20",
      "19:37",
      "19:54",
      "20:11",
      "20:28",
      "20:45",
      "21:02",
      "21:19",
      "21:36",
      "21:53",
      "22:10",
      "22:23",
      "22:58",
      "23:28"
    ]
  }
};

const differenceInMinutes = (date, anotherDate) => {
  const millisecondsToSeconds = 1 / 1000;
  const secondsToMinutes = 1 / 60;
  return (
    Math.abs(date - anotherDate) * millisecondsToSeconds * secondsToMinutes
  );
};

class App extends Component {
  state = { currentStation: "PEDRO MOLINA" };
  onSwipeRight = gestureState => {
    const currentStationIndex = stations.indexOf(this.state.currentStation);
    const isFirst = currentStationIndex === 0;
    if (isFirst) {
      return;
    }
    this.setState({
      currentStation: stations[currentStationIndex - 1]
    });
  };
  onSwipeLeft = gestureState => {
    const currentStationIndex = stations.indexOf(this.state.currentStation);
    const isLast = currentStationIndex === stations.length - 1;
    if (isLast) {
      return;
    }
    this.setState({
      currentStation: stations[currentStationIndex + 1]
    });
  };
  render() {
    const leftStation =
      stations[stations.indexOf(this.state.currentStation) - 1];
    const rightStation =
      stations[stations.indexOf(this.state.currentStation) + 1];
    const nextLeftTrainTime =
      leftStation &&
      times.weekdays[leftStation].find(time => {
        const [hours, minutes] = time.split(":");
        return new Date().setHours(hours, minutes) > new Date();
      });
    const nextRightTrainTime =
      rightStation &&
      times.weekdays[rightStation].find(time => {
        const [hours, minutes] = time.split(":");
        return new Date().setHours(hours, minutes) > new Date();
      });
    return (
      <GestureRecognizer
        onSwipeLeft={this.onSwipeLeft}
        onSwipeRight={this.onSwipeRight}
        config={{
          velocityThreshold: 0.1,
          directionalOffsetThreshold: 50
        }}
        style={{
          height: "100%"
        }}
      >
        <View style={styles.container}>
          <TrainScene
            style={{ flex: 1 }}
            direction="left"
            nextStop={leftStation}
            minutesLeft={
              nextLeftTrainTime &&
              `${differenceInMinutes(
                new Date().setHours(
                  nextLeftTrainTime.split(":")[0],
                  nextLeftTrainTime.split(":")[1]
                ),
                new Date()
              )}'`
            }
            nextTrainTime={nextLeftTrainTime}
          />
          <Sign currentStop={this.state.currentStation} />
          <TrainScene
            style={{ flex: 1 }}
            direction="right"
            nextStop={rightStation}
            minutesLeft={
              nextRightTrainTime &&
              `${differenceInMinutes(
                new Date().setHours(
                  nextRightTrainTime.split(":")[0],
                  nextRightTrainTime.split(":")[1]
                ),
                new Date()
              )}'`
            }
            nextTrainTime={nextRightTrainTime}
          />
        </View>
      </GestureRecognizer>
    );
  }
}

export default App;
