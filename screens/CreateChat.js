import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db, imagesRef } from "../firebase";
import { MaterialIcons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";

const CreateChat = ({ navigation }) => {
  const [chatName, setChatName] = useState("");
  const [about, setAbout] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const pickImage = async () => {
    //pic image via image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      //handle image picked
      setImageUrl(result.uri);
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      setLoading(true);
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    var date = new Date();
    //get time in a yearmonthdatehourminutesecondsmillisecconds
    let timeString = `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
    //generate a random number from 0 to 999
    let randomNum = Math.floor(Math.random() * 999);

    //concatnate the two to get a random id
    let imageName = `${timeString}-${randomNum}`;

    imagesRef
      .child(imageName)
      .put(blob)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          //console.log("file available at download", downloadURL);
          setImage(downloadURL);
          setLoading(false);
        });
      });
  };

  const handleSubmit = async () => {
    const chatname = chatName.toUpperCase();
    try {
      //check firestore for existing rooms
      setSpinner(true);
      const doc = await db.collection("rooms").doc(chatname).get();
      if (!doc.exists) {
        //check whether an image is provided
        if (image) {
          const addSuccess = await db.collection("rooms").doc(chatname).set({
            title: chatname,
            about: about,
            creatorId: auth.currentUser.uid,
            creatorName: auth.currentUser.displayName,
            displayPhoto: image,
          });
          navigation.replace("Chat Rooms");
        } else {
          const addSuccess = await db.collection("rooms").doc(chatname).set({
            title: chatname,
            about: about,
            creatorId: auth.currentUser.uid,
            creatorName: auth.currentUser.displayName,
            displayPhoto:
              "https://firebasestorage.googleapis.com/v0/b/chat-rooms-cd657.appspot.com/o/defaults%2Fimg_524654.png?alt=media&token=8c1a3d54-4dbd-49ce-8570-ee1601e06e23",
          });
          navigation.replace("Chat Rooms");
        }
      } else {
        setSpinner(false);
        alert("A room with that name already exists!");
      }
    } catch (error) {
      setSpinner(false);
      console.log("Catch error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {spinner && (
        <Spinner
          visible={spinner}
          textContent={"please wait..."}
          textStyle={styles.spinnerTextStyle}
        />
      )}
      <Text>{/* chat name, chatabout, displaypicture submit button*/}</Text>
      <View style={styles.formContainer}>
        <Text>Create a new chatroom</Text>
        <TextInput
          placeholder="name of chat"
          style={styles.input}
          onChangeText={(text) => setChatName(text)}
        />
        <TextInput
          placeholder="About..."
          style={styles.input}
          onChangeText={(text) => setAbout(text)}
        />
        <MaterialIcons
          name="add-a-photo"
          size={45}
          color="black"
          onPress={pickImage}
          style={styles.imageUpload}
        />
        {loading && <ActivityIndicator size="small" color="#0000ff" />}
        <Text style={{ textAlign: "center", marginBottom: 5, color: "green" }}>
          {image ? "Image Selected" : ""}
        </Text>
        <Button title="Create" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default CreateChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "blue",
    paddingVertical: 8,
    marginVertical: 15,
    width: 300,
  },
  imageUpload: {
    alignSelf: "center",
    marginBottom: 10,
  },
});
