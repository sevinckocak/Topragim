import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import { db } from "../firebase/FirebaseConfig";
import LandCard from "../components/LandCard";
import AppLogo from "../components/AppLogo";
import ScreenBackground from "../components/ScreenBackground";

import {
  getRecentlyViewed,
  clearRecentlyViewed,
} from "../utils/recentlyViewed";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.78;
const CARD_HEIGHT = 300;

const CATEGORIES = [
  { key: "tarla", label: "Tarla", icon: "grid-outline" },
  { key: "bahce", label: "Bahçe", icon: "leaf-outline" },
  { key: "mera", label: "Mera", icon: "cloud-outline" },
  { key: "sera", label: "Sera", icon: "home-outline" },
  { key: "klara", label: "Klara", icon: "car-outline" },
];

export default function Home({ navigation }) {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("tarla");
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const featuredListRef = useRef(null);

  // 🔥 Firestore
  useEffect(() => {
    const q = query(collection(db, "lands"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setLands(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  // 🔁 En son baktıkların (Home'a her gelişte)
  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      (async () => {
        const data = await getRecentlyViewed();
        if (active) setRecentlyViewed(data);
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  // 🔍 Search
  const filteredLands = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lands;

    return lands.filter((i) =>
      [
        i.title,
        i.location?.city,
        i.location?.district,
        i.soilType,
        ...(i.allowedCrops || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
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
      <ScreenBackground>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={{ marginTop: 10, color: "#555" }}>
            İlanlar yükleniyor...
          </Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ✅ LOGO (scroll ile yukarı kaybolur) */}
        <View style={styles.logoWrap}>
          <AppLogo size={90} />
        </View>

        {/* ✅ SEARCH */}
        <LinearGradient
          colors={["#0f3a1e", "#1f6a2f", "#2e7d32"]}
          style={styles.searchOuter}
        >
          <View style={styles.searchInner}>
            <View style={styles.searchIconWrap}>
              <Ionicons name="search" size={18} color="#fff" />
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Arazi, konum veya ürün ara..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#7a7a7a"
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* ✅ KATEGORİLER */}
        <View style={styles.section}>
          <Text style={styles.bigTitle}>Kategoriler</Text>
          <View style={styles.categoriesRow}>
            {CATEGORIES.map((c) => {
              const active = activeCategory === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => setActiveCategory(c.key)}
                  style={styles.categoryItem}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.categoryCircle,
                      active && styles.categoryCircleActive,
                    ]}
                  >
                    <Ionicons
                      name={c.icon}
                      size={22}
                      color={active ? "#fff" : "#2e7d32"}
                    />
                  </View>
                  <Text style={styles.categoryLabel}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ✅ ÖNE ÇIKAN */}
        <View style={styles.section}>
          <Text style={styles.bigTitle}>Öne Çıkan Araziler</Text>

          <FlatList
            ref={featuredListRef}
            data={filteredLands}
            renderItem={renderLand}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 8 }}
            style={{ height: CARD_HEIGHT }}
          />
        </View>

        {/* ✅ EN SON BAKTIKLARIN */}
        <View style={styles.section}>
          <View style={styles.recentHeader}>
            <Text style={styles.bigTitle}>En Son Baktıkların</Text>

            {recentlyViewed.length > 0 && (
              <TouchableOpacity
                style={styles.clearBtn}
                activeOpacity={0.85}
                onPress={async () => {
                  await clearRecentlyViewed();
                  setRecentlyViewed([]);
                }}
              >
                <Ionicons name="trash-outline" size={16} color="#2e7d32" />
                <Text style={styles.clearText}>Temizle</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentlyViewed.length === 0 ? (
            <Text style={styles.subText}>Henüz bir ilana bakmadın.</Text>
          ) : (
            <View style={styles.recentListWrap}>
              {recentlyViewed.map((it) => {
                const img = it.image || it.photos?.[0] || null;

                return (
                  <TouchableOpacity
                    key={it.id}
                    style={styles.recentCard}
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate("LandDetail", { land: it })
                    }
                  >
                    <View style={styles.recentImageWrap}>
                      {img ? (
                        <Image
                          source={{ uri: img }}
                          style={styles.recentImage}
                        />
                      ) : (
                        <View style={styles.recentImageFallback}>
                          <Ionicons
                            name="image-outline"
                            size={22}
                            color="#9C9C9C"
                          />
                        </View>
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={1} style={styles.recentTitle}>
                        {it.title || "İlan"}
                      </Text>
                      <Text numberOfLines={1} style={styles.recentMeta}>
                        {(it.location?.city || "Konum") +
                          (it.area ? ` • ${it.area} dönüm` : "")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={{ height: 22 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 },

  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    marginBottom: 12,
  },

  bigTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f1f1f",
    marginBottom: 10,
  },
  subText: { fontSize: 13, color: "#777" },

  /* SEARCH */
  searchOuter: { borderRadius: 26, padding: 3, marginBottom: 18 },
  searchInner: {
    backgroundColor: "#E7F0E3",
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2e7d32",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  searchInput: { flex: 1, color: "#222" },

  section: { marginBottom: 24 },

  /* CATEGORIES */
  categoriesRow: { flexDirection: "row", justifyContent: "space-between" },
  categoryItem: { alignItems: "center", width: (width - 32) / 5 },
  categoryCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#E7F0E3",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryCircleActive: { backgroundColor: "#2e7d32" },
  categoryLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#2b2b2b",
  },

  /* EN SON BAKTIKLARIN */
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  clearBtn: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#E7F0E3",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  clearText: { fontSize: 12, fontWeight: "800", color: "#2e7d32" },

  recentListWrap: { gap: 12 },

  /* ✅ BİREBİR LandCard palette */
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#486f49ff", // ✅ LandCard bg
    borderRadius: 18,
    padding: 10,

    borderWidth: 3, // ✅ LandCard border kalınlığı
    borderColor: "#90a891ff", // ✅ LandCard border rengi

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  recentImageWrap: {
    width: 72,
    height: 72,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#90a891ff", // ✅ LandCard ile uyumlu
    overflow: "hidden",
    marginRight: 10,
    backgroundColor: "#F1E6D3",
  },
  recentImage: { width: "100%", height: "100%" },
  recentImageFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  recentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e4dedeff", // ✅ LandCard title
  },
  recentMeta: {
    marginTop: 4,
    fontSize: 15,
    color: "#cdc1c1ff", // ✅ LandCard sub
  },
});
