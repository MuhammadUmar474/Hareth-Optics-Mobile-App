import { Tabs } from "expo-router";
import React from "react";

import TabBar from "@/components/ui/tab-bar";
import { COLORS } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      initialRouteName="(a-home)"
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray2,
        headerShown: false,
      }}
    >
      <Tabs.Screen name="(a-home)" options={{ title: "Home" }} />
      <Tabs.Screen name="(explore)" options={{ title: "Explore" }} />
      <Tabs.Screen name="(3d-try-on)" options={{ title: "3D Try On" }} />
      <Tabs.Screen name="(orders)" options={{ title: "Orders" }} />
      <Tabs.Screen name="(profile)" options={{ title: "Profile" }} />
    </Tabs>
  );
}
