import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Profile({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    console.log("Çıkış yap (sonra Firebase Auth ile bağlarız)");
  };

  return (
    <ScrollView
      style={[styles.container, darkMode && styles.containerDark]}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={[styles.headerCard, darkMode && styles.cardDark]}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={26} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.name, darkMode && styles.textWhite]}>
            Kullanıcı Adı
          </Text>
          <Text style={[styles.email, darkMode && styles.textLight]}>
            user@email.com
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => console.log("Profil düzenle")}
        >
          <Ionicons name="create-outline" size={20} color="#2e7d32" />
        </TouchableOpacity>
      </View>

      {/* QUICK ACTIONS */}
      <Text style={[styles.sectionTitle, darkMode && styles.textWhite]}>
        Kısayollar
      </Text>

      <View style={styles.gridRow}>
        <QuickCard
          title="Favorilerim"
          icon="heart"
          darkMode={darkMode}
          onPress={() => console.log("Favoriler ekranı")}
        />
        <QuickCard
          title="İlanlarım"
          icon="document-text"
          darkMode={darkMode}
          onPress={() => console.log("İlanlarım ekranı")}
        />
      </View>

      <View style={styles.gridRow}>
        <QuickCard
          title="Canlı Destek"
          icon="chatbubbles"
          darkMode={darkMode}
          onPress={() => console.log("Canlı destek ekranı")}
        />
        <QuickCard
          title="Mesajlar"
          icon="mail"
          darkMode={darkMode}
          onPress={() => console.log("Mesajlar tabına git")}
        />
      </View>

      {/* SETTINGS */}
      <Text style={[styles.sectionTitle, darkMode && styles.textWhite]}>
        Ayarlar
      </Text>

      <View style={[styles.listCard, darkMode && styles.cardDark]}>
        <RowItem
          icon="moon"
          title="Dark Mode"
          darkMode={darkMode}
          right={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#ccc", true: "#2e7d32" }}
              thumbColor="#fff"
            />
          }
          onPress={() => setDarkMode((p) => !p)}
        />

        <Divider darkMode={darkMode} />

        <RowItem
          icon="key"
          title="Şifre Değiştir"
          darkMode={darkMode}
          onPress={() => console.log("Şifre değiştirme ekranı")}
        />

        <Divider darkMode={darkMode} />

        <RowItem
          icon="notifications"
          title="Bildirim Ayarları"
          darkMode={darkMode}
          onPress={() => console.log("Bildirim ayarları")}
        />
      </View>

      {/* SUPPORT */}
      <Text style={[styles.sectionTitle, darkMode && styles.textWhite]}>
        Destek
      </Text>

      <View style={[styles.listCard, darkMode && styles.cardDark]}>
        <RowItem
          icon="help-circle"
          title="Yardım / SSS"
          darkMode={darkMode}
          onPress={() => console.log("SSS ekranı")}
        />

        <Divider darkMode={darkMode} />

        <RowItem
          icon="headset"
          title="Canlı Destek"
          darkMode={darkMode}
          onPress={() => console.log("Canlı destek ekranı")}
        />
      </View>

      {/* ACCOUNT */}
      <Text style={[styles.sectionTitle, darkMode && styles.textWhite]}>
        Hesap
      </Text>

      <View style={[styles.listCard, darkMode && styles.cardDark]}>
        <RowItem
          icon="log-out"
          title="Çıkış Yap"
          danger
          darkMode={darkMode}
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
}

/* ---------- Components ---------- */

function QuickCard({ title, icon, onPress, darkMode }) {
  return (
    <TouchableOpacity
      style={[styles.quickCard, darkMode && styles.cardDark]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Ionicons name={icon} size={22} color="#2e7d32" />
      <Text style={[styles.quickText, darkMode && styles.textWhite]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function RowItem({ icon, title, onPress, right, danger, darkMode }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.rowLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? "#d32f2f" : "#2e7d32"}
        />
        <Text
          style={[
            styles.rowText,
            darkMode && styles.textWhite,
            danger && { color: "#d32f2f" },
          ]}
        >
          {title}
        </Text>
      </View>

      <View style={styles.rowRight}>
        {right ? (
          right
        ) : (
          <Ionicons name="chevron-forward" size={18} color="#777" />
        )}
      </View>
    </TouchableOpacity>
  );
}

function Divider({ darkMode }) {
  return (
    <View
      style={[
        styles.divider,
        darkMode && { backgroundColor: "rgba(255,255,255,0.08)" },
      ]}
    />
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f8f3",
    padding: 16,
  },
  containerDark: {
    backgroundColor: "#0f1712",
  },

  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  cardDark: {
    backgroundColor: "#141f18",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  email: {
    marginTop: 2,
    fontSize: 12,
    color: "#666",
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#eaf5eb",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 10,
  },

  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  quickCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  quickText: {
    fontSize: 14,
    fontWeight: "600",
  },

  listCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 6,
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginLeft: 14,
    marginRight: 14,
  },

  textWhite: {
    color: "#fff",
  },
  textLight: {
    color: "#b7c1b8",
  },
});
