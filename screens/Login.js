import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import { auth } from "../firebase";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  //check for user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Chat Rooms");
      }
    });

    return unsubscribe;
  }, []);

  function handleSubmit() {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        // Signed in
        var user = user.user;
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.jpg")} style={styles.logo} />
      <TextInput
        autoCompleteType="email"
        style={styles.input}
        placeholder="Enter Email"
        onChangeText={(val) => setEmail(val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        onChangeText={(val) => setpassword(val)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button}>
        <Button title="Sign in" onPress={handleSubmit} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Button
          title="Register"
          color="#6ab724"
          onPress={() => navigation.navigate("Register")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  button: {
    flexDirection: "column",
    width: 150,
    marginVertical: 4,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginVertical: 10,
  },
  input: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "blue",
    paddingVertical: 8,
    marginBottom: 10,
    width: 300,
  },
});
