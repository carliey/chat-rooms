import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { auth } from "../firebase";

const PasswordResetEmail = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [emailSent, setEmailSenT] = useState(false);

  const sendEmail = () => {
    auth
      .sendPasswordResetEmail(input)
      .then(() => {
        // Password reset email sent!
        setEmailSenT(true);
        setInput("");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
        console.log(errorMessage);
      });
  };
  return !emailSent ? (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Email</Text>
      <TextInput
        placeholder="johndoe@example.com"
        onChangeText={setInput}
        style={styles.input}
        value={input}
      />
      <Button onPress={() => sendEmail()} title="Send Email" />
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>Password reset email sent successfully!</Text>
      <Text style={styles.text}>
        please go to your email to reset your password
      </Text>
      <Button
        title="OK"
        onPress={() => navigation.replace("Login")}
        color="#6ab724"
        style={styles.ok}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "white",
  },
  input: {
    borderBottomColor: "blue",
    borderBottomWidth: 1,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "white",
  },
  ok: {
    color: "green",
  },
  text: {
    textAlign: "center",
    backgroundColor: "white",
    fontSize: 16,
    padding: 5,
  },
});

export default PasswordResetEmail;
