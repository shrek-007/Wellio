import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B6AAFE",
  },
  scroll: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#3D1B77",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 56,
    color: "#3D1B77",
  },
  name: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 32,
    color: "#FFFFFF",
    textShadowColor: "#3D1B77",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  bio: {
    fontFamily: "Play_400Regular",
    fontSize: 15,
    color: "#3D1B77",
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 18,
    color: "#3D1B77",
    textAlign: "center",
    marginBottom: 8,
  },
  calories: {
    fontFamily: "Play_400Regular",
    fontSize: 56,
    color: "#3D1B77",
    textAlign: "center",
  },
  caloriesUnit: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 16,
    color: "#3D1B77",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE9FF",
  },
  rowLabel: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 16,
    color: "#3D1B77",
  },
  rowValue: {
    fontFamily: "Play_400Regular",
    fontSize: 16,
    color: "#3D1B77",
  },
  editButton: {
    backgroundColor: "#3D1B77",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  editPressed: {
    opacity: 0.85,
  },
  editText: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 18,
    color: "#FFFFFF",
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
});
