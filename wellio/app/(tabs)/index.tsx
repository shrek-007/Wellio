import React, { useState } from "react";
import { View, Text } from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { styles } from "./styles"; // import your styles

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      PixelifySans: require("@/assets/fonts/PixelifySans.ttf"), // load the font
    });
  };

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MyApp</Text>
      <Text style={styles.subtitle}>Start your journey here</Text>
    </View>
  );
}
