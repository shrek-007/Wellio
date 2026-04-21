import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3D1B77",
        tabBarInactiveTintColor: "#9A8FD8",
        tabBarStyle: {
          backgroundColor: "#E7E0FF",
          borderTopWidth: 3,
          borderTopColor: "#3D1B77",
          height: 64,
          paddingTop: 2,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontFamily: "PixelifySans_400Regular",
          fontSize: 12,
          marginTop: 0,
          letterSpacing: 1,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "MEALS",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={32}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "CALENDAR",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "calendar-month" : "calendar-month-outline"}
              size={32}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={32}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
