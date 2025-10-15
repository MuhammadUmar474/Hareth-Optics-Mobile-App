import { Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="track-order" />
      <Stack.Screen name="hareth-gold-membership" />
      <Stack.Screen name="view-gift-card-balance" />
      <Stack.Screen name="saved-payment-methods" />
      <Stack.Screen name="address-book" />
      <Stack.Screen name="account-info" />
      <Stack.Screen name="my-prescriptions" />
      <Stack.Screen name="submit-eye-power" />
      <Stack.Screen name="eye-test-at-home" />
      <Stack.Screen name="store-locator" />
      <Stack.Screen name="refer-and-earn" />
      <Stack.Screen name="help-center" />
      <Stack.Screen name="contact-us" />
    </Stack>
  );
}
