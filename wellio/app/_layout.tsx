import { PixelifySans_400Regular } from "@expo-google-fonts/pixelify-sans";
import { Play_400Regular, Play_700Bold } from "@expo-google-fonts/play";
import { VT323_400Regular } from "@expo-google-fonts/vt323";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ PixelifySans_400Regular, Play_400Regular, Play_700Bold, VT323_400Regular });

  if (!fontsLoaded) return null;

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
        <Stack.Screen name="add-food" options={{ presentation: "modal", headerShown: false }} />
      </Stack>
      <StatusBar style="light" backgroundColor="#B6AAFE" />
    </>
  );
}
