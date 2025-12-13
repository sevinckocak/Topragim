import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Landing from "../screens/Landing";
import SignIn from "../screens/Signin";
import SignUp from "../screens/Signup";
import Home from "../screens/Home";

import TabNavigator from "./TabNavigator";
import LandDetail from "../screens/LandDetail";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false, // ✅ tüm ekranlarda üst yazı yok
        }}
      >
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />

        {/* İstersen Home'u tamamen kaldırabilirsin, ama bırakmak istersen: */}
        <Stack.Screen name="Home" component={Home} />

        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* Detay ekranında da üst bar istemiyorsan böyle bırak.
            İstersen sadece detayda header açarız. */}
        <Stack.Screen name="LandDetail" component={LandDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
