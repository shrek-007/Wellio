import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B6AAFE",
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 32,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    textShadowColor: "#3D1B77",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  avatar: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#3D1B77",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 6,
  },
  avatarPressed: {
    opacity: 0.85,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 56,
    color: "#3D1B77",
    lineHeight: 60,
  },
  avatarHint: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 14,
    color: "#3D1B77",
    textAlign: "center",
    marginBottom: 20,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 18,
    color: "#3D1B77",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Play_400Regular",
    fontSize: 18,
    color: "#3D1B77",
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 22,
    color: "#FFFFFF",
    marginTop: 12,
    marginBottom: 10,
    textShadowColor: "#3D1B77",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  column: {
    gap: 8,
  },
  pill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  pillSelected: {
    backgroundColor: "#3D1B77",
    borderColor: "#3D1B77",
  },
  pillPressed: {
    opacity: 0.85,
  },
  pillText: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 16,
    color: "#3D1B77",
  },
  pillTextSelected: {
    color: "#FFFFFF",
  },
  submit: {
    marginTop: 12,
    backgroundColor: "#3D1B77",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  submitText: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 20,
    color: "#FFFFFF",
  },
});
