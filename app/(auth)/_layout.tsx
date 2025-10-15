import { Stack } from "expo-router";
import React from "react";

const AuthLayout = (): React.JSX.Element => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="login"
        options={{ presentation: "formSheet", gestureEnabled: true }} // <-- This makes it a modal
      />
    </Stack>
  );
};

export default AuthLayout;
