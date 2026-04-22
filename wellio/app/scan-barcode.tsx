import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MealSlot } from "@/constants/diary";

export default function ScanBarcodeScreen() {
  const params = useLocalSearchParams<{ date?: string; meal?: MealSlot }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const lastCode = useRef<string | null>(null);

  function handleScan({ data }: { data: string }) {
    if (scanned || !data || data === lastCode.current) return;
    lastCode.current = data;
    setScanned(true);
    router.replace({
      pathname: "/add-food",
      params: {
        date: params.date ?? "",
        meal: params.meal ?? "breakfast",
        barcode: data,
      },
    });
  }

  if (!permission) {
    return <SafeAreaView style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionBox}>
          <Text style={styles.title}>Camera access</Text>
          <Text style={styles.body}>
            Wellio needs camera access to scan food barcodes.
          </Text>
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnText}>Allow camera</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.btn,
              styles.btnSecondary,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={[styles.btnText, styles.btnTextSecondary]}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128", "code39"],
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <Text style={styles.hint}>Point the camera at a barcode</Text>
        <View style={styles.frame} />
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.cancelBtn,
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const PURPLE = "#3D1B77";
const ACCENT = "#B6AAFE";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  hint: {
    fontFamily: "Play_700Bold",
    color: "#FFF",
    fontSize: 16,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: "center",
    marginHorizontal: 24,
  },
  frame: {
    width: 260,
    height: 160,
    borderWidth: 3,
    borderColor: ACCENT,
    borderRadius: 14,
    backgroundColor: "transparent",
  },
  cancelBtn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: PURPLE,
  },
  cancelBtnText: {
    fontFamily: "PixelifySans_400Regular",
    color: PURPLE,
    fontSize: 16,
  },
  permissionBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 14,
    backgroundColor: ACCENT,
  },
  title: {
    fontFamily: "PixelifySans_400Regular",
    fontSize: 28,
    color: "#FFF",
    textShadowColor: PURPLE,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  body: {
    fontFamily: "Play_400Regular",
    color: PURPLE,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 6,
  },
  btn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: PURPLE,
    minWidth: 200,
    alignItems: "center",
  },
  btnSecondary: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: PURPLE,
  },
  btnPressed: { opacity: 0.85 },
  btnText: {
    fontFamily: "PixelifySans_400Regular",
    color: "#FFF",
    fontSize: 16,
  },
  btnTextSecondary: { color: PURPLE },
});
