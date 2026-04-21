import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ACTIVITY_LABELS,
  GOAL_LABELS,
  SEX_LABELS,
  calculateDailyCalories,
} from "@/constants/profile";
import { useProfile } from "@/hooks/use-profile";

import { styles } from "./profile.styles";

export default function ProfileScreen() {
  const { profile, loading } = useProfile();

  if (loading) {
    return <SafeAreaView style={styles.container} />;
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No profile yet</Text>
          <Pressable
            style={({ pressed }) => [styles.editButton, pressed && styles.editPressed]}
            onPress={() => router.push("/onboarding")}
          >
            <Text style={styles.editText}>Set up profile</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const calories = calculateDailyCalories(profile);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          {profile.photoUri ? (
            <Image source={{ uri: profile.photoUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.name}>{profile.name}</Text>
          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily calorie target</Text>
          <Text style={styles.calories}>{calories}</Text>
          <Text style={styles.caloriesUnit}>kcal / day</Text>
        </View>

        <View style={styles.card}>
          <Row label="Age" value={`${profile.age}`} />
          <Row label="Sex" value={SEX_LABELS[profile.sex]} />
          <Row label="Height" value={`${profile.heightCm} cm`} />
          <Row label="Weight" value={`${profile.weightKg} kg`} />
          <Row label="Activity" value={ACTIVITY_LABELS[profile.activity]} />
          {profile.goal ? <Row label="Goal" value={GOAL_LABELS[profile.goal]} /> : null}
          {profile.targetWeightKg ? (
            <Row label="Target weight" value={`${profile.targetWeightKg} kg`} />
          ) : null}
        </View>

        <Pressable
          style={({ pressed }) => [styles.editButton, pressed && styles.editPressed]}
          onPress={() => router.push("/onboarding")}
        >
          <Text style={styles.editText}>Edit profile</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

