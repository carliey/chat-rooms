import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import ChatRooms from "../screens/ChatRooms";
import Profile from "../screens/Profile";
import ChatScreen from "../screens/ChatScreen";
import CreateChat from "../screens/CreateChat";
const Stack = createStackNavigator();
const StackNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Chat Rooms" component={ChatRooms} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="chat" component={ChatScreen} />
        <Stack.Screen name="Create Chat" component={CreateChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNav;
