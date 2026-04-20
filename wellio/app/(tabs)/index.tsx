import { router } from "expo-router";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { calculateDailyCalories } from "@/constants/profile";
import { useProfile } from "@/hooks/use-profile";

export default function HomeScreen() {
  const { profile, loading, clear } = useProfile();

  function onReset() {
    Alert.alert("Reset profile?", "This will clear your saved data.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await clear();
          router.replace("/onboarding");
        },
      },
    ]);
  }

  if (loading) {
    return <View style={styles.container} />;
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.hello}>No profile yet</Text>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={() => router.replace("/onboarding")}
        >
          <Text style={styles.ctaText}>Set up profile</Text>
        </Pressable>
      </View>
    );
  }

  const calories = calculateDailyCalories(profile);

  return (
    <View style={styles.container}>
      {profile.photoUri && (
        <Image source={{ uri: profile.photoUri }} style={styles.avatar} />
      )}
      <Text style={styles.hello}>Hi {profile.name}</Text>
      <Text style={styles.label}>Your daily calorie target</Text>
      <Text style={styles.calories}>{calories}</Text>
      <Text style={styles.unit}>kcal / day</Text>

      <Pressable
        style={({ pressed }) => [styles.reset, pressed && styles.resetPressed]}
        onPress={onReset}
      >
        <Text style={styles.resetText}>Reset profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B6AAFE",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#3D2C8D",
    marginBottom: 16,
  },
  hello: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 32,
    color: "#FFFFFF",
    textShadowColor: "#3D2C8D",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginBottom: 24,
  },
  label: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 18,
    color: "#3D2C8D",
    marginBottom: 8,
  },
  calories: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 72,
    color: "#FFFFFF",
    textShadowColor: "#3D2C8D",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  unit: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 20,
    color: "#3D2C8D",
    marginTop: 4,
  },
  cta: {
    marginTop: 16,
    backgroundColor: "#2E1F6B",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  ctaPressed: {
    opacity: 0.8,
  },
  ctaText: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 18,
    color: "#FFFFFF",
  },
  reset: {
    position: "absolute",
    bottom: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  resetPressed: {
    opacity: 0.6,
  },
  resetText: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 14,
    color: "#3D2C8D",
    textDecorationLine: "underline",
  },
});
