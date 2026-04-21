import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    borderRadius: 10,
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
