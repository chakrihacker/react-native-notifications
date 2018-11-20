import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Notifications, Permissions } from "expo";

export default class App extends React.Component {
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

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Please accept Notifications Permissions"
          onPress={() => this.askPermissions()}
        />
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
