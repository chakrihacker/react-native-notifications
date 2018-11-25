import React from "react";
import { StyleSheet, Text, View, Button, Clipboard } from "react-native";
import { Notifications, Permissions } from "expo";

export default class App extends React.Component {
  state = {
    token: "",
    data: null,
    origin: null
  };

  askPermissions = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }
    return true;
  };

  sendNotificationImmediately = async () => {
    let notificationId = await Notifications.presentLocalNotificationAsync({
      title: "This is crazy",
      body: "Your mind will blow after reading this"
    });
    console.log(notificationId); // can be saved in AsyncStorage or send to server
  };

  scheduleNotification = async () => {
    let notificationId = Notifications.scheduleLocalNotificationAsync(
      {
        title: "I'm Scheduled",
        body: "Wow, I can show up even when app is closed"
      },
      {
        repeat: "minute",
        time: new Date().getTime() + 10000
      }
    );
    console.log(notificationId);
  };

  registerForPushNotifications = async () => {
    const enabled = await this.askPermissions();
    if (!enabled) {
      return Promise.resolve();
    }
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    return token;
  };

  enablePushNotifications = async () => {
    let token = await this.registerForPushNotifications();
    if (token) {
      Clipboard.setString(token);
      this.setState({ token });
    }
  };

  componentDidMount = () => {
    this.notificationSubscription = Notifications.addListener(
      this.handlePushNotification
    );
  };

  componentWillUnmount = () => {
    this.notificationSubscription.remove();
  };

  handlePushNotification = ({ origin, data }) => {
    this.setState({ data, origin });
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Please accept Notifications Permissions"
          onPress={() => this.askPermissions()}
        />
        <Button
          title="Send Notification immediately"
          onPress={() => this.sendNotificationImmediately()}
        />
        <Button
          title="Dismiss All Notifications"
          onPress={() => Notifications.dismissAllNotificationsAsync()}
        />
        <Button
          title={"Schedule Notification"}
          onPress={() => this.scheduleNotification()}
        />
        <Button
          title="Cancel Scheduled Notifications"
          onPress={() => Notifications.cancelAllScheduledNotificationsAsync()}
        />
        {this.state.token.length === 0 ? (
          <Button
            title={"Get Push Token"}
            onPress={this.enablePushNotifications}
          />
        ) : (
          <Text>{this.state.token}</Text>
        )}
        <Text>{this.state.origin && this.state.origin}</Text>
        <Text>{this.state.data && this.state.data}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
