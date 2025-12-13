import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import LandCard from "../components/LandCard";

const CARD_WIDTH = Dimensions.get("window").width * 0.8;
const CARD_HEIGHT = 300;

export default function Home({ navigation }) {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔥 Firestore -> lands
  useEffect(() => {
    const q = query(collection(db, "lands"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLands(list);
        setLoading(false);
      },
      (err) => {
        console.log("Firestore error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // 🔍 Search filter
  const filteredLands = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lands;

    return lands.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const city = (item.location?.city || "").toLowerCase();
      const district = (item.location?.district || "").toLowerCase();
      const soil = (item.soilType || "").toLowerCase();
      const crops = Array.isArray(item.allowedCrops)
        ? item.allowedCrops.join(" ").toLowerCase()
        : "";

      return (
        title.includes(q) ||
        city.includes(q) ||
        district.includes(q) ||
        soil.includes(q) ||
        crops.includes(q)
      );
    });
  }, [lands, search]);

  const renderLand = ({ item }) => (
    <LandCard
      item={item}
      cardWidth={CARD_WIDTH}
      cardHeight={CARD_HEIGHT}
      onPress={() => navigation.navigate("LandDetail", { land: item })}
    />
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={{ marginTop: 10, color: "#555" }}>
          İlanlar yükleniyor...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <Text style={styles.title}>🌾 Toprak Bankası</Text>
      <Text style={styles.subtitle}>Tarım arazilerini keşfet</Text>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="İlan ara (şehir, ürün, toprak...)"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#888"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* SECTION: ÖNE ÇIKAN ARAZİLER */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Öne Çıkan Araziler</Text>
          <Text style={styles.countText}>{filteredLands.length}</Text>
        </View>

        {filteredLands.length === 0 ? (
          <Text style={styles.emptyText}>İlan bulunamadı</Text>
        ) : (
          <FlatList
            data={filteredLands}
            keyExtractor={(item) => item.id}
            renderItem={renderLand}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            style={{ height: CARD_HEIGHT }}
          />
        )}
      </View>

      {/* ALT BÖLÜMLER */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yakında</Text>
        <Text style={styles.placeholderText}>
          Harita, filtreler ve detay sayfası özellikleri eklenecek.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f8f3",
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f8f3",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2e7d32",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e6eee6",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    color: "#222",
  },

  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  countText: {
    fontSize: 12,
    color: "#2e7d32",
    fontWeight: "700",
    backgroundColor: "#eaf5eb",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },

  emptyText: {
    color: "#777",
    fontSize: 14,
  },
  placeholderText: {
    fontSize: 14,
    color: "#777",
  },
});
