import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Keyboard,
  Modal,
  Pressable,
  Image,
} from "react-native";
import CustomChatHeader from "./CustomChatHeader";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { Avatar, Divider } from "react-native-elements";
import firebase from "firebase/app";

const ChatScreen = ({ route, navigation }) => {
  const room = route.params;
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const totalMessages =
    messages.length > 0
      ? messages.length + " messages"
      : messages.length + " message";
  const scrollviewRef = useRef();

  useLayoutEffect(() => {
    // set header options
    navigation.setOptions({
      headerTitle: () => (
        <CustomChatHeader
          room={room}
          totalMessages={totalMessages}
          setModalVisible={setModalVisible}
        />
      ),
    });
  }, [navigation, messages]);

  useEffect(() => {
    //fetch messages
    const unsubscribe = db
      .collection("messages")
      .where("room", "==", room.title)
      .orderBy("timestamp")
      .onSnapshot((querySnapshot) => {
        setMessages(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data({ serverTimestamps: "estimate" }),
          }))
        );
      });
    return unsubscribe;
  }, [route]);

  const handleSend = () => {
    Keyboard.dismiss();
    db.collection("messages")
      .add({
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        message: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        displayPhoto: auth.currentUser.photoURL,
        room: room.title,
        userId: auth.currentUser.uid,
      })
      .then()
      .catch((error) => {
        console.log(error);
      });
    setText("");
  };

  return (
    <View style={styles.container}>
      {/* modal code */}
      <Modal
        animationType=""
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.modalImage}
              source={{ uri: room.displayPhoto }}
            ></Image>
            <View style={styles.modalItems}>
              <Text>{room.title}</Text>
              <Text>Creator:</Text>
              <Text>
                {room.creatorName}
                {auth.currentUser.displayName == room.creatorName && "(You)"}
              </Text>
              <Text>About Room:</Text>
              <Text>{room.about}</Text>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>▲</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* end of modal */}

      <ScrollView
        ref={scrollviewRef}
        onContentSizeChange={() =>
          scrollviewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message) =>
          message.data.email === auth.currentUser.email ? (
            <View key={message.id} style={styles.senderContainer}>
              <View style={styles.senderMessageContainer}>
                <Text style={styles.senderUsername}>
                  {message.data.displayName}
                </Text>
                <Divider />
                <Text style={styles.senderMessageText}>
                  {message.data.message}
                </Text>
                <Text style={styles.senderMessageTime}>
                  {new Date(
                    message.data.timestamp.seconds * 1000
                  ).toLocaleString()}
                </Text>
              </View>
              <Avatar
                rounded
                source={{ uri: message.data.displayPhoto }}
                size={28}
              />
            </View>
          ) : (
            <View key={message.id} style={styles.receiverContainer}>
              <Avatar
                rounded
                source={{ uri: message.data.displayPhoto }}
                size={28}
              />
              <View style={styles.receiverMessageContainer}>
                <Text style={styles.receiverUsername}>
                  {message.data.displayName}
                </Text>
                <Divider />
                <Text style={styles.receiverMessageText}>
                  {message.data.message}
                </Text>
                <Text style={styles.receiverMessageTime}>
                  {new Date(
                    message.data.timestamp.seconds * 1000
                  ).toLocaleString()}
                </Text>
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
          onSubmitEditing={handleSend}
          value={text}
        />
        <Ionicons name="send" color="#2196F3" size={24} onPress={handleSend} />
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

  // modal styles
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  modalView: {
    margin: 0,
    backgroundColor: "white",
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    borderWidth: 1,
    height: 300,
    width: 390,
  },
  button: {
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
