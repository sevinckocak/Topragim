import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ScreenBackground({ children }) {
  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#1F5A2A", "#3E7B33", "#6D8B2E"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.topAccent}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3E9D8",
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    borderBottomLeftRadius: 240,
    borderBottomRightRadius: 240,
    overflow: "hidden",
  },
});
