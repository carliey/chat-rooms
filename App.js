import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import StackNav from "./navs/StackNav";

export default function App() {
  return <StackNav />;
}

const styles = StyleSheet.create({
  container: {},
});
