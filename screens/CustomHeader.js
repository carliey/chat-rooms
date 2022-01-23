import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase";

const CustomHeader = ({ navigation }) => {
  const [openSearch, setOpenSearch] = useState(false); // searchbar
  const [searchKeyword, setSearchKeyword] = useState("");

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        alert(error);
      });
  };

  //conditional return of searchbar or header
  return openSearch ? (
    <View style={styles.searchBarContainer}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="black"
        onPress={() => setOpenSearch(false)}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="enter text"
        onChangeText={setSearchKeyword}
        value={searchKeyword}
      ></TextInput>
      <Ionicons
        style={styles.cancel}
        name="close"
        size={24}
        color="black"
        onPress={() => setSearchKeyword("")}
      />
    </View>
  ) : (
    <View style={styles.headerContainer}>
      <Avatar
        rounded
        source={{
          uri: auth.currentUser.photoURL,
        }}
        onPress={() => navigation.navigate("Profile")}
      />
      <Text style={styles.headerTitle}>Chat Room</Text>
      <View style={styles.headerRight}>
        <AntDesign
          name="search1"
          size={24}
          color="grey"
          onPress={() => setOpenSearch(true)}
        />
        <AntDesign name="logout" size={24} color="red" onPress={logout} />
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "grey",
  },
  headerRight: {
    flexDirection: "row",
    width: 70,
    justifyContent: "space-around",
  },
  searchBarContainer: {
    flexDirection: "row",
  },
  searchInput: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
});
