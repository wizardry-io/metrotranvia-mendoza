import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  AsyncStorage
} from "react-native";
import GestureRecognizer, { swipeDirections } from "./GestureRecognizer";
import times from "./times.json"; // Source: http://www.transportes.mendoza.gov.ar/mtm/

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
    margin: 2.5
  }
});

class NextTrainTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minutesLeftOpacity: new Animated.Value(1),
      nextTrainTimeOpacity: new Animated.Value(1),
      minutesLeft: props.minutesLeft,
      nextTrainTime: props.nextTrainTime
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.minutesLeft !== this.props.minutesLeft) {
      Animated.timing(this.state.minutesLeftOpacity, { toValue: 0 }).start(
        () => {
          this.setState({ minutesLeft: nextProps.minutesLeft });
          Animated.timing(this.state.minutesLeftOpacity, {
            toValue: 1
          }).start();
        }
      );
    }
    if (nextProps.nextTrainTime !== this.props.nextTrainTime) {
      Animated.timing(this.state.nextTrainTimeOpacity, { toValue: 0 }).start(
        () => {
          this.setState({ nextTrainTime: nextProps.nextTrainTime });
          Animated.timing(this.state.nextTrainTimeOpacity, {
            toValue: 1
          }).start();
        }
      );
    }
  }
  render() {
    return (
      <Animated.View style={[this.props.style, styles.nextTrainTime]}>
        {this.state.minutesLeft && (
          <View style={styles.timeText}>
            <Animated.Text
              style={{
                fontSize: Dimensions.get("window").height * 0.08,
                fontWeight: "600",
                opacity: this.state.minutesLeftOpacity,
                color: black
              }}
            >
              {this.state.minutesLeft}
            </Animated.Text>
          </View>
        )}
        {this.state.nextTrainTime && (
          <View style={styles.timeText}>
            <Animated.Text
              style={[
                {
                  fontSize: Dimensions.get("window").height * 0.04,
                  opacity: this.state.nextTrainTimeOpacity,
                  color: black
                }
              ]}
            >
              {this.state.nextTrainTime}
            </Animated.Text>
          </View>
        )}
        {this.props.nextStop && (
          <View style={styles.timeText}>
            <Text
              style={{
                fontSize: Dimensions.get("window").height * 0.02,
                color: black
              }}
            >
              <Text style={{ color: black }}>{this.props.nextStop}</Text>
            </Text>
          </View>
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
    }).start(() => {
      AsyncStorage.getItem("METROTRANVIA_MENDOZA_CURRENT_STATION").then(
        currentStation => {
          if (currentStation) {
            this.props.onCurrentStation(currentStation);
          }
          this.setState(
            { text: currentStation || this.props.currentStop },
            () =>
              Animated.timing(this.state.signScale, {
                toValue: 1,
                duration: 1000
              }).start()
          );
        }
      );
    });
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

const stations = [
  "MENDOZA",
  "PEDRO MOLINA",
  "SAN MARTIN",
  "PROGRESO",
  "LUZURIAGA",
  "GUTIERREZ"
];

const differenceInMinutes = (date, anotherDate) => {
  const millisecondsToSeconds = 1 / 1000;
  const secondsToMinutes = 1 / 60;
  return Math.trunc(
    Math.abs(date - anotherDate) * millisecondsToSeconds * secondsToMinutes
  );
};

class App extends Component {
  state = { currentStation: "PEDRO MOLINA", currentTime: new Date() };
  componentDidMount() {
    const secondsToMilliseconds = 1000;
    const millisecondsUntilNextMinute =
      (60 - new Date().getSeconds()) * secondsToMilliseconds;
    // When the next minute starts
    setTimeout(() => {
      this.setState({ currentTime: new Date() });
      // Update time every one minute
      setInterval(() => this.setState({ currentTime: new Date() }), 60 * 1000);
    }, millisecondsUntilNextMinute);
  }
  onSwipeRight = gestureState => {
    const currentStationIndex = stations.indexOf(this.state.currentStation);
    const isFirst = currentStationIndex === 0;
    if (isFirst) {
      return;
    }
    const currentStation = stations[currentStationIndex - 1];
    this.setState({
      currentStation
    });
    AsyncStorage.setItem(
      "METROTRANVIA_MENDOZA_CURRENT_STATION",
      currentStation
    );
  };
  onSwipeLeft = gestureState => {
    const currentStationIndex = stations.indexOf(this.state.currentStation);
    const isLast = currentStationIndex === stations.length - 1;
    if (isLast) {
      return;
    }
    const currentStation = stations[currentStationIndex + 1];
    this.setState({
      currentStation
    });
    AsyncStorage.setItem(
      "METROTRANVIA_MENDOZA_CURRENT_STATION",
      currentStation
    );
  };
  render() {
    const leftStation =
      stations[stations.indexOf(this.state.currentStation) - 1];
    const rightStation =
      stations[stations.indexOf(this.state.currentStation) + 1];
    const nextLeftTrainTime =
      leftStation &&
      times.weekdays[this.state.currentStation].mendozaGutierrezDirection.find(
        time => {
          const [hours, minutes] = time.split(":");
          return new Date().setHours(hours, minutes) > this.state.currentTime;
        }
      );
    const nextRightTrainTime =
      rightStation &&
      times.weekdays[this.state.currentStation].gutierrezMendozaDirection.find(
        time => {
          const [hours, minutes] = time.split(":");
          return new Date().setHours(hours, minutes) > this.state.currentTime;
        }
      );
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
            nextStop={leftStation ? "MENDOZA" : null}
            minutesLeft={
              nextLeftTrainTime &&
              `${differenceInMinutes(
                new Date().setHours(
                  nextLeftTrainTime.split(":")[0],
                  nextLeftTrainTime.split(":")[1]
                ),
                this.state.currentTime
              )}'`
            }
            nextTrainTime={nextLeftTrainTime}
          />
          <Sign
            currentStop={this.state.currentStation}
            onCurrentStation={currentStation =>
              this.setState({ currentStation })
            }
          />
          <TrainScene
            style={{ flex: 1 }}
            direction="right"
            nextStop={rightStation ? "GUTIERREZ" : null}
            minutesLeft={
              nextRightTrainTime &&
              `${differenceInMinutes(
                new Date().setHours(
                  nextRightTrainTime.split(":")[0],
                  nextRightTrainTime.split(":")[1]
                ),
                this.state.currentTime
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
