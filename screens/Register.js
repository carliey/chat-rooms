import React from "react";
import { StyleSheet, Text, TextInput, Button, View } from "react-native";
import { Formik } from "formik";
import { TouchableOpacity } from "react-native-gesture-handler";
import { auth } from "../firebase";

const Register = () => {
  const sign = ({ email, password, username }) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        // Signed in
        var user = user.userCredential;
        user.updateProfile({
          displayName: username,
          photoURL: "https://example.com/jane-q-user/profile.jpg",
        });
        //
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(error.message);
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
            <TextInput
              placeholder="Enter photo"
              onChangeText={handleChange("photourl")}
              onBlur={handleBlur("photo")}
              value={values.photoUrl}
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
