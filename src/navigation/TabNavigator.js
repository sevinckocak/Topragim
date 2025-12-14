import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "../screens/Home";
import Explore from "../screens/Explore";
import AddLand from "../screens/AddLand";
import Messages from "../screens/Messages";
import Profile from "../screens/Profile";
import AppLogo from "../components/AppLogo"; // 🌱 Toprağım kod logo

const Tab = createBottomTabNavigator();

function CenterAddButton({ onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.addBtnWrap}
    >
      <View style={styles.addBtn}>
        <Ionicons name="add" size={28} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // ✅ EN ÖNEMLİSİ BU (beyaz header gider)
        headerShadowVisible: false,

        tabBarActiveTintColor: "#2e7d32",
        tabBarInactiveTintColor: "#8a8a8a",
        tabBarStyle: {
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: "#e7eee7",
          backgroundColor: "#F3E9D8", // ✅ beyaz yerine beige
        },

        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          title: "Keşfet",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      {/* ✅ Floating center add button */}
      <Tab.Screen
        name="Add"
        component={AddLand}
        options={({ navigation }) => ({
          title: "Ekle",
          tabBarLabel: "", // yazıyı kaldır
          tabBarIcon: () => null, // icon'u kaldır
          tabBarButton: () => (
            <CenterAddButton onPress={() => navigation.navigate("Add")} />
          ),
        })}
      />

      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          title: "Mesaj",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  addBtnWrap: {
    top: -22, // biraz daha yukarı (görsel gibi)
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#fff",

    // Android shadow
    elevation: 8,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
});
