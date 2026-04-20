import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ACTIVITY_LABELS,
  ACTIVITY_ORDER,
  GOAL_LABELS,
  GOAL_ORDER,
  type Activity,
  type Goal,
  type Sex,
} from "@/constants/profile";
import { useProfile } from "@/hooks/use-profile";

import { styles } from "./onboarding.styles";

export default function OnboardingScreen() {
  const { profile, save } = useProfile();
  const isEdit = profile !== null;

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<Sex | null>(null);
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activity, setActivity] = useState<Activity | null>(null);
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [targetWeight, setTargetWeight] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setAge(String(profile.age));
    setSex(profile.sex);
    setHeightCm(String(profile.heightCm));
    setWeightKg(String(profile.weightKg));
    setActivity(profile.activity);
    setPhotoUri(profile.photoUri);
    setGoal(profile.goal ?? null);
    setTargetWeight(profile.targetWeightKg ? String(profile.targetWeightKg) : "");
    setBio(profile.bio ?? "");
  }, [profile]);

  const ageNum = Number(age);
  const heightNum = Number(heightCm);
  const weightNum = Number(weightKg);
  const targetWeightNum = targetWeight ? Number(targetWeight) : undefined;

  const isValid =
    name.trim().length > 0 &&
    Number.isFinite(ageNum) && ageNum > 0 && ageNum < 120 &&
    sex !== null &&
    Number.isFinite(heightNum) && heightNum > 0 && heightNum < 260 &&
    Number.isFinite(weightNum) && weightNum > 0 && weightNum < 400 &&
    activity !== null &&
    (targetWeightNum === undefined ||
      (Number.isFinite(targetWeightNum) && targetWeightNum > 0 && targetWeightNum < 400));

  async function pickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow photo access to set a profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function onSubmit() {
    if (!isValid || !sex || !activity) return;
    await save({
      name: name.trim(),
      age: ageNum,
      sex,
      heightCm: heightNum,
      weightKg: weightNum,
      activity,
      photoUri,
      goal: goal ?? undefined,
      targetWeightKg: targetWeightNum,
      bio: bio.trim() || undefined,
    });
    if (isEdit && router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{isEdit ? "Edit profile" : "Tell us about you"}</Text>

          <Pressable
            onPress={pickPhoto}
            style={({ pressed }) => [styles.avatar, pressed && styles.avatarPressed]}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarPlaceholder}>+</Text>
            )}
          </Pressable>
          <Text style={styles.avatarHint}>
            {photoUri ? "Tap to change" : "Add a profile photo"}
          </Text>

          <Field label="Name">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#9A8FD8"
              style={styles.input}
            />
          </Field>

          <Field label="Age">
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="e.g. 25"
              placeholderTextColor="#9A8FD8"
              keyboardType="number-pad"
              style={styles.input}
            />
          </Field>

          <Field label="Sex">
            <View style={styles.row}>
              <PillOption
                label="Male"
                selected={sex === "male"}
                onPress={() => setSex("male")}
              />
              <PillOption
                label="Female"
                selected={sex === "female"}
                onPress={() => setSex("female")}
              />
            </View>
          </Field>

          <Field label="Height (cm)">
            <TextInput
              value={heightCm}
              onChangeText={setHeightCm}
              placeholder="e.g. 170"
              placeholderTextColor="#9A8FD8"
              keyboardType="number-pad"
              style={styles.input}
            />
          </Field>

          <Field label="Weight (kg)">
            <TextInput
              value={weightKg}
              onChangeText={setWeightKg}
              placeholder="e.g. 65"
              placeholderTextColor="#9A8FD8"
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </Field>

          <Field label="Activity level">
            <View style={styles.column}>
              {ACTIVITY_ORDER.map((a) => (
                <PillOption
                  key={a}
                  label={ACTIVITY_LABELS[a]}
                  selected={activity === a}
                  onPress={() => setActivity(a)}
                />
              ))}
            </View>
          </Field>

          <Text style={styles.sectionTitle}>Optional</Text>

          <Field label="Goal">
            <View style={styles.row}>
              {GOAL_ORDER.map((g) => (
                <PillOption
                  key={g}
                  label={GOAL_LABELS[g]}
                  selected={goal === g}
                  onPress={() => setGoal(goal === g ? null : g)}
                />
              ))}
            </View>
          </Field>

          <Field label="Target weight (kg)">
            <TextInput
              value={targetWeight}
              onChangeText={setTargetWeight}
              placeholder="e.g. 60"
              placeholderTextColor="#9A8FD8"
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </Field>

          <Field label="Bio">
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="A short note about you"
              placeholderTextColor="#9A8FD8"
              multiline
              numberOfLines={3}
              style={[styles.input, styles.inputMultiline]}
            />
          </Field>

          <Pressable
            onPress={onSubmit}
            disabled={!isValid}
            style={({ pressed }) => [
              styles.submit,
              !isValid && styles.submitDisabled,
              pressed && isValid && styles.submitPressed,
            ]}
          >
            <Text style={styles.submitText}>{isEdit ? "Save" : "Calculate"}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function PillOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        selected && styles.pillSelected,
        pressed && styles.pillPressed,
      ]}
    >
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}
