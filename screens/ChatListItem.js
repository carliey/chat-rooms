import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, Badge, ListItem } from "react-native-elements/";
import { db } from "../firebase";

const ChatListItem = ({ navigation }) => {
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    db.collection("rooms")
      .get()
      .then((snapshot) => {
        setChatrooms(snapshot.docs.map((item) => item.data()));
      })
      .catch((error) => console.log(error));
  }, []);

  return chatrooms.length > 0 ? (
    <View style={styles.container}>
      {chatrooms.map((l, i) => (
        <ListItem
          key={i}
          bottomDivider
          onPress={() => navigation.navigate("chat", l)}
        >
          <Avatar rounded source={{ uri: l.displayPhoto }} />
          <ListItem.Content>
            <ListItem.Title>{l.title}</ListItem.Title>
            <ListItem.Subtitle>
              last message should be dynamic
            </ListItem.Subtitle>
          </ListItem.Content>
          <View style={styles.badgeContainer}>
            <Text style={styles.time}>12:12</Text>
            <Badge value="99+" status="error" />
          </View>
        </ListItem>
      ))}
    </View>
  ) : (
    <View style={styles.loading}>
      <Text>Loading...</Text>
    </View>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  container: {},
  badgeContainer: {},
  time: {
    color: "grey",
    fontSize: 14,
    position: "absolute",
    top: 20,
  },
  loading: {
    //textAlign: "center",
    justifyContent: "center",
    fontSize: 25,
    alignSelf: "center",
    flex: 1,
  },
});
