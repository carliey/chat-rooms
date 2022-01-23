import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CustomChatHeader = ({ room }) => {
  return (
    <View style={styles.headerContainer}>
      <Avatar
        rounded
        source={{
          uri:
            "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
        }}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{room.name}</Text>
        <Text style={styles.subtitle}>amina233, hassan43 and 45 others</Text>
      </View>
      <MaterialCommunityIcons
        name="dots-vertical"
        size={24}
        color="black"
        onPress={() => alert("open options")}
      />
    </View>
  );
};

export default CustomChatHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    flexGrow: 1,
    marginLeft: 8,
  },
  title: {
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "200",
    color: "#0000008a",
  },
});
