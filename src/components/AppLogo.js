import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppLogo({ size = 28 }) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Ionicons
          name="leaf"
          size={size * 0.65} // ikon orantılı
          color="#E7F0E3"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    backgroundColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
  },
});
