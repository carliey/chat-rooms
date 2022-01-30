import React, { useLayoutEffect } from "react";
import ChatListItem from "./ChatListItem";

const SearchResult = ({ navigation, route }) => {
  const keyword = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `search-result: ${keyword}`,
    });
  }, []);

  return (
    <>
      <ChatListItem keyword={keyword} navigation={navigation} />
    </>
  );
};

export default SearchResult;
