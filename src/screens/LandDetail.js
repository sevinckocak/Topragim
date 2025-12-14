import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenBackground from "../components/ScreenBackground";
import { addRecentlyViewed } from "../utils/recentlyViewed";

export default function LandDetail({ route }) {
  const { land } = route.params;

  // ✅ en son baktıkların listesine ekle
  useEffect(() => {
    if (land?.id) addRecentlyViewed(land);
  }, [land?.id]);

  const firstPhoto = useMemo(() => {
    if (Array.isArray(land?.photos) && land.photos.length > 0) {
      return land.photos[0];
    }
    return null;
  }, [land?.photos]);

  const city = land?.location?.city || "—";
  const district = land?.location?.district || "—";

  const priceText = land?.pricePerSeason
    ? `${land.pricePerSeason} ₺ / sezon`
    : "Fiyat belirtilmemiş";

  const irrigationText = land?.hasWater ? land?.irrigationType || "Var" : "Yok";

  const areaText = land?.area ? `${land.area} dönüm` : "—";
  const soilText = land?.soilType || "—";

  const cropsText =
    Array.isArray(land?.allowedCrops) && land.allowedCrops.length > 0
      ? land.allowedCrops.join(", ")
      : "—";

  return (
    <ScreenBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* ✅ Foto / Placeholder */}
          <View style={styles.imageWrap}>
            {firstPhoto ? (
              <Image source={{ uri: firstPhoto }} style={styles.image} />
            ) : (
              <View style={styles.noImage}>
                <Ionicons name="image-outline" size={38} color="#7b7b7b" />
                <Text style={styles.noImageText}>Fotoğraf yok</Text>
              </View>
            )}
          </View>

          {/* ✅ Başlık */}
          <Text style={styles.title}>{land?.title || "İlan"}</Text>

          {/* ✅ Konum */}
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#2e7d32" />
            <Text style={styles.locationText}>
              {city} / {district}
            </Text>
          </View>

          {/* ✅ Fiyat */}
          <Text style={styles.price}>{priceText}</Text>

          {/* ✅ Arazi Bilgileri */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Arazi Bilgileri</Text>

            <InfoRow label="Alan" value={areaText} />
            <InfoRow label="Toprak" value={soilText} />
            <InfoRow label="Sulama" value={irrigationText} />
          </View>

          {/* ✅ Uygun Ürünler */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Uygun Ürünler</Text>
            <Text style={styles.cardText}>{cropsText}</Text>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },

  imageWrap: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.85)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 240,
  },
  noImage: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef4ea",
    borderWidth: 1,
    borderColor: "#dfe9da",
  },
  noImageText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#7b7b7b",
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1f1f1f",
    marginTop: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  locationText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "700",
  },

  price: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1b5e20",
    marginTop: 10,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f1f1f",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "700",
    lineHeight: 18,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  infoLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "800",
  },
  infoValue: {
    fontSize: 13,
    color: "#1f1f1f",
    fontWeight: "900",
  },
});
