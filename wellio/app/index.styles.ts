import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B6AAFE",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 80,
  },
  welcomeText: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 28,
    color: "#3D2C8D",
  },
  logo: {
    width: 260,
    height: 260,
  },
  appName: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 64,
    color: "#FFFFFF",
    letterSpacing: 4,
    textShadowColor: "#3D2C8D",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  button: {
    backgroundColor: "#2E1F6B",
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 30,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 20,
    color: "#FFFFFF",
  },
});
