import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LandCard({ item, cardWidth, cardHeight, onPress }) {
  const firstPhoto =
    Array.isArray(item.photos) && item.photos.length > 0
      ? item.photos[0]
      : null;

  const priceText =
    item.priceType === "rent"
      ? item.price
        ? `${item.price} ₺`
        : "Fiyat belirtilmemiş"
      : item.priceType === "share"
      ? item.shareRate
        ? `${item.shareRate} ürün payı`
        : "Ürün payı belirtilmemiş"
      : "Fiyat belirtilmemiş";

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
        activeOpacity={0.8}
      >
        <Ionicons name="heart-outline" size={20} color="#2e7d32" />
      </TouchableOpacity>

      {/* ✅ Foto alanı: yeşil border'lı wrapper */}
      <View style={styles.imageWrap}>
        {firstPhoto ? (
          <Image source={{ uri: firstPhoto }} style={styles.cardImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image" size={24} color="#9C9C9C" />
          </View>
        )}
      </View>

      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title || "Başlıksız Arazi"}
      </Text>

      <Text style={styles.cardSub} numberOfLines={1}>
        {item.location?.city || "Konum"} • {item.area || "-"} dönüm
      </Text>

      <Text style={styles.cardPrice} numberOfLines={1}>
        {priceText}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#486f49ff",
    borderRadius: 18,
    padding: 12,
    marginRight: 16,
    position: "relative",

    // ✅ Kart border yeşil
    borderWidth: 3,
    borderColor: "#90a891ff",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  // ✅ Favori butonu (beyaz oval üstünde)
  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 5,

    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(243, 238, 238, 0.9)",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#b4b2afff",
  },

  // ✅ Foto wrapper: yeşil border + radius + taşmayı kes
  imageWrap: {
    width: "100%",
    height: 140,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#90a891ff",
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#F1E6D3",
  },

  // Foto (wrapper içinde full)
  cardImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F1E6D3",
  },

  // Placeholder (wrapper içinde)
  imagePlaceholder: {
    flex: 1,
    backgroundColor: "#F1E6D3",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e4dedeff",
  },
  cardSub: {
    fontSize: 15,
    color: "#cdc1c1ff",
    marginTop: 4,
  },
  cardPrice: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "800",
    color: "#08210aff",
  },
});
