import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppLogo() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="leaf" size={18} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
  },
});
