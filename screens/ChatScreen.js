import React, { useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Keyboard,
} from "react-native";
import CustomChatHeader from "./CustomChatHeader";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase";
import { Avatar, Divider } from "react-native-elements";

const ChatScreen = ({ route, navigation }) => {
  const room = route.params;
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "from the account user bigmo",
      email: "mmody@gmail.com",
      displayName: "bigmo",
    },
    {
      id: 2,
      message: "sent by carliey",
      email: "mdcarliey@gmail.com",
      displayName: "carliey",
    },
  ]);

  useLayoutEffect(() => {
    // set header options
    navigation.setOptions({
      headerTitle: () => <CustomChatHeader room={room} />,
    });
  }, []);

  const handleSend = () => {
    Keyboard.dismiss();
    const message = {
      id: Math.random() * 10,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName,
      message: text,
      timestamp: Date.now(),
      displayPhoto: auth.currentUser.photoURL,
    };

    setMessages([...messages, message]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {messages.map((message) =>
          message.email === auth.currentUser.email ? (
            <View key={message.id} style={styles.senderContainer}>
              <View style={styles.senderMessageContainer}>
                <Text style={styles.senderUsername}>{message.displayName}</Text>
                <Divider />
                <Text style={styles.senderMessageText}>{message.message}</Text>
                <Text style={styles.senderMessageTime}>12:30</Text>
              </View>
              <Avatar rounded source={{ uri: "blsj" }} size={28} />
            </View>
          ) : (
            <View key={message.id} style={styles.receiverContainer}>
              <Avatar rounded source={{ uri: "blsj" }} size={28} />
              <View style={styles.receiverMessageContainer}>
                <Text style={styles.receiverUsername}>
                  {message.displayName}
                </Text>
                <Divider />
                <Text style={styles.receiverMessageText}>
                  {message.message}
                </Text>
                <Text style={styles.receiverMessageTime}>12:30</Text>
              </View>
            </View>
          )
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          placeholder="Enter message"
          onChangeText={(text) => setText(text)}
          style={styles.input}
        />
        <Ionicons name="send" color="blue" size={24} onPress={handleSend} />
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#ececec",
    borderRadius: 30,
    marginHorizontal: 10,
    padding: 10,
    color: "grey",
  },
  senderContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "flex-end",
    alignContent: "flex-end",
    marginRight: 5,
    marginVertical: 10,
  },
  senderMessageContainer: {
    backgroundColor: "#ececec",
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 30,
    padding: 10,
  },
  senderUsername: {
    color: "red",
    fontWeight: "400",
    fontSize: 14,
  },
  senderMessageTime: {
    color: "grey",
    fontWeight: "200",
    fontSize: 10,
  },
  //receiver message box
  receiverContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "flex-end",
    alignContent: "flex-end",
    marginLeft: 10,
    marginVertical: 10,
  },
  receiverMessageContainer: {
    backgroundColor: "#ececec",
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 30,
    padding: 10,
  },
  receiverUsername: {
    color: "red",
    fontWeight: "400",
    fontSize: 14,
    alignSelf: "flex-end",
  },
  receiverMessageTime: {
    color: "grey",
    fontWeight: "200",
    fontSize: 10,
    alignSelf: "flex-end",
  },
});
