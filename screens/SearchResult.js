import React from "react";
import ChatListItem from "./ChatListItem";
import { View, Text } from "react-native";

const SearchResult = ({ navigation, route }) => {
  const keyword = route.params;

  return (
    <>
      <View>
        <Text>keyword:{keyword}</Text>
        <ChatListItem keyword={keyword} navigation={navigation} />
      </View>
    </>
  );
};

export default SearchResult;
