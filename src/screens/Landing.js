import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import AppLogo from "../components/AppLogo"; // ✅ LOGO COMPONENT

export default function Landing({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/landing-bg.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay AYNI */}
      <View style={styles.overlay} />

      <View style={styles.container}>
        {/* LOGO (prop yoksa scale ile büyüt) */}
        <View style={styles.logoWrap}>
          <View style={styles.logoScale}>
            <AppLogo />
          </View>
        </View>

        <Text style={styles.title}>Toprağım</Text>
        <Text style={styles.subtitle}>Atıl toprakları üretime kazandır</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignIn")}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => navigation.navigate("MainTabs")}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonOutlineText}>Giriş Yapmadan Devam Et</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          style={{ marginTop: 22 }}
          activeOpacity={0.8}
        >
          <Text style={styles.bottomText}>
            Henüz hesabın yok mu? <Text style={styles.link}>Kayıt Ol</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  // ❗ Overlay aynı
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(32, 34, 32, 0.45)",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  logoWrap: {
    alignItems: "center",
    marginBottom: 14,
  },

  // ✅ LOGO BÜYÜTME (burayı artır/azalt)
  logoScale: {
    transform: [{ scale: 1.8 }], // 1.6 - 2.0 arası ideal
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
    color: "#F4FFF2",
    letterSpacing: 0.4,
  },

  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.82)",
    marginBottom: 38,
    textAlign: "center",
    lineHeight: 20,
  },

  button: {
    width: "100%",
    backgroundColor: "#2e7d32",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  buttonOutline: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1.5,
    borderColor: "#2e7d32",
  },

  buttonOutlineText: {
    color: "#1f6b2a",
    fontSize: 16,
    fontWeight: "800",
  },

  bottomText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
  },

  link: {
    color: "#9DFF9A",
    fontWeight: "800",
  },
});
