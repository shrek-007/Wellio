export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner", "snack"];

export const MEAL_LABELS: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export type FoodEntry = {
  id: string;
  meal: MealSlot;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
};

export type DayDiary = {
  date: string;
  entries: FoodEntry[];
  water: number;
};

export function emptyDiary(date: string): DayDiary {
  return { date, entries: [], water: 0 };
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function sumForMeal(diary: DayDiary, slot: MealSlot) {
  return diary.entries
    .filter((e) => e.meal === slot)
    .reduce(
      (a, e) => ({
        calories: a.calories + e.calories,
        carbs: a.carbs + e.carbs,
        protein: a.protein + e.protein,
        fat: a.fat + e.fat,
      }),
      { calories: 0, carbs: 0, protein: 0, fat: 0 },
    );
}

export function sumForDay(diary: DayDiary) {
  return diary.entries.reduce(
    (a, e) => ({
      calories: a.calories + e.calories,
      carbs: a.carbs + e.carbs,
      protein: a.protein + e.protein,
      fat: a.fat + e.fat,
    }),
    { calories: 0, carbs: 0, protein: 0, fat: 0 },
  );
}
