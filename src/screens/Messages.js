import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenBackground from "../components/ScreenBackground";

const Messages = () => {
  return (
    <ScreenBackground>
      <View style={styles.content}>
        <Text style={styles.title}>Mesajlar</Text>
      </View>
    </ScreenBackground>
  );
};

export default Messages;

const styles = StyleSheet.create({
  content: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2B2B",
  },
});
