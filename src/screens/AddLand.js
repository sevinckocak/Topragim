import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import ScreenBackground from "../components/ScreenBackground";

const TOTAL_STEPS = 3;

const SOIL_OPTIONS = [
  "Killi-Tınlı",
  "Tınlı",
  "Kumlu",
  "Killi",
  "Siltli",
  "Kireçli",
];
const IRRIGATION_OPTIONS = ["Damla", "Yağmurlama", "Salma"];
const PRICE_TYPES = [
  { key: "rent", label: "Kira" },
  { key: "share", label: "Ürün Payı" },
];

function parseCommaList(str) {
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AddLand({ navigation }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // --- STEP 1: Basic + Location ---
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");

  // --- STEP 2: Features ---
  const [hasWater, setHasWater] = useState(true);
  const [machineryAccess, setMachineryAccess] = useState(true);
  const [lowChemicals, setLowChemicals] = useState(true);
  const [organicOnly, setOrganicOnly] = useState(false);

  const [soilType, setSoilType] = useState("Killi-Tınlı");
  const [irrigationType, setIrrigationType] = useState("Damla");

  const [waterSavingRequired, setWaterSavingRequired] = useState(true);
  const [soilAnalysisRequired, setSoilAnalysisRequired] = useState(true);

  // --- STEP 3: Media + Crops + Price ---
  const [allowedCropsText, setAllowedCropsText] = useState("Zeytin, Sebze");
  const [photosText, setPhotosText] = useState("");
  const [priceType, setPriceType] = useState("rent");
  const [price, setPrice] = useState("");
  const [shareRate, setShareRate] = useState("%40");

  const allowedCrops = useMemo(
    () => parseCommaList(allowedCropsText),
    [allowedCropsText]
  );
  const photos = useMemo(() => parseCommaList(photosText), [photosText]);

  const stepTitle = useMemo(() => {
    if (step === 1) return "Adım 1/3: Temel Bilgiler";
    if (step === 2) return "Adım 2/3: Arazi Özellikleri";
    return "Adım 3/3: Fotoğraf & Fiyat";
  }, [step]);

  // ---------- Validations ----------
  const validateStep1 = () => {
    if (!title.trim()) return "Başlık zorunlu";
    const areaNum = Number(area);
    if (!area.trim() || Number.isNaN(areaNum) || areaNum <= 0)
      return "Alan (dönüm) sayı olmalı";
    if (!ownerName.trim()) return "Arazi sahibi adı zorunlu";
    if (!city.trim() || !district.trim()) return "Şehir ve ilçe zorunlu";
    return null;
  };

  const validateStep2 = () => {
    if (!soilType) return "Toprak tipi seç";
    if (hasWater && !irrigationType) return "Sulama tipi seç";
    return null;
  };

  const validateStep3 = () => {
    if (priceType === "rent") {
      const p = Number(price);
      if (!price.trim() || Number.isNaN(p) || p <= 0)
        return "Kira bedeli sayı olmalı";
    } else {
      if (!shareRate.trim()) return "Ürün payı oranı gerekli (örn: %40)";
    }
    return null;
  };

  const onNext = () => {
    let err = null;
    if (step === 1) err = validateStep1();
    if (step === 2) err = validateStep2();
    if (step === 3) err = validateStep3();

    if (err) return Alert.alert("Eksik/Hatalı", err);
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const onBack = () => {
    if (step === 1) return navigation.goBack();
    setStep((s) => s - 1);
  };

  const onSave = async () => {
    const err = validateStep3();
    if (err) return Alert.alert("Eksik/Hatalı", err);

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        ownerName: ownerName.trim(),
        area: Number(area),

        location: {
          city: city.trim(),
          district: district.trim(),
          village: village.trim(),
        },

        hasWater,
        irrigationType: hasWater ? irrigationType : "",
        machineryAccess,
        lowChemicals,
        organicOnly,

        waterSavingRequired,
        soilAnalysisRequired,

        soilType,

        allowedCrops,
        photos,

        priceType,
        price: priceType === "rent" ? Number(price) : null,
        shareRate: priceType === "share" ? shareRate.trim() : "",

        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "lands"), payload);
      Alert.alert("Başarılı", "İlan kaydedildi.");
      navigation.navigate("Home");
    } catch (e) {
      console.log("AddLand save error:", e);
      Alert.alert("Hata", "Kaydetme başarısız. Konsolu kontrol et.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenBackground>
        <View style={styles.page}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color="#1b5e20" />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>İlan Ekle</Text>
              <Text style={styles.headerStep}>{stepTitle}</Text>
              <StepProgress current={step} total={TOTAL_STEPS} />
            </View>
          </View>

          {/* CONTENT */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          >
            {step === 1 && (
              <>
                <Text style={styles.bigTitle}>Temel Bilgiler</Text>

                <Card>
                  <Label>Başlık</Label>
                  <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder='Örn: "Muğla - 20 Dönüm Zeytinlik"'
                    placeholderTextColor="#7A7A7A"
                  />

                  <View style={{ height: 10 }} />

                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Label>Alan (dönüm)</Label>
                      <TextInput
                        style={styles.input}
                        value={area}
                        onChangeText={setArea}
                        keyboardType="numeric"
                        placeholder="20"
                        placeholderTextColor="#7A7A7A"
                      />
                    </View>
                    <View style={{ width: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Label>Arazi Sahibi</Label>
                      <TextInput
                        style={styles.input}
                        value={ownerName}
                        onChangeText={setOwnerName}
                        placeholder='Örn: "Mehmet Y."'
                        placeholderTextColor="#7A7A7A"
                      />
                    </View>
                  </View>

                  <View style={{ height: 10 }} />

                  <Label>Açıklama</Label>
                  <TextInput
                    style={[styles.input, { height: 90 }]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Kısa açıklama..."
                    placeholderTextColor="#7A7A7A"
                    multiline
                  />
                </Card>

                <Text style={styles.bigTitle}>Konum</Text>

                <Card>
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Label>Şehir</Label>
                      <TextInput
                        style={styles.input}
                        value={city}
                        onChangeText={setCity}
                        placeholder="Muğla"
                        placeholderTextColor="#7A7A7A"
                      />
                    </View>
                    <View style={{ width: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Label>İlçe</Label>
                      <TextInput
                        style={styles.input}
                        value={district}
                        onChangeText={setDistrict}
                        placeholder="Menteşe"
                        placeholderTextColor="#7A7A7A"
                      />
                    </View>
                  </View>

                  <View style={{ height: 10 }} />

                  <Label>Köy/Mahalle (opsiyonel)</Label>
                  <TextInput
                    style={styles.input}
                    value={village}
                    onChangeText={setVillage}
                    placeholder="Yeniköy"
                    placeholderTextColor="#7A7A7A"
                  />
                </Card>
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.bigTitle}>Arazi Detaylarını Gir</Text>

                <Card>
                  <Text style={styles.sectionTitle}>Altyapı Durumu</Text>

                  <View style={styles.cardsRow}>
                    <SelectCard
                      title="Suyu Var"
                      icon="water"
                      active={hasWater}
                      onPress={() => setHasWater((v) => !v)}
                    />
                    <SelectCard
                      title="Makine Girer"
                      icon="car-sport"
                      active={machineryAccess}
                      onPress={() => setMachineryAccess((v) => !v)}
                    />
                    <SelectCard
                      title="Düşük Kimyasal"
                      icon="flask"
                      active={lowChemicals}
                      onPress={() => setLowChemicals((v) => !v)}
                    />
                  </View>

                  <View style={{ height: 10 }} />

                  <View style={styles.cardsRow}>
                    <SelectCard
                      title="Organik"
                      icon="leaf"
                      active={organicOnly}
                      onPress={() => setOrganicOnly((v) => !v)}
                    />
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 1 }} />
                  </View>
                </Card>

                <Card>
                  <Text style={styles.sectionTitle}>Toprak Tipi</Text>
                  <Chips
                    options={SOIL_OPTIONS}
                    value={soilType}
                    onChange={setSoilType}
                  />
                </Card>

                {hasWater && (
                  <Card>
                    <Text style={styles.sectionTitle}>Sulama Tipi</Text>
                    <Chips
                      options={IRRIGATION_OPTIONS}
                      value={irrigationType}
                      onChange={setIrrigationType}
                    />
                  </Card>
                )}

                <Card>
                  <Text style={styles.sectionTitle}>Diğer Özellikler</Text>

                  <SwitchRow
                    label="Su tasarrufu şartı"
                    value={waterSavingRequired}
                    onChange={setWaterSavingRequired}
                  />
                  <Divider />
                  <SwitchRow
                    label="Toprak analizi zorunlu"
                    value={soilAnalysisRequired}
                    onChange={setSoilAnalysisRequired}
                  />
                </Card>
              </>
            )}

            {step === 3 && (
              <>
                <Text style={styles.bigTitle}>Fotoğraf & Fiyat</Text>

                <Card>
                  <Text style={styles.sectionTitle}>Ürünler</Text>
                  <Label>Uygun ürünler (virgülle)</Label>
                  <TextInput
                    style={styles.input}
                    value={allowedCropsText}
                    onChangeText={setAllowedCropsText}
                    placeholder="Zeytin, Sebze"
                    placeholderTextColor="#7A7A7A"
                  />
                </Card>

                <Card>
                  <Text style={styles.sectionTitle}>Fotoğraflar</Text>
                  <Label>Foto URL'leri (virgülle)</Label>
                  <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={photosText}
                    onChangeText={setPhotosText}
                    placeholder="https://...jpg, https://...png"
                    placeholderTextColor="#7A7A7A"
                    multiline
                  />
                  <Text style={styles.hint}>
                    Şimdilik URL ile. Sonra galeri + Firebase Storage yapacağız.
                  </Text>
                </Card>

                <Card>
                  <Text style={styles.sectionTitle}>Fiyat</Text>

                  <View style={styles.pillsRow}>
                    {PRICE_TYPES.map((p) => {
                      const active = p.key === priceType;
                      return (
                        <TouchableOpacity
                          key={p.key}
                          style={[styles.pill, active && styles.pillActive]}
                          onPress={() => setPriceType(p.key)}
                          activeOpacity={0.9}
                        >
                          <Text
                            style={[
                              styles.pillText,
                              active && styles.pillTextActive,
                            ]}
                          >
                            {p.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {priceType === "rent" ? (
                    <>
                      <Label>Kira bedeli (₺)</Label>
                      <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        placeholder="15000"
                        placeholderTextColor="#7A7A7A"
                      />
                    </>
                  ) : (
                    <>
                      <Label>Ürün payı oranı</Label>
                      <TextInput
                        style={styles.input}
                        value={shareRate}
                        onChangeText={setShareRate}
                        placeholder="%40"
                        placeholderTextColor="#7A7A7A"
                      />
                    </>
                  )}
                </Card>
              </>
            )}
          </ScrollView>

          {/* BOTTOM BAR */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.bottomBtn, styles.backBottom]}
              onPress={onBack}
              activeOpacity={0.9}
            >
              <Ionicons name="chevron-back" size={18} color="#2e7d32" />
              <Text style={styles.backBottomText}>
                {step === 1 ? "Çık" : "Geri"}
              </Text>
            </TouchableOpacity>

            {step < TOTAL_STEPS ? (
              <TouchableOpacity
                style={[styles.bottomBtn, styles.nextBottom]}
                onPress={onNext}
                activeOpacity={0.9}
              >
                <Text style={styles.nextBottomText}>Devam Et</Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.bottomBtn,
                  styles.nextBottom,
                  submitting && { opacity: 0.7 },
                ]}
                onPress={onSave}
                disabled={submitting}
                activeOpacity={0.9}
              >
                <Text style={styles.nextBottomText}>
                  {submitting ? "Kaydediliyor..." : "Yayınla"}
                </Text>
                <Ionicons name="checkmark" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScreenBackground>
    </KeyboardAvoidingView>
  );
}

/* ----------------- UI Components ----------------- */

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}
function Label({ children }) {
  return <Text style={styles.label}>{children}</Text>;
}
function Divider() {
  return <View style={styles.divider} />;
}

function SwitchRow({ label, value, onChange }) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function SelectCard({ title, icon, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.selectCard, active && styles.selectCardActive]}
    >
      <View
        style={[styles.selectIconWrap, active && styles.selectIconWrapActive]}
      >
        <Ionicons name={icon} size={20} color={active ? "#fff" : "#2e7d32"} />
      </View>
      <Text style={[styles.selectTitle, active && { color: "#1b5e20" }]}>
        {title}
      </Text>
      {active && (
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
}

function Chips({ options, value, onChange }) {
  return (
    <View style={styles.chipsWrap}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            activeOpacity={0.9}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function StepProgress({ current, total }) {
  return (
    <View style={styles.stepRow}>
      {Array.from({ length: total }).map((_, idx) => {
        const step = idx + 1;
        const done = step < current;
        const active = step === current;

        return (
          <View key={step} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                done && styles.stepDone,
                active && styles.stepActive,
              ]}
            >
              {done ? (
                <Ionicons name="checkmark" size={14} color="#fff" />
              ) : (
                <Text style={[styles.stepText, active && { color: "#fff" }]}>
                  {step}
                </Text>
              )}
            </View>
            {step !== total && (
              <View
                style={[
                  styles.stepLine,
                  (done || active) && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

/* ----------------- Styles ----------------- */

const styles = StyleSheet.create({
  // layout background ScreenBackground'tan geliyor
  page: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    // şeffaf bırakıyoruz ki üst yeşil vurgu gözüksün
    backgroundColor: "transparent",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF7EA",
    borderWidth: 1,
    borderColor: "#E8DDC9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "900", color: "#1b5e20" },
  headerStep: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B6B6B",
    fontWeight: "800",
  },

  stepRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  stepItem: { flexDirection: "row", alignItems: "center" },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CDBFA7",
    backgroundColor: "#FFF7EA",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDone: { backgroundColor: "#2e7d32", borderColor: "#2e7d32" },
  stepActive: { backgroundColor: "#2e7d32", borderColor: "#2e7d32" },
  stepText: { fontSize: 12, fontWeight: "900", color: "#2e7d32" },
  stepLine: {
    width: 26,
    height: 3,
    backgroundColor: "#E8DDC9",
    marginHorizontal: 6,
    borderRadius: 2,
  },
  stepLineActive: { backgroundColor: "#2e7d32" },

  bigTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1d1d1d",
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FFF7EA",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8DDC9",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1d1d1d",
    marginBottom: 10,
  },
  label: { fontSize: 12, fontWeight: "800", color: "#2a2a2a", marginBottom: 6 },

  input: {
    backgroundColor: "#FFFDF7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8DDC9",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#222",
  },

  row: { flexDirection: "row" },

  cardsRow: { flexDirection: "row", gap: 10 },

  selectCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8DDC9",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF7EA",
    position: "relative",
  },
  selectCardActive: { backgroundColor: "#E7F0E3", borderColor: "#CFE7D1" },

  selectIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E7F0E3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  selectIconWrapActive: { backgroundColor: "#2e7d32" },

  selectTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#2a2a2a",
    textAlign: "center",
  },

  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
  },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E8DDC9",
    backgroundColor: "#FFFDF7",
  },
  chipActive: { backgroundColor: "#2e7d32", borderColor: "#2e7d32" },
  chipText: { fontSize: 12, fontWeight: "900", color: "#2e7d32" },
  chipTextActive: { color: "#fff" },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2a2a2a",
    flex: 1,
    paddingRight: 10,
  },
  divider: { height: 1, backgroundColor: "rgba(0,0,0,0.06)" },

  hint: { marginTop: 8, fontSize: 11, color: "#6b776b" },

  pillsRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  pill: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8DDC9",
    backgroundColor: "#FFFDF7",
  },
  pillActive: { backgroundColor: "#E7F0E3", borderColor: "#CFE7D1" },
  pillText: { fontSize: 12, fontWeight: "900", color: "#2a2a2a" },
  pillTextActive: { color: "#1b5e20" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    paddingBottom: 14,
    backgroundColor: "#F3E9D8",
    borderTopWidth: 1,
    borderTopColor: "#E8DDC9",
    flexDirection: "row",
    gap: 10,
  },
  bottomBtn: {
    flex: 1,
    borderRadius: 14,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  backBottom: {
    backgroundColor: "#FFF7EA",
    borderWidth: 1,
    borderColor: "#E8DDC9",
  },
  backBottomText: { color: "#2e7d32", fontWeight: "900" },

  nextBottom: { backgroundColor: "#2e7d32" },
  nextBottomText: { color: "#fff", fontWeight: "900" },
});
