import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LandCard({ item, cardWidth, cardHeight, onPress }) {
  const firstPhoto =
    Array.isArray(item.photos) && item.photos.length > 0
      ? item.photos[0]
      : null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          width: cardWidth,
          height: cardHeight - 40,
        },
      ]}
    >
      {/* Favori (UI only) */}
      <TouchableOpacity
        style={styles.favBtn}
        onPress={() => console.log("fav ui")}
      >
        <Ionicons name="heart-outline" size={20} color="#2e7d32" />
      </TouchableOpacity>

      {/* Foto */}
      {firstPhoto ? (
        <Image source={{ uri: firstPhoto }} style={styles.cardImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image" size={24} color="#9aa59a" />
        </View>
      )}

      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title || "Başlıksız Arazi"}
      </Text>

      <Text style={styles.cardSub}>
        {item.location?.city || "Konum"} • {item.area || "-"} dönüm
      </Text>

      <Text style={styles.cardPrice}>
        {item.priceType === "rent"
          ? item.price
            ? `${item.price} ₺`
            : "Fiyat belirtilmemiş"
          : item.priceType === "share"
          ? item.shareRate
            ? `${item.shareRate} ürün payı`
            : "Ürün payı belirtilmemiş"
          : "Fiyat belirtilmemiş"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginRight: 16,
    position: "relative",
  },
  favBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 5,
  },
  cardImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    backgroundColor: "#e9f2ea",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardSub: {
    fontSize: 12,
    color: "#666",
    marginVertical: 2,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b5e20",
  },
});
