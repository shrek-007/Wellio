export type Sex = "male" | "female";

export type Activity = "sedentary" | "light" | "moderate" | "active" | "veryActive";

export type Goal = "lose" | "maintain" | "gain";

export type Profile = {
  name: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  photoUri?: string;
  goal?: Goal;
  targetWeightKg?: number;
  bio?: string;
};

export const ACTIVITY_MULTIPLIERS: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export const ACTIVITY_LABELS: Record<Activity, string> = {
  sedentary: "Sedentary",
  light: "Light",
  moderate: "Moderate",
  active: "Active",
  veryActive: "Very active",
};

export const ACTIVITY_ORDER: Activity[] = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "veryActive",
];

export const GOAL_LABELS: Record<Goal, string> = {
  lose: "Lose weight",
  maintain: "Maintain",
  gain: "Gain weight",
};

export const GOAL_ORDER: Goal[] = ["lose", "maintain", "gain"];

export const SEX_LABELS: Record<Sex, string> = {
  male: "Male",
  female: "Female",
};

export function calculateDailyCalories(p: Profile): number {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age;
  const bmr = p.sex === "male" ? base + 5 : base - 161;
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[p.activity]);
}
