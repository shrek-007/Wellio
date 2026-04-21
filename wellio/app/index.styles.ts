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
    fontSize: 40,
    color: "#3D1B77",
  },
  logo: {
    width: 260,
    height: 260,
  },
  appName: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 80,
    color: "#FFFFFF",
    letterSpacing: 5,
    textShadowColor: "#3D1B77",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  buttonWrap: {
    position: "relative",
  },
  buttonShadow: {
    position: "absolute",
    top: 5,
    left: 5,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#3D1B77",
    paddingVertical: 12,
    paddingHorizontal: 56,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 24,
    color: "#FFFFFF",
    letterSpacing: 2,
  },
});
