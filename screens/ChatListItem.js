import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Avatar, ListItem } from "react-native-elements/";
import { db } from "../firebase";
import Spinner from "react-native-loading-spinner-overlay";

const ChatListItem = ({ navigation, keyword }) => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //to implement the searching functionality
    if (keyword) {
      keyword = keyword.toUpperCase();
      setLoading(true);
      db.collection("rooms")
        .where("title", ">=", keyword)
        .where("title", "<=", keyword + "~")
        .get()
        .then((snapshot) => {
          setLoading(false);
          setChatrooms(snapshot.docs.map((item) => item.data()));
        })
        .catch((error) => console.log(error));
    } else {
      db.collection("rooms").onSnapshot((querySnapshot) => {
        setLoading(false);
        setChatrooms(querySnapshot.docs.map((item) => item.data()));
      });
    }
  }, [navigation, keyword]);

  return (
    <ScrollView style={styles.container}>
      {loading && (
        <Spinner
          visible={loading}
          textContent={"..."}
          textStyle={{ color: "white" }}
        />
      )}
      {chatrooms.length > 0 ? (
        <>
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
                  Created By: {l.creatorName}
                </ListItem.Subtitle>
              </ListItem.Content>
              <View style={styles.badgeContainer}>
                {/* <Badge value="99+" status="error" /> */}
              </View>
            </ListItem>
          ))}
        </>
      ) : (
        <View style={styles.loading}>
          {!keyword ? <Text>No rooms yet</Text> : <Text>No match found</Text>}
        </View>
      )}
    </ScrollView>
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
    justifyContent: "flex-end",
    fontSize: 25,
    alignItems: "center",
    flex: 1,
    padding: 20,
  },
});
