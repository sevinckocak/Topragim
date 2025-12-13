import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

export default function LandDetail({ route }) {
  const { land } = route.params;

  const firstPhoto =
    Array.isArray(land.photos) && land.photos.length > 0
      ? land.photos[0]
      : null;

  return (
    <ScrollView style={styles.container}>
      {/* Foto */}
      {firstPhoto && (
        <Image source={{ uri: firstPhoto }} style={styles.image} />
      )}

      <Text style={styles.title}>{land.title}</Text>

      <Text style={styles.location}>
        {land.location?.city} / {land.location?.district}
      </Text>

      <Text style={styles.price}>
        {land.pricePerSeason
          ? `${land.pricePerSeason} ₺ / sezon`
          : "Fiyat belirtilmemiş"}
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Arazi Bilgileri</Text>
        <Text>• Alan: {land.area} dönüm</Text>
        <Text>• Toprak: {land.soilType}</Text>
        <Text>• Sulama: {land.hasWater ? land.irrigationType : "Yok"}</Text>
      </View>

      {Array.isArray(land.allowedCrops) && land.allowedCrops.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Uygun Ürünler</Text>
          <Text>{land.allowedCrops.join(", ")}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f8f3",
  },
  image: {
    width: "100%",
    height: 240,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    margin: 16,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1b5e20",
    margin: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
});
