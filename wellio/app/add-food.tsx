import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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
import { FoodItem, searchFoods } from "@/constants/foods";
import { lookupBarcode } from "@/constants/off";
import { useDiary } from "@/hooks/use-diary";

import { styles } from "./add-food.styles";

const MEAL_THEME: Record<
  MealSlot,
  { accent: string; border: string; soft: string }
> = {
  breakfast: { accent: "#E89A3C", border: "#B8732A", soft: "#FFF3E0" },
  lunch: { accent: "#4FA064", border: "#2F6A42", soft: "#E9F5EC" },
  dinner: { accent: "#B84A42", border: "#8A342E", soft: "#FBE9E7" },
  snack: { accent: "#8B5A3C", border: "#5F3E2A", soft: "#F3E5D8" },
};

export default function AddFoodScreen() {
  const params = useLocalSearchParams<{
    date?: string;
    meal?: MealSlot;
    barcode?: string;
  }>();
  const date = params.date ?? "";
  const initialMeal: MealSlot = (params.meal as MealSlot) ?? "breakfast";

  const { diary, addEntry, removeEntry } = useDiary(date);
  const [meal, setMeal] = useState<MealSlot>(initialMeal);
  const [name, setName] = useState("");
  const [grams, setGrams] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [baseFood, setBaseFood] = useState<FoodItem | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const handledBarcode = useRef<string | null>(null);

  const suggestions = useMemo(
    () => (showSuggestions ? searchFoods(name) : []),
    [name, showSuggestions]
  );

  useEffect(() => {
    const code = params.barcode;
    if (!code || handledBarcode.current === code) return;
    handledBarcode.current = code;
    setLookingUp(true);
    lookupBarcode(code)
      .then((result) => {
        if (result.ok) {
          pickFood(result.food);
        } else {
          const msg =
            result.reason === "not_found"
              ? "Barcode not found in Open Food Facts."
              : result.reason === "no_nutrition"
                ? "This product has no nutrition info. Please enter it manually."
                : "Couldn't reach Open Food Facts. Check your connection.";
          Alert.alert("Scan", msg);
        }
      })
      .finally(() => setLookingUp(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.barcode]);

  function pickFood(food: FoodItem) {
    setName(food.name);
    setGrams(String(food.grams));
    setCalories(String(food.calories));
    setCarbs(String(food.carbs));
    setProtein(String(food.protein));
    setFat(String(food.fat));
    setBaseFood(food);
    setShowSuggestions(false);
  }

  function onGramsChange(g: string) {
    setGrams(g);
    if (!baseFood) return;
    const n = Number(g);
    if (!Number.isFinite(n) || n <= 0) return;
    const ratio = n / baseFood.grams;
    setCalories(String(Math.round(baseFood.calories * ratio)));
    setCarbs(String(Math.round(baseFood.carbs * ratio * 10) / 10));
    setProtein(String(Math.round(baseFood.protein * ratio * 10) / 10));
    setFat(String(Math.round(baseFood.fat * ratio * 10) / 10));
  }

  const caloriesNum = Number(calories);
  const isValid =
    name.trim().length > 0 && Number.isFinite(caloriesNum) && caloriesNum > 0;

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
    setGrams("");
    setCalories("");
    setCarbs("");
    setProtein("");
    setFat("");
    setBaseFood(null);
    setShowSuggestions(true);
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
              <Text style={[styles.closeBtnText, { color: theme.border }]}>
                ×
              </Text>
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
            <View style={styles.nameRow}>
              <TextInput
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  setShowSuggestions(true);
                  if (baseFood && t !== baseFood.name) setBaseFood(null);
                }}
                placeholder="Add food"
                placeholderTextColor={theme.accent}
                style={[
                  styles.input,
                  styles.flex,
                  { borderColor: theme.border, color: theme.border },
                ]}
              />
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/scan-barcode" as never,
                    params: { date, meal },
                  })
                }
                disabled={lookingUp}
                style={({ pressed }) => [
                  styles.scanBtn,
                  { backgroundColor: theme.border, borderColor: theme.border },
                  lookingUp && styles.addBtnDisabled,
                  pressed && !lookingUp && styles.addBtnPressed,
                ]}
              >
                {lookingUp ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.scanBtnText}>Scan</Text>
                )}
              </Pressable>
            </View>
            {suggestions.length > 0 && (
              <View
                style={[
                  styles.suggestionBox,
                  { borderColor: theme.border, backgroundColor: theme.soft },
                ]}
              >
                {suggestions.map((s) => (
                  <Pressable
                    key={s.name}
                    onPress={() => pickFood(s)}
                    style={({ pressed }) => [
                      styles.suggestionRow,
                      { borderColor: theme.border },
                      pressed && { opacity: 0.6 },
                    ]}
                  >
                    <Text
                      style={[styles.suggestionName, { color: theme.border }]}
                    >
                      {s.name}
                    </Text>
                    <Text
                      style={[styles.suggestionMeta, { color: theme.accent }]}
                    >
                      {s.calories} Cal · C{s.carbs} P{s.protein} F{s.fat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Field>

          <Field label="Grams" color={theme.border}>
            <TextInput
              value={grams}
              onChangeText={onGramsChange}
              placeholder={baseFood ? `e.g. ${baseFood.grams}` : "e.g. 100"}
              placeholderTextColor={theme.accent}
              keyboardType="decimal-pad"
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.border },
              ]}
            />
          </Field>

          <Field label="Calories" color={theme.border}>
            <TextInput
              value={calories}
              onChangeText={setCalories}
              placeholder="e.g. 350"
              placeholderTextColor={theme.accent}
              keyboardType="number-pad"
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.border },
              ]}
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
                style={[
                  styles.input,
                  { borderColor: theme.border, color: theme.border },
                ]}
              />
            </Field>
            <Field label="Protein (g)" color={theme.border} flex>
              <TextInput
                value={protein}
                onChangeText={setProtein}
                placeholder="0"
                placeholderTextColor={theme.accent}
                keyboardType="decimal-pad"
                style={[
                  styles.input,
                  { borderColor: theme.border, color: theme.border },
                ]}
              />
            </Field>
            <Field label="Fat (g)" color={theme.border} flex>
              <TextInput
                value={fat}
                onChangeText={setFat}
                placeholder="0"
                placeholderTextColor={theme.accent}
                keyboardType="decimal-pad"
                style={[
                  styles.input,
                  { borderColor: theme.border, color: theme.border },
                ]}
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
                    {e.calories} Cal · C {e.carbs}g · P {e.protein}g · F {e.fat}
                    g
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

