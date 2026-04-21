import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MealSlot, sumForDay, sumForMeal, toDateKey } from "@/constants/diary";
import { calculateDailyCalories } from "@/constants/profile";
import { useDiary } from "@/hooks/use-diary";
import { useProfile } from "@/hooks/use-profile";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const IMG_BREAKFAST = require("../../bilds/Brackfest.png");
const IMG_LUNCH = require("../../bilds/Lunch.png");
const IMG_WATER_FULL = require("../../bilds/FullWater.png");
const IMG_WATER_EMPTY = require("../../bilds/emptyWater.png");

type MealDisplay = {
  slot: MealSlot;
  name: string;
  initial: string;
  accent: string;
  border: string;
  image?: number;
};

const MEALS: MealDisplay[] = [
  { slot: "breakfast", name: "Breakfast", initial: "B", accent: "#E89A3C", border: "#B8732A", image: IMG_BREAKFAST },
  { slot: "lunch", name: "Lunch", initial: "L", accent: "#4FA064", border: "#2F6A42", image: IMG_LUNCH },
  { slot: "dinner", name: "Dinner", initial: "D", accent: "#B84A42", border: "#8A342E" },
  { slot: "snack", name: "Snack", initial: "S", accent: "#8B5A3C", border: "#5F3E2A" },
];

const MACRO_COLORS = {
  carbs: { accent: "#E89A3C", border: "#B8732A" },
  protein: { accent: "#4FA064", border: "#2F6A42" },
  fat: { accent: "#B84A42", border: "#8A342E" },
};

const WATER_MAX = 5;

function targetCarbs(cals: number) { return Math.round((cals * 0.5) / 4); }
function targetProtein(cals: number) { return Math.round((cals * 0.2) / 4); }
function targetFat(cals: number) { return Math.round((cals * 0.3) / 9); }

export default function HomeScreen() {
  const { profile, loading } = useProfile();

  const todayIdx = useMemo(() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  }, []);
  const [selectedDay, setSelectedDay] = useState(todayIdx);

  const weekData = useMemo(() => {
    const today = new Date();
    const dow = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dow);
    return DAYS.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { label: String(d.getDate()).padStart(2, "0"), key: toDateKey(d) };
    });
  }, []);

  const selectedDateKey = weekData[selectedDay].key;
  const { diary, setWater } = useDiary(selectedDateKey);
  const waterCount = diary.water;

  if (loading) return <SafeAreaView style={styles.container} />;

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No profile yet</Text>
          <Pressable
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.8 }]}
            onPress={() => router.replace("/onboarding")}
          >
            <Text style={styles.ctaText}>Set up profile</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const target = calculateDailyCalories(profile);
  const dayTotals = sumForDay(diary);
  const consumed = dayTotals.calories;
  const pct = target > 0 ? Math.min(1, consumed / target) : 0;

  const tCarbs = targetCarbs(target);
  const tProtein = targetProtein(target);
  const tFat = targetFat(target);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Calorie Tracker</Text>

        <View style={styles.daysRow}>
          {DAYS.map((d, i) => {
            const selected = i === selectedDay;
            return (
              <Pressable
                key={d}
                onPress={() => setSelectedDay(i)}
                style={[styles.dayCell, selected && styles.dayCellSelected]}
              >
                <Text style={[styles.dayLabel, selected && styles.daySelectedText]}>
                  {d}
                </Text>
                <Text style={[styles.dayDate, selected && styles.daySelectedText]}>
                  {weekData[i].label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.cardWrap}>
          <View style={styles.cardShadow} />
        <View style={styles.card}>
          <View style={styles.calorieHeader}>
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.mascot} />
            ) : (
              <View style={[styles.mascot, styles.mascotPlaceholder]}>
                <Text style={styles.mascotInitial}>
                  {profile.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.consumedNumber}>{consumed}</Text>
            <View style={styles.consumedLabelWrap}>
              <Text style={styles.consumedLabel}>calories</Text>
              <Text style={styles.consumedLabel}>consumed</Text>
            </View>
            <View style={styles.targetWrap}>
              <View style={styles.targetShadow} />
              <View style={styles.targetBox}>
                <Text style={styles.targetText}>/{target} Cal</Text>
              </View>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
          </View>

          <View style={styles.macrosRow}>
            <MacroBox
              value={Math.round(dayTotals.carbs)}
              label={`/${tCarbs}g carbs`}
              colors={MACRO_COLORS.carbs}
            />
            <MacroBox
              value={Math.round(dayTotals.protein)}
              label={`/${tProtein}g proteins`}
              colors={MACRO_COLORS.protein}
            />
            <MacroBox
              value={Math.round(dayTotals.fat)}
              label={`/${tFat}g fats`}
              colors={MACRO_COLORS.fat}
            />
          </View>
        </View>
        </View>

        <View style={styles.cardWrap}>
          <View style={styles.cardShadow} />
        <View style={styles.mealsCard}>
          {MEALS.map((m) => {
            const mealTotal = sumForMeal(diary, m.slot);
            return (
              <Pressable
                key={m.slot}
                onPress={() =>
                  router.push(
                    `/add-food?date=${selectedDateKey}&meal=${m.slot}` as never,
                  )
                }
                style={({ pressed }) => [
                  styles.mealRow,
                  { borderColor: m.border },
                  pressed && { opacity: 0.85 },
                ]}
              >
                {m.image ? (
                  <Image source={m.image} style={styles.mealImage} resizeMode="contain" />
                ) : (
                  <View
                    style={[
                      styles.mealIcon,
                      { backgroundColor: m.accent, borderColor: m.border },
                    ]}
                  >
                    <Text style={styles.mealIconText}>{m.initial}</Text>
                  </View>
                )}
                <Text style={[styles.mealName, { color: m.border }]}>
                  {m.name}
                </Text>
                <View
                  style={[
                    styles.mealCalBox,
                    { backgroundColor: m.accent, borderColor: m.border },
                  ]}
                >
                  <Text style={styles.mealCalText}>{mealTotal.calories} Cal</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        </View>

        <View style={styles.waterCard}>
          <Text style={styles.waterLabel}>Water</Text>
          <View style={styles.waterDrops}>
            {Array.from({ length: WATER_MAX }).map((_, i) => {
              const filled = i < waterCount;
              return (
                <Pressable
                  key={i}
                  onPress={() =>
                    setWater(waterCount === i + 1 ? i : i + 1)
                  }
                  style={styles.waterPress}
                >
                  <Image
                    source={filled ? IMG_WATER_FULL : IMG_WATER_EMPTY}
                    style={styles.waterImage}
                    resizeMode="contain"
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MacroBox({
  value,
  label,
  colors,
}: {
  value: number;
  label: string;
  colors: { accent: string; border: string };
}) {
  return (
    <View style={styles.macroWrap}>
      <View style={[styles.macroShadow, { backgroundColor: colors.border }]} />
      <View style={[styles.macroBox, { borderColor: colors.border }]}>
        <Text style={[styles.macroValue, { color: colors.accent }]}>
          {value}
        </Text>
        <Text style={[styles.macroLabel, { color: colors.border }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B6AAFE",
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 32,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "#3D1B77",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginTop: 8,
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  dayCell: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    minWidth: 40,
  },
  dayCellSelected: {
    backgroundColor: "#E7E0FF",
    borderWidth: 2,
    borderColor: "#3D1B77",
  },
  dayLabel: {
    fontFamily: "Play_700Bold",
    fontSize: 13,
    color: "#3D1B77",
  },
  dayDate: {
    fontFamily: "Play_400Regular",
    fontSize: 14,
    color: "#3D1B77",
    marginTop: 2,
  },
  daySelectedText: {
    color: "#3D1B77",
  },
  cardWrap: {
    position: "relative",
    marginBottom: 16,
  },
  cardShadow: {
    position: "absolute",
    top: 4,
    left: 2,
    right: 0,
    bottom: 0,
    backgroundColor: "#3D1B77",
    borderRadius: 18,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: "#3D1B77",
    marginRight: 2,
    marginBottom: 4,
  },
  calorieHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  mascot: {
    width: 54,
    height: 54,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3D1B77",
    marginRight: 10,
  },
  mascotPlaceholder: {
    backgroundColor: "#FFD1D1",
    alignItems: "center",
    justifyContent: "center",
  },
  mascotInitial: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 28,
    color: "#B84A42",
  },
  consumedNumber: {
    fontFamily: "Play_700Bold",
    fontSize: 44,
    color: "#4FA064",
    marginRight: 8,
    textShadowColor: "#3D1B77",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  consumedLabelWrap: {
    flex: 1,
  },
  consumedLabel: {
    fontFamily: "Play_400Regular",
    fontSize: 13,
    color: "#3D1B77",
    lineHeight: 16,
  },
  targetWrap: {
    position: "relative",
  },
  targetShadow: {
    position: "absolute",
    top: 3,
    left: 3,
    right: 0,
    bottom: 0,
    backgroundColor: "#3D1B77",
    borderRadius: 8,
  },
  targetBox: {
    marginRight: 3,
    marginBottom: 3,
    borderWidth: 2,
    borderColor: "#3D1B77",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  targetText: {
    fontFamily: "Play_400Regular",
    fontSize: 14,
    color: "#3D1B77",
  },
  progressTrack: {
    height: 18,
    borderRadius: 10,
    backgroundColor: "#E7E0FF",
    borderWidth: 2,
    borderColor: "#3D1B77",
    overflow: "hidden",
    marginBottom: 14,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4FA064",
  },
  macrosRow: {
    flexDirection: "row",
    gap: 8,
  },
  macroWrap: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    position: "relative",
  },
  macroShadow: {
    position: "absolute",
    top: 3,
    left: 3,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  macroBox: {
    marginRight: 3,
    marginBottom: 3,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  macroValue: {
    fontFamily: "Play_700Bold",
    fontSize: 34,
    textAlign: "center",
    textShadowColor: "#3D1B77",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  macroLabel: {
    fontFamily: "Play_400Regular",
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },
  mealsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    borderWidth: 2,
    borderColor: "#3D1B77",
    marginRight: 2,
    marginBottom: 4,
    gap: 10,
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    padding: 8,
    gap: 12,
  },
  mealIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  mealImage: {
    width: 44,
    height: 44,
  },
  mealIconText: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 22,
    color: "#FFFFFF",
  },
  mealName: {
    fontFamily: "Play_400Regular",
    fontWeight: "700",
    fontSize: 18,
    flex: 1,
  },
  mealCalBox: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mealCalText: {
    fontFamily: "Play_400Regular",
    fontWeight: "700",
    fontSize: 15,
    color: "#FFFFFF",
  },
  waterCard: {
    backgroundColor: "#E7E0FF",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "#3D1B77",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  waterLabel: {
    fontFamily: "Play_400Regular",
    fontSize: 22,
    color: "#3D1B77",
  },
  waterDrops: {
    flexDirection: "row",
    gap: 10,
  },
  waterPress: {
    padding: 2,
  },
  waterImage: {
    width: 28,
    height: 32,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  emptyText: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 22,
    color: "#FFFFFF",
  },
  cta: {
    backgroundColor: "#3D1B77",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  ctaText: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 18,
    color: "#FFFFFF",
  },
});
