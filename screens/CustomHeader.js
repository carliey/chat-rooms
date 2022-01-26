import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase";


const CustomHeader = ({ navigation }) => {
  const [openSearch, setOpenSearch] = useState(false); // searchbar
  const [searchKeyword, setSearchKeyword] = useState("");
  const defaultPhoto = "https://firebasestorage.googleapis.com/v0/b/chat-rooms-cd657.appspot.com/o/user.png?alt=media&token=5eed8ee5-603f-4a0b-835d-cf269f3162c1";

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        alert(error);
      });
      //navigation.replace("Login")

  };

  const handleSearch =()=>{
    navigation.navigate("search-result", searchKeyword);
  }

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
        placeholder="Room name"
        onChangeText={setSearchKeyword}
        onSubmitEditing={handleSearch}
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
          uri: auth.currentUser? auth.currentUser.photoURL:defaultPhoto,
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
