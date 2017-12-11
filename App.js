import React from "react";
import App from "./src/App";

// https://medium.com/@yannickdot/write-once-run-anywhere-with-create-react-native-app-and-react-native-web-ad40db63eed0
export default class NativeApp extends React.Component {
  render() {
    return <App />;
  }
}
