import React from "react";
import { StyleSheet, Text, TextInput, Button, View } from "react-native";
import { Formik } from "formik";
import { TouchableOpacity } from "react-native-gesture-handler";
import { auth, usersRef } from "../firebase";

const Register = () => {
  const defualtPhoto =
    "https://firebasestorage.googleapis.com/v0/b/chat-rooms-cd657.appspot.com/o/user.png?alt=media&token=5eed8ee5-603f-4a0b-835d-cf269f3162c1";

  const sign = ({ email, password, username }) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((doc) => {
        // Signed in
        var Loggeduser = doc.userCredential;

        doc.user.updateProfile({
          displayName: username,
          photoURL: defualtPhoto,
        });

        //create default status text
        usersRef
          .doc(doc.user.uid)
          .set({
            status: "Just joined chatrooms",
          })
          .then()
          .catch((error) => console.log("status error:", error));
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.message);
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create an account</Text>
      <Formik
        initialValues={{ email: "", password: "", username: "", photoUrl: "" }}
        onSubmit={(values) => sign(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.form}>
            <TextInput
              placeholder="Enter Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              placeholder="Enter Username"
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
              style={styles.input}
            />
            <TouchableOpacity style={styles.button}>
              <Button onPress={handleSubmit} title="Register" />
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  button: {
    width: 150,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  form: {
    alignItems: "center",
  },
  heading: {
    fontWeight: "500",
    fontSize: 18,
    color: "#424248",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "blue",
    paddingVertical: 8,
    marginVertical: 15,
    width: 300,
  },
});
