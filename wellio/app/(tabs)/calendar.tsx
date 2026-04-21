import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DayDiary, MEAL_LABELS, MEAL_SLOTS, sumForDay, sumForMeal, toDateKey } from "@/constants/diary";
import { calculateDailyCalories } from "@/constants/profile";
import { loadDiary } from "@/hooks/use-diary";
import { useProfile } from "@/hooks/use-profile";

import { styles } from "./calendar.styles";

const WEEK_HEADERS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

type CellKind = "blank" | "day";
type Cell =
  | { kind: "blank"; id: string }
  | { kind: "day"; id: string; date: Date; key: string; day: number };

function colorForDay(consumed: number, target: number, hasEntries: boolean) {
  if (!hasEntries) return { bg: "#F3EFFF", border: "#C8BFF0", text: "#9A8FD8" };
  const overage = consumed - target;
  if (overage >= 500) return { bg: "#F8D7D5", border: "#B84A42", text: "#8A342E" };
  if (overage >= 300) return { bg: "#FCE4C8", border: "#E89A3C", text: "#8A5A1C" };
  if (overage >= 200) return { bg: "#FBF2C8", border: "#D4B13D", text: "#7A6220" };
  return { bg: "#D5EBDB", border: "#4FA064", text: "#2F6A42" };
}

export default function CalendarScreen() {
  const { profile, loading } = useProfile();
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toDateKey(today), [today]);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const cells = useMemo<Cell[]>(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const firstWeekday = first.getDay() === 0 ? 6 : first.getDay() - 1;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const out: Cell[] = [];
    for (let i = 0; i < firstWeekday; i++) {
      out.push({ kind: "blank", id: `b-${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      out.push({
        kind: "day",
        id: `d-${d}`,
        date,
        key: toDateKey(date),
        day: d,
      });
    }
    while (out.length % 7 !== 0) {
      out.push({ kind: "blank", id: `b-end-${out.length}` });
    }
    return out;
  }, [viewYear, viewMonth]);

  const dayKeys = useMemo(
    () => cells.filter((c): c is Cell & { kind: "day" } => c.kind === "day").map((c) => c.key),
    [cells],
  );

  const [totals, setTotals] = useState<Record<string, { cals: number; hasEntries: boolean }>>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedDiary, setSelectedDiary] = useState<DayDiary | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(dayKeys.map((k) => loadDiary(k))).then((diaries) => {
      if (cancelled) return;
      const next: Record<string, { cals: number; hasEntries: boolean }> = {};
      diaries.forEach((d) => {
        next[d.date] = {
          cals: sumForDay(d).calories,
          hasEntries: d.entries.length > 0,
        };
      });
      setTotals(next);
    });
    return () => {
      cancelled = true;
    };
  }, [dayKeys]);

  useEffect(() => {
    if (!selectedKey) {
      setSelectedDiary(null);
      return;
    }
    let cancelled = false;
    loadDiary(selectedKey).then((d) => {
      if (!cancelled) setSelectedDiary(d);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedKey]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else setViewMonth(viewMonth - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else setViewMonth(viewMonth + 1);
  }

  if (loading) return <SafeAreaView style={styles.container} />;

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No profile yet</Text>
        </View>
      </SafeAreaView>
    );
  }

  const target = calculateDailyCalories(profile);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Calendar</Text>

        <View style={styles.monthRow}>
          <Pressable onPress={prevMonth} style={styles.monthArrow}>
            <Text style={styles.monthArrowText}>‹</Text>
          </Pressable>
          <Text style={styles.monthLabel}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Text>
          <Pressable onPress={nextMonth} style={styles.monthArrow}>
            <Text style={styles.monthArrowText}>›</Text>
          </Pressable>
        </View>

        <View style={styles.cardWrap}>
          <View style={styles.cardShadow} />
        <View style={styles.card}>
          <View style={styles.weekHeader}>
            {WEEK_HEADERS.map((w) => (
              <View key={w} style={styles.weekHeaderCell}>
                <Text style={styles.weekHeaderText}>{w}</Text>
              </View>
            ))}
          </View>
          <View style={styles.grid}>
            {cells.map((c) => {
              if (c.kind === "blank") {
                return (
                  <View key={c.id} style={styles.cell}>
                    <View style={[styles.cellInner, styles.cellEmpty]} />
                  </View>
                );
              }
              const t = totals[c.key];
              const colors = colorForDay(t?.cals ?? 0, target, t?.hasEntries ?? false);
              const isToday = c.key === todayKey;
              const isSelected = c.key === selectedKey;
              return (
                <View key={c.id} style={styles.cell}>
                  <Pressable
                    onPress={() => setSelectedKey(c.key)}
                    style={({ pressed }) => [
                      styles.cellInner,
                      {
                        backgroundColor: colors.bg,
                        borderColor:
                          isSelected || isToday ? "#3D1B77" : colors.border,
                      },
                      (isSelected || isToday) && styles.cellToday,
                      pressed && { opacity: 0.75 },
                    ]}
                  >
                    <Text style={[styles.cellDay, { color: colors.text }]}>
                      {c.day}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
        </View>

        {selectedKey && selectedDiary && (
          <View style={styles.cardWrap}>
            <View style={styles.cardShadow} />
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>
                {formatDateLabel(selectedKey)}
              </Text>
              <Pressable onPress={() => setSelectedKey(null)} hitSlop={12}>
                <Text style={styles.detailClose}>×</Text>
              </Pressable>
            </View>
            {(() => {
              const totalsDay = sumForDay(selectedDiary);
              return (
                <>
                  <View style={styles.detailTotalsRow}>
                    <DetailStat label="Calories" value={Math.round(totalsDay.calories)} suffix={`/${target}`} />
                    <DetailStat label="Carbs" value={Math.round(totalsDay.carbs)} suffix="g" />
                    <DetailStat label="Protein" value={Math.round(totalsDay.protein)} suffix="g" />
                    <DetailStat label="Fat" value={Math.round(totalsDay.fat)} suffix="g" />
                  </View>

                  <View style={styles.detailMeals}>
                    {MEAL_SLOTS.map((slot) => {
                      const m = sumForMeal(selectedDiary, slot);
                      return (
                        <View key={slot} style={styles.detailMealRow}>
                          <Text style={styles.detailMealName}>
                            {MEAL_LABELS[slot]}
                          </Text>
                          <Text style={styles.detailMealCals}>
                            {Math.round(m.calories)} cal
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  <Pressable
                    onPress={() =>
                      router.push(
                        `/add-food?date=${selectedKey}&meal=breakfast` as never,
                      )
                    }
                    style={({ pressed }) => [
                      styles.detailEditBtn,
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <Text style={styles.detailEditBtnText}>
                      {selectedDiary.entries.length === 0 ? "Add food" : "Edit meals"}
                    </Text>
                  </Pressable>
                </>
              );
            })()}
          </View>
          </View>
        )}

        <View style={styles.cardWrap}>
          <View style={styles.cardShadow} />
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Legend</Text>
          <LegendRow color="#D5EBDB" border="#4FA064" label="On target (or under)" />
          <LegendRow color="#FBF2C8" border="#D4B13D" label="+200 cal over" />
          <LegendRow color="#FCE4C8" border="#E89A3C" label="+300 cal over" />
          <LegendRow color="#F8D7D5" border="#B84A42" label="+500 cal over" />
          <LegendRow color="#F3EFFF" border="#C8BFF0" label="No entries" />
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailStat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <View style={styles.detailStat}>
      <Text style={styles.detailStatValue}>{value}</Text>
      {suffix ? <Text style={styles.detailStatSuffix}>{suffix}</Text> : null}
      <Text style={styles.detailStatLabel}>{label}</Text>
    </View>
  );
}

function formatDateLabel(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function LegendRow({ color, border, label }: { color: string; border: string; label: string }) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendSwatch, { backgroundColor: color, borderColor: border }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}
