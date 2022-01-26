import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CustomChatHeader = ({ room, totalMessages }) => {
  return (
    <View style={styles.headerContainer}>
      <Avatar
        rounded
        source={{
          uri:room.displayPhoto,
        }}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{room.title}</Text>
        <Text style={styles.subtitle}>{totalMessages}</Text>
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
