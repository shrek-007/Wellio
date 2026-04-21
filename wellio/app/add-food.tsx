import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  MEAL_LABELS,
  MEAL_SLOTS,
  MealSlot,
  sumForMeal,
} from "@/constants/diary";
import { useDiary } from "@/hooks/use-diary";

const MEAL_THEME: Record<MealSlot, { accent: string; border: string; soft: string }> = {
  breakfast: { accent: "#E89A3C", border: "#B8732A", soft: "#FFF3E0" },
  lunch: { accent: "#4FA064", border: "#2F6A42", soft: "#E9F5EC" },
  dinner: { accent: "#B84A42", border: "#8A342E", soft: "#FBE9E7" },
  snack: { accent: "#8B5A3C", border: "#5F3E2A", soft: "#F3E5D8" },
};

export default function AddFoodScreen() {
  const params = useLocalSearchParams<{ date?: string; meal?: MealSlot }>();
  const date = params.date ?? "";
  const initialMeal: MealSlot = (params.meal as MealSlot) ?? "breakfast";

  const { diary, addEntry, removeEntry } = useDiary(date);
  const [meal, setMeal] = useState<MealSlot>(initialMeal);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");

  const caloriesNum = Number(calories);
  const isValid =
    name.trim().length > 0 &&
    Number.isFinite(caloriesNum) &&
    caloriesNum > 0;

  async function onAdd() {
    if (!isValid) return;
    await addEntry({
      meal,
      name: name.trim(),
      calories: caloriesNum,
      carbs: Number(carbs) || 0,
      protein: Number(protein) || 0,
      fat: Number(fat) || 0,
    });
    setName("");
    setCalories("");
    setCarbs("");
    setProtein("");
    setFat("");
  }

  const mealEntries = diary.entries.filter((e) => e.meal === meal);
  const mealTotal = sumForMeal(diary, meal);
  const theme = MEAL_THEME[meal];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.soft }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.accent }]}>
              {MEAL_LABELS[meal]}
            </Text>
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={[styles.closeBtnText, { color: theme.border }]}>×</Text>
            </Pressable>
          </View>

          <View style={styles.mealRow}>
            {MEAL_SLOTS.map((m) => {
              const mTheme = MEAL_THEME[m];
              const active = meal === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => setMeal(m)}
                  style={[
                    styles.mealPill,
                    { borderColor: mTheme.border },
                    active && { backgroundColor: mTheme.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.mealPillText,
                      { color: mTheme.border },
                      active && styles.mealPillTextActive,
                    ]}
                  >
                    {MEAL_LABELS[m]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Field label="Name" color={theme.border}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Oatmeal"
              placeholderTextColor={theme.accent}
              style={[styles.input, { borderColor: theme.border, color: theme.border }]}
            />
          </Field>

          <Field label="Calories" color={theme.border}>
            <TextInput
              value={calories}
              onChangeText={setCalories}
              placeholder="e.g. 350"
              placeholderTextColor={theme.accent}
              keyboardType="number-pad"
              style={[styles.input, { borderColor: theme.border, color: theme.border }]}
            />
          </Field>

          <View style={styles.macroRow}>
            <Field label="Carbs (g)" color={theme.border} flex>
              <TextInput
                value={carbs}
                onChangeText={setCarbs}
                placeholder="0"
                placeholderTextColor={theme.accent}
                keyboardType="decimal-pad"
                style={[styles.input, { borderColor: theme.border, color: theme.border }]}
              />
            </Field>
            <Field label="Protein (g)" color={theme.border} flex>
              <TextInput
                value={protein}
                onChangeText={setProtein}
                placeholder="0"
                placeholderTextColor={theme.accent}
                keyboardType="decimal-pad"
                style={[styles.input, { borderColor: theme.border, color: theme.border }]}
              />
            </Field>
            <Field label="Fat (g)" color={theme.border} flex>
              <TextInput
                value={fat}
                onChangeText={setFat}
                placeholder="0"
                placeholderTextColor={theme.accent}
                keyboardType="decimal-pad"
                style={[styles.input, { borderColor: theme.border, color: theme.border }]}
              />
            </Field>
          </View>

          <Pressable
            onPress={onAdd}
            disabled={!isValid}
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: theme.border },
              !isValid && styles.addBtnDisabled,
              pressed && isValid && styles.addBtnPressed,
            ]}
          >
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>

          <Text style={[styles.sectionTitle, { color: theme.accent }]}>
            {MEAL_LABELS[meal]} — {mealTotal.calories} Cal
          </Text>

          {mealEntries.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.border }]}>
              No entries yet for this meal.
            </Text>
          ) : (
            mealEntries.map((e) => (
              <View
                key={e.id}
                style={[styles.entryRow, { borderColor: theme.border }]}
              >
                <View style={styles.flex}>
                  <Text style={[styles.entryName, { color: theme.border }]}>
                    {e.name}
                  </Text>
                  <Text style={[styles.entryMeta, { color: theme.border }]}>
                    {e.calories} Cal · C {e.carbs}g · P {e.protein}g · F {e.fat}g
                  </Text>
                </View>
                <Pressable
                  onPress={() => removeEntry(e.id)}
                  style={({ pressed }) => [
                    styles.removeBtn,
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <Text style={styles.removeBtnText}>Remove</Text>
                </Pressable>
              </View>
            ))
          )}

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.doneBtn,
              { borderColor: theme.border },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.doneBtnText, { color: theme.border }]}>
              Done
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  children,
  flex,
  color,
}: {
  label: string;
  children: React.ReactNode;
  flex?: boolean;
  color?: string;
}) {
  return (
    <View style={[styles.field, flex && styles.flex]}>
      <Text style={[styles.label, color ? { color } : null]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#B6AAFE" },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 4,
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  closeBtnText: {
    fontFamily: "Play_700Bold",
    fontSize: 28,
    lineHeight: 30,
  },
  flex: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40, gap: 12 },
  title: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 28,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "#3D1B77",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginBottom: 4,
  },
  mealRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  mealPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#3D1B77",
    backgroundColor: "#FFFFFF",
  },
  mealPillActive: {
    backgroundColor: "#3D1B77",
  },
  mealPillText: {
    fontFamily: "Play_700Bold",
    color: "#3D1B77",
    fontSize: 14,
  },
  mealPillTextActive: {
    color: "#FFFFFF",
  },
  field: { marginBottom: 4 },
  label: {
    fontFamily: "Play_700Bold",
    fontSize: 14,
    color: "#3D1B77",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#3D1B77",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Play_400Regular",
    fontSize: 16,
    color: "#3D1B77",
  },
  macroRow: { flexDirection: "row", gap: 8 },
  addBtn: {
    backgroundColor: "#3D1B77",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  addBtnDisabled: { opacity: 0.5 },
  addBtnPressed: { opacity: 0.85 },
  addBtnText: {
    fontFamily: "PixelifySans_400Regular",
    color: "#FFFFFF",
    fontSize: 18,
  },
  sectionTitle: {
    fontFamily: "Play_700Bold",
    fontSize: 22,
    color: "#FFFFFF",
    marginTop: 12,
    textShadowColor: "#3D1B77",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  emptyText: {
    fontFamily: "Play_400Regular",
    color: "#3D1B77",
    fontSize: 14,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: "#3D1B77",
    gap: 10,
  },
  entryName: {
    fontFamily: "Play_700Bold",
    fontSize: 16,
    color: "#3D1B77",
  },
  entryMeta: {
    fontFamily: "Play_400Regular",
    fontSize: 12,
    color: "#3D1B77",
    marginTop: 2,
  },
  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#B84A42",
  },
  removeBtnText: {
    fontFamily: "Play_700Bold",
    color: "#B84A42",
    fontSize: 12,
  },
  doneBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#3D1B77",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  doneBtnText: {
    fontFamily: "PixelifySans_400Regular",
    color: "#3D1B77",
    fontSize: 16,
  },
});
