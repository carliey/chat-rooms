import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Platform,
  TextInput,
  Text,
  TouchableHighlight,
  Button,
  ToastAndroid
} from "react-native";
import { Avatar, Divider, ListItem } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { profilePhotosRef, auth, usersRef } from "../firebase";

const Profile = () => {
  const user = auth.currentUser;
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusText, setStatusText] = useState("");
  const [status, setStatus] = useState("");
  const [display, setDisplay] = useState("none");
  const [displayStatus, setDisplayStatus] = useState("none");
  const [passwordErr, setPasswordErr] = useState("");

  useEffect(() => {
    // get status text from database
    usersRef
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          setStatus(doc.data().status);
        }
      })
      .catch(error => {
        console.log("Error getting document:", error);
      });
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    //pick image via image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      //handle image picked
      setImage(result.uri);
      setUploading(true);
      uploadImage(result.uri);
    }
  };

  //create a blob for image
  const uploadImage = async uri => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    //get timestamp string
    let date = new Date();
    let timeString =
      date.getFullYear() +
      "" +
      (date.getMonth() + 1) +
      "" +
      date.getDate() +
      "" +
      date.getHours() +
      "" +
      date.getMinutes() +
      "" +
      date.getSeconds();

    //upload to firebase firestore
    profilePhotosRef
      .child(timeString)
      .put(blob)
      .then(snapshot => {
        console.log("Uploaded a blob or file!");
        snapshot.ref.getDownloadURL().then(downloadURL => {
          console.log("File available at", downloadURL);
          //updating the profile photo
          user
            .updateProfile({ photoURL: downloadURL })
            .then(() => console.log("update success"))
            .catch(error => console.log(error));
        });
      });

    //close and release blob
    //blob.close();
  };

  //update profile
  const updateProfile = () => {
    if (password !== confirmPassword) {
      setPasswordErr("passwords do not match");
    } else {
      const newPassword = password;
      user
        .updatePassword(newPassword)
        .then(() => {
          ToastAndroid.showWithGravity(
            "Password Changed Successfully",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
          setDisplay("none");
          setPassword("");
          setConfirmPassword("");
        })
        .catch(error => {
          setPasswordErr(error.message);
        });
    }
  };

  //update status
  const updateStatus = () => {
    usersRef
      .doc(user.uid)
      .set({
        status: statusText
      })
      .then(() => {
        // console.log("Document successfully written!");
        setStatus(statusText);
        setStatusText("");
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
    setDisplayStatus("none");
  };
  return (
    <View style={styles.container}>
      <View style={styles.upperBox}>
        <Avatar
          rounded
          size="xlarge"
          source={{
            uri: image ? image : user.photoURL
          }}
        ></Avatar>
        <AntDesign
          name="camerao"
          onPress={pickImage}
          style={styles.camera}
          size={24}
          color="black"
        />
      </View>
      <View style={styles.statusTextContainer}>
        <Text style={styles.quotes}>"</Text>
        <Text style={styles.statusText}>{status}</Text>
        <Text style={styles.quotes}>"</Text>
      </View>

      <Divider orientation="horizontal" subHeaderStyle={{ color: "blue" }} />
      <View style={styles.lowerBox}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() =>
            display == "none" ? setDisplay("flex") : setDisplay("none")
          }
        >
          <ListItem key={0} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Account</ListItem.Title>
              <ListItem.Subtitle>Change username, password</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </TouchableHighlight>
        <View style={{ ...styles.accountDrawer, display: display }}>
          <Text style={styles.formLabels}>
            Username:{" "}
            <Text style={{ color: "red", fontSize: 12 }}>
              *cannot be changed for now
            </Text>
          </Text>
          <TextInput
            placeholder={user.displayName}
            style={styles.input}
            onChangeText={e => setUsername(e)}
            value={user.displayName}
            editable={false}
          />
          <Text style={styles.formLabels}>New Password:</Text>
          <TextInput
            style={styles.input}
            onChangeText={e => setPassword(e)}
            value={password}
            secureTextEntry
          />
          <Text style={styles.formLabels}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={e => setConfirmPassword(e)}
            value={confirmPassword}
            secureTextEntry
          />
          <Text style={{ fontSize: 12, color: "red" }}>{passwordErr}</Text>
          <Button
            onPress={updateProfile}
            style={styles.button}
            title="Save Changes"
          />
        </View>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() =>
            displayStatus == "none"
              ? setDisplayStatus("flex")
              : setDisplayStatus("none")
          }
        >
          <ListItem key={1} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Status</ListItem.Title>
              <ListItem.Subtitle>Update Status</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </TouchableHighlight>
        <View style={{ ...styles.statusContainer, display: displayStatus }}>
          <TextInput
            multiline
            placeholder={status}
            numberOfLines={4}
            onChangeText={e => setStatusText(e)}
            value={statusText}
            style={styles.statusTextInput}
          />
          <Button
            onPress={updateStatus}
            style={styles.button}
            title="Save Changes"
          />
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  accountDrawer: {
    backgroundColor: "white",
    color: "pink",
    padding: 50
  },
  statusContainer: {
    backgroundColor: "white",
    padding: 10
  },
  camera: {
    marginRight: 10
  },
  container: {
    flex: 1
  },
  input: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "blue",
    marginBottom: 8,
    marginHorizontal: 10,
    paddingHorizontal: 5
  },
  lowerBox: {
    flexGrow: 1
  },
  upperBox: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    paddingVertical: 51,
    height: "40%",
    flexWrap: "wrap"
  },
  statusTextContainer: {
    backgroundColor: "white",
    color: "black",
    flexDirection: "row",
    justifyContent: "center"
  },
  statusText: {
    textAlign: "center",
    paddingBottom: 20,
    fontSize: 15,
    fontStyle: "italic"
  },
  statusTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: "blue",
    textAlign: "center",
    marginBottom: 8
  },
  quotes: {
    fontSize: 25,
    fontWeight: "500",
    fontStyle: "italic",
    color: "grey"
  }
});
