import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { authApi } from "@/services/auth/authApi";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useToast } from "react-native-toast-notifications";
import * as Yup from "yup";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleResetPassword = async (values: ForgotPasswordFormValues) => {
    setLoading(true);

    try {
      await authApi.forgotPassword(values.email);
      
      Alert.alert(
        "Password Reset Email Sent",
        "We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(auth)/login");
            },
          },
        ]
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset email. Please try again.";
      toast.show(errorMessage, {
        type: "danger",
        placement: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <Image
          source={require("@/assets/images/hareth-icon.png")}
          style={styles.logo}
          contentFit="contain"
        />
        
        <Typography
          title="Forgot Password?"
          fontSize={SIZES.h3}
          style={styles.title}
        />
        
        <Typography
          title="Enter your email address and we'll send you a link to reset your password"
          fontSize={SIZES.body}
          style={styles.subtitle}
        />

        <View style={styles.formContainer}>
          <Formik<ForgotPasswordFormValues>
            initialValues={{ email: "" }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleResetPassword}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <>
                <CustomTextInput
                  label="Email"
                  email
                  placeholder="Enter your email"
                  containerStyle={{ marginBottom: 20 }}
                  height={45}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email && errors.email ? errors.email : undefined}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="done"
                />

                <Button
                  color="primary"
                  style={{ marginTop: 30, borderRadius: 10, height: 45 }}
                  onPress={() => handleSubmit()}
                  disabled={!isValid || loading}
                >
                  <Typography
                    title={loading ? "Sending..." : "Reset Password"}
                    fontSize={SIZES.body}
                    style={{ fontWeight: "700" }}
                    color={COLORS.white}
                  />
                </Button>
              </>
            )}
          </Formik>

          <Typography
            title="Remember your password? Login"
            fontSize={SIZES.body}
            style={{ fontWeight: "500", alignSelf: "center", marginTop: 20 }}
            onPress={() => {
              router.push("/(auth)/login");
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(100),
  },
  title: {
    marginBottom: 5,
    fontWeight: "bold",
    alignSelf: "center",
    color: COLORS.primary,
  },
  subtitle: {
    fontWeight: "500",
    alignSelf: "center",
    color: COLORS.black,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  formContainer: {
    padding: 20,
    borderRadius: SIZES.radius,
  },
  logo: {
    width: scale(80),
    height: verticalScale(50),
    alignSelf: "center",
    marginTop: verticalScale(16),
  },
});
