import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SpeedDial } from "react-native-elements";
import { auth } from "../firebase";
import ChatListItem from "./ChatListItem";
import CustomHeader from "./CustomHeader";

const ChatRooms = ({ navigation }) => {
  const [user, setUser] = useState(null); //logged in user
  const [open, setOpen] = useState(false); // speeddial options

  useEffect(() => {
    //check login status
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigation.replace("Login");
      }
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    //set header options
    const unsubscribe = navigation.setOptions({
      headerTitle: () => <CustomHeader navigation={navigation} />
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <ChatListItem navigation={navigation} />

      <SpeedDial
        isOpen={open}
        icon={{ name: "add", color: "white" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
      >
        <SpeedDial.Action
          icon={{ name: "add", color: "#fff" }}
          title="Create Chat"
          onPress={() => navigation.navigate("Create Chat")}
        />
        <SpeedDial.Action
          icon={{ name: "delete", color: "#fff" }}
          title="Delete"
          onPress={() => console.log("Delete Something")}
        />
      </SpeedDial>
    </View>
  );
};

export default ChatRooms;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  }
});
