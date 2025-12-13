import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../context/auth/AuthContext"; // ✅ path’i projene göre düzelt!

export default function SignUp({ navigation }) {
  const { signUp } = useContext(AuthContext); // ✅ Provider’dan gelecek

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleEmailRegister = async () => {
    const cleanEmail = email.trim();

    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Eksik bilgi", "Ad ve soyad gir.");
      return;
    }
    if (!cleanEmail || !password) {
      Alert.alert("Eksik bilgi", "E-posta ve şifre gir.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Zayıf şifre", "Şifre en az 6 karakter olmalı.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Firebase kayıt
      await signUp(cleanEmail, password);

      // İstersen burada Firestore’a profil kaydı da ekleriz (ad/soyad).
      // Şimdilik auth tamam → onAuthStateChanged user set eder.
    } catch (e) {
      Alert.alert("Kayıt başarısız", e?.message || "Tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => console.log("Google Sign-Up");
  const handleFacebook = () => console.log("Facebook Sign-Up");
  const handlePhone = () => console.log("Phone Sign-Up");

  return (
    <ImageBackground
      source={require("../../assets/landing-bg.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Kayıt Ol</Text>
            <Text style={styles.subtitle}>
              Yeni hesap oluştur ve Toprağım’a katıl
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ad"
              placeholderTextColor="rgba(255,255,255,0.65)"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="Soyad"
              placeholderTextColor="rgba(255,255,255,0.65)"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="E-posta"
              placeholderTextColor="rgba(255,255,255,0.65)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="rgba(255,255,255,0.65)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              activeOpacity={0.9}
              onPress={handleEmailRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.buttonText}>Hesap Oluştur</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                activeOpacity={0.85}
                onPress={handleGoogle}
              >
                <Ionicons name="logo-google" size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                activeOpacity={0.85}
                onPress={handleFacebook}
              >
                <Ionicons name="logo-facebook" size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                activeOpacity={0.85}
                onPress={handlePhone}
              >
                <Ionicons name="call" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("SignIn")}
              activeOpacity={0.85}
              style={{ marginTop: 16 }}
              disabled={loading}
            >
              <Text style={styles.linkText}>
                Zaten hesabın var mı? <Text style={styles.link}>Giriş Yap</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(32, 34, 32, 0.45)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "rgba(20, 22, 20, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 18,
    padding: 18,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    color: "#F4FFF2",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    color: "rgba(255,255,255,0.78)",
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(0,0,0,0.30)",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    color: "#fff",
  },
  button: {
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "700",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 2,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 7,
  },
  linkText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
  },
  link: { color: "#9DFF9A", fontWeight: "900" },
});
