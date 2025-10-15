import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

interface FormValues {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const AccountInfo: React.FC = () => {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const canSave = useMemo(() => {
    return (
      values.name.trim().length > 1 &&
      /\S+@\S+\.\S+/.test(values.email) &&
      values.phone.replace(/\D/g, "").length >= 7
    );
  }, [values]);

  const handleChange = (key: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (values.name.trim().length < 2)
      nextErrors.name = "Please enter your full name";
    if (!/\S+@\S+\.\S+/.test(values.email))
      nextErrors.email = "Enter a valid email";
    if (values.phone.replace(/\D/g, "").length < 7)
      nextErrors.phone = "Enter a valid phone number";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    Alert.alert("Saved", "Your account details have been updated.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title="Account Info" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: SIZES.padding,
            paddingBottom: SIZES.padding * 2,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <CustomTextInput
            label="Name"
            placeHolder="Jane Doe"
            value={values.name}
            onChangeText={(text) => handleChange("name", text)}
            containerStyle={{ marginBottom: SIZES.padding }}
            error={errors.name}
            returnKeyType="next"
          />

          <CustomTextInput
            label="Email"
            email
            placeHolder="jane.doe@example.com"
            value={values.email}
            onChangeText={(text) => handleChange("email", text)}
            containerStyle={{ marginBottom: SIZES.padding }}
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />

          <CustomTextInput
            label="Phone Number"
            placeHolder="+1 (555) 123-4567"
            value={values.phone}
            onChangeText={(text) => handleChange("phone", text)}
            containerStyle={{ marginBottom: SIZES.padding * 1.5 }}
            error={errors.phone}
            keyboardType="phone-pad"
            returnKeyType="done"
          />

          <Button
            color="primary"
            onPress={handleSave}
            disabled={!canSave}
            style={{ marginTop: SIZES.padding, borderRadius: 10, height: 45 }}
          >
            <Typography
              title="Save Changes"
              color={COLORS.white}
              fontFamily="Inter-Bold"
            />
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AccountInfo;
