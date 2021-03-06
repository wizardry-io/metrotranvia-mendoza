import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  AsyncStorage,
  TouchableWithoutFeedback,
  Image,
  ScrollView
} from "react-native";
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
    position: "absolute",
    backgroundColor: skyblue,
    width: "100%",
    height: `100%`
  },
  land: {
    position: "absolute",
    top: `${6 / 7 * 100}%`,
    backgroundColor: brown,
    width: "100%",
    height: `${1 / 7 * 100}%`,
    borderStyle: "solid",
    borderTopColor: black,
    borderTopWidth: railwayHeight
  },
  train: {
    position: "absolute",
    width: "50%",
    height: trainHeight,
    backgroundColor: red,
    transform: [{ translateY: -trainHeight / 2 }],
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
    transform: [{ translateX: -2.5 }, { translateY: -trainHeight / 2 }],
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
    bottom: trainHeight * 0.8
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
    backgroundColor: white
  },
  signText: {
    fontSize: 35,
    fontWeight: "600",
    backgroundColor: white,
    textAlign: "center",
    zIndex: 2
  },
  cloud: {
    backgroundColor: white,
    borderRadius: 10,
    position: "absolute"
  },
  clouds: {
    width: "100%",
    flex: 1
  },
  nextTrainTime: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    zIndex: 1
  },
  timeText: {
    display: "flex",
    backgroundColor: white,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2.5
  },
  timesList: {
    display: "flex",
    flex: 1,
    width: "100%",
    backgroundColor: white
  },
  nextStop: {
    position: "absolute",
    bottom: 0,
    width: 60,
    height: 45
  }
});

class TrainTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minutesLeftOpacity: new Animated.Value(1),
      trainTimeOpacity: new Animated.Value(1),
      minutesLeft: props.minutesLeft,
      nextTrainTime: props.nextTrainTime,
      timeList:
        times[props.timePeriod][props.currentStation][
          props.direction === "right"
            ? "mendozaGutierrezDirection"
            : "gutierrezMendozaDirection"
        ]
    };
  }
  componentDidMount() {
    const nextTrainTimeIndex = times[this.props.timePeriod][
      this.props.currentStation
    ][
      this.props.direction === "right"
        ? "mendozaGutierrezDirection"
        : "gutierrezMendozaDirection"
    ].indexOf(this.props.nextTrainTime);
    this.scrollView && this.scrollView.scrollTo({ y: 30 * nextTrainTimeIndex });
  }
  componentWillReceiveProps(nextProps) {
    // Gradually show
    if (!this.props.nextStop && this.props.nextStop !== nextProps.nextStop) {
      this.setState({ lastNextStop: this.props.nextStop }, () =>
        // Preserve next stop so we can show it fade out
        Animated.timing(this.state.trainTimeOpacity, {
          toValue: 1
        }).start()
      );
      return;
    }
    // Gradually hide
    if (!nextProps.nextStop && this.props.nextStop !== nextProps.nextStop) {
      this.setState({ lastNextStop: this.props.nextStop }, () =>
        // Preserve next stop so we can show it fade out
        Animated.timing(this.state.trainTimeOpacity, {
          toValue: 0
        }).start()
      );
      return;
    }
    if (nextProps.minutesLeft !== this.props.minutesLeft) {
      Animated.timing(this.state.minutesLeftOpacity, { toValue: 0 }).start(
        () => {
          this.setState({
            minutesLeft: nextProps.minutesLeft,
            timeList:
              times[nextProps.timePeriod][nextProps.currentStation][
                nextProps.direction === "right"
                  ? "mendozaGutierrezDirection"
                  : "gutierrezMendozaDirection"
              ]
          });
          const nextTrainTimeIndex = times[nextProps.timePeriod][
            nextProps.currentStation
          ][
            nextProps.direction === "right"
              ? "mendozaGutierrezDirection"
              : "gutierrezMendozaDirection"
          ].indexOf(nextProps.nextTrainTime);
          Animated.timing(this.state.minutesLeftOpacity, {
            toValue: 1
          }).start(
            () =>
              this.scrollView &&
              this.scrollView.scrollTo({ y: 30 * nextTrainTimeIndex })
          );
        }
      );
    }
  }
  render() {
    return (
      <Animated.View
        style={[
          this.props.style,
          styles.nextTrainTime,
          {
            height: Dimensions.get("window").height / 4
          }
        ]}
      >
        <View
          style={{
            height: "100%",
            justifyContent: "space-around",
            width: Dimensions.get("window").width / 2,
            maxWidth: 300,
            backgroundColor: black,
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 10,
            paddingBottom: 10
          }}
        >
          {this.state.minutesLeft && (
            <Animated.View
              style={[
                {
                  opacity: this.state.trainTimeOpacity
                },
                styles.timeText
              ]}
            >
              <Animated.Text
                style={{
                  fontSize: Dimensions.get("window").height * 0.08,
                  fontWeight: "600",
                  opacity: this.state.minutesLeftOpacity,
                  color: black,
                  padding: 1
                }}
              >
                {this.state.minutesLeft}
              </Animated.Text>
            </Animated.View>
          )}
          {this.state.nextTrainTime && (
            <Animated.View
              style={[
                { opacity: this.state.trainTimeOpacity },
                styles.timesList
              ]}
            >
              <Animated.View
                style={{
                  opacity: this.state.minutesLeftOpacity,
                  flex: 1
                }}
              >
                <ScrollView
                  ref={scrollView => {
                    this.scrollView = scrollView;
                  }}
                  style={{ flex: 1 }}
                  contentContainerStyle={{
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {this.state.timeList.map(time => (
                    <Text
                      key={time}
                      style={{
                        height: 30,
                        color: time === this.props.nextTrainTime ? red : black
                      }}
                    >
                      {time}
                    </Text>
                  ))}
                </ScrollView>
              </Animated.View>
            </Animated.View>
          )}
        </View>
        <Image
          source={require("./direction.png")}
          style={[
            styles.nextStop,
            {
              right: this.props.direction === "left" ? "auto" : 10,
              left: this.props.direction === "right" ? "auto" : 10,
              transform: this.props.direction === "left" ? [{ scaleX: -1 }] : []
            }
          ]}
        />
        <Text
          style={{
            position: "absolute",
            fontSize: 12.5,
            right: this.props.direction === "left" ? "auto" : 10 + 22.5,
            left: this.props.direction === "right" ? "auto" : 10 + 22.5,
            bottom: 22.5,
            backgroundColor: "transparent"
          }}
        >
          {this.props.nextStop || this.state.lastNextStop}
        </Text>
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
          <View style={styles.land} />
          <TrainTime
            currentStation={this.props.currentStation}
            direction={this.props.direction}
            nextStop={this.props.nextStop}
            minutesLeft={this.props.minutesLeft}
            nextTrainTime={this.props.nextTrainTime}
            timePeriod={this.props.timePeriod}
            style={{
              position: "absolute",
              bottom: `${1 / 7 * 100}%`,
              left: this.state.trainX.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  this.props.direction === "left"
                    ? -2 * Dimensions.get("window").width
                    : 2 * Dimensions.get("window").width,
                  Dimensions.get("window").width / 4 -
                    Dimensions.get("window").width / 4
                ]
              })
            }}
          />
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
          <View style={{ position: "absolute", height: "100%", width: "100%" }}>
            <Animated.View
              style={[
                {
                  top: this.state.trainY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      Dimensions.get("window").height / 3 -
                        Dimensions.get("window").height / 3 * 1 / 7,
                      1 +
                        Dimensions.get("window").height / 3 -
                        Dimensions.get("window").height / 3 * 1 / 7
                    ]
                  }),
                  left:
                    this.props.direction === "left"
                      ? this.state.trainX.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "87.5%"]
                        })
                      : "auto",
                  right:
                    this.props.direction === "left"
                      ? "auto"
                      : this.state.trainX.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["-12.5%", "87.5%"]
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
                  <View
                    style={[styles.trainLight, { left: -trainHeight / 5 }]}
                  />
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
      </View>
    );
  }
}

const getTimePeriodName = timePeriod => {
  let timePeriodName = "";
  switch (timePeriod) {
    case "weekdays":
      timePeriodName = "LUNES A VIERNES";
      break;
    case "saturdays":
      timePeriodName = "SÁBADOS";
      break;
    case "sundaysAndHolidays":
      timePeriodName = "DOMINGOS Y FERIADOS";
      break;
    default:
      break;
  }
  return timePeriodName;
};

const toggleTimePeriod = timePeriod => {
  const timePeriods = ["weekdays", "saturdays", "sundaysAndHolidays"];
  const currentTimePeriodIndex = timePeriods.indexOf(timePeriod);
  const nextTimePeriodIndex =
    currentTimePeriodIndex === timePeriods.length - 1
      ? 0
      : currentTimePeriodIndex + 1;
  return timePeriods[nextTimePeriodIndex];
};

class Sign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signScale: new Animated.Value(1),
      timePeriodOpacity: new Animated.Value(1),
      timePeriodContainerOpacity: new Animated.Value(0),
      timePeriod: props.timePeriod,
      text: "METRO TRANVIA MENDOZA"
    };
  }
  componentDidMount() {
    Animated.timing(this.state.timePeriodContainerOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 2000
    }).start();
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
    if (this.props.timePeriod !== this.state.timePeriod) {
      Animated.timing(this.state.timePeriodOpacity, {
        toValue: 0
      }).start(() =>
        this.setState({ timePeriod: this.props.timePeriod }, () =>
          Animated.timing(this.state.timePeriodOpacity, {
            toValue: 1
          }).start()
        )
      );
    }
  }
  render() {
    return (
      <View style={styles.sign}>
        <TouchableWithoutFeedback
          onPress={() =>
            this.props.onTimePeriodChange(
              toggleTimePeriod(this.state.timePeriod)
            )
          }
        >
          <Animated.View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: 500,
              alignSelf: "center",
              backgroundColor: white,
              marginBottom: 10,
              justifyContent: "center",
              alignItems: "center",
              opacity: this.state.timePeriodContainerOpacity
            }}
          >
            <Animated.Text style={{ opacity: this.state.timePeriodOpacity }}>
              {getTimePeriodName(this.state.timePeriod)}
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <View style={{ flex: 4, width: "100%" }}>
          <TouchableWithoutFeedback onPress={this.props.onLeftTap}>
            <View
              style={{
                position: "absolute",
                width: "50%",
                height: "100%",
                flex: 1,
                left: 0,
                zIndex: 1
              }}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.props.onRightTap}>
            <View
              style={{
                position: "absolute",
                width: "50%",
                height: "100%",
                left: "50%",
                zIndex: 1
              }}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              {
                alignSelf: "center",
                borderWidth: 1,
                borderColor: black
              },
              styles.innerSign
            ]}
          />
          <Animated.View
            style={[
              {
                top: "50%",
                alignSelf: "center",
                borderWidth: 1,
                borderColor: black
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
            <Animated.Text
              style={[
                styles.signText,
                {
                  opacity: this.state.signScale
                }
              ]}
            >
              {this.state.text}
            </Animated.Text>
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
                  top: 0,
                  borderWidth: 1,
                  borderColor: black
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
                  top: "50%",
                  borderWidth: 1,
                  borderColor: black
                },
                styles.innerSign
              ]}
            />
          </Animated.View>
        </View>
      </View>
    );
  }
}

const stations = Object.keys(times.weekdays);

const differenceInMinutes = (date, anotherDate) => {
  const millisecondsToSeconds = 1 / 1000;
  const secondsToMinutes = 1 / 60;
  return Math.trunc(
    Math.abs(date - anotherDate) * millisecondsToSeconds * secondsToMinutes
  );
};

class App extends Component {
  state = {
    currentStation: "PEDRO MOLINA",
    currentTime: new Date(),
    timePeriod: "weekdays"
  };
  componentDidMount() {
    const secondsToMilliseconds = 1000;
    const millisecondsUntilNextMinute =
      (60 - new Date().getSeconds()) * secondsToMilliseconds;
    // When the next minute starts
    this.timerTimeout = setTimeout(() => {
      this.setState({ currentTime: new Date() });
      // Update time every one minute
      this.timerInterval = setInterval(
        () => this.setState({ currentTime: new Date() }),
        60 * 1000
      );
    }, millisecondsUntilNextMinute);
  }
  componentWillUnmount() {
    clearTimeout(this.timerInterval);
    clearTimeout(this.timerTimeout);
  }
  setNextStation = gestureState => {
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
  setPreviousStation = gestureState => {
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
      times[this.state.timePeriod][
        this.state.currentStation
      ].gutierrezMendozaDirection.find(time => {
        const [hours, minutes] = time.split(":");
        return new Date().setHours(hours, minutes) > this.state.currentTime;
      });
    const nextRightTrainTime =
      rightStation &&
      times[this.state.timePeriod][
        this.state.currentStation
      ].mendozaGutierrezDirection.find(time => {
        const [hours, minutes] = time.split(":");
        return new Date().setHours(hours, minutes) > this.state.currentTime;
      });
    return (
      <View style={styles.container}>
        <TrainScene
          style={{ flex: 1 }}
          direction="left"
          nextStop={leftStation ? "MZA" : null}
          currentStation={this.state.currentStation}
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
          timePeriod={this.state.timePeriod}
        />
        <Sign
          currentStop={this.state.currentStation}
          timePeriod={this.state.timePeriod}
          onTimePeriodChange={timePeriod => this.setState({ timePeriod })}
          onCurrentStation={currentStation => this.setState({ currentStation })}
          onLeftTap={this.setNextStation}
          onRightTap={this.setPreviousStation}
        />
        <TrainScene
          style={{ flex: 1 }}
          direction="right"
          nextStop={rightStation ? "GUT" : null}
          currentStation={this.state.currentStation}
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
          timePeriod={this.state.timePeriod}
        />
      </View>
    );
  }
}

export default App;
