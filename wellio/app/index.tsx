import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useProfile } from "@/hooks/use-profile";

import { styles } from "./index.styles";

export default function StartPage() {
  const { profile, loading } = useProfile();

  function onStart() {
    if (loading) return;
    router.replace(profile ? "/(tabs)" : "/onboarding");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to</Text>

      <Image
        source={require("@/assets/images/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.appName}>WELLIO</Text>

      <View style={styles.buttonWrap}>
        <View style={styles.buttonShadow} />
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onStart}
        >
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
