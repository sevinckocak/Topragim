import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "RECENTLY_VIEWED_LANDS";
const MAX = 6;

export async function getRecentlyViewed() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function addRecentlyViewed(land) {
  try {
    if (!land?.id) return;

    const list = await getRecentlyViewed();

    // aynı ilan varsa başa al
    const filtered = list.filter((x) => x?.id !== land.id);

    const newItem = {
      id: land.id,
      title: land.title || "İlan",
      price: land.price || land.rentPrice || null,
      location: land.location || {},
      area: land.area || null,
      image: land.photos?.[0] || land.images?.[0] || null,
      // istersen createdAt vb ekleyebilirsin
      viewedAt: Date.now(),
    };

    const next = [newItem, ...filtered].slice(0, MAX);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch (e) {}
}

export async function clearRecentlyViewed() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {}
}
