import "react-native-gesture-handler";
import React from "react";
import { View, Text } from "react-native";
import StackNavigator from "./src/navigation/StackNavigator";
import AuthProvider from "./src/context/auth/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <StackNavigator />
    </AuthProvider>
  );
}
