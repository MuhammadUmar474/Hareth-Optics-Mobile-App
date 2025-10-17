import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useAuthStore } from "@/store/shopifyStore";
import { AuthMode, LoginFormValues } from "@/types/auth";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Toast from "react-native-toast-message";
import * as Yup from "yup";

const emailLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
});

const phoneLoginSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
});

const whatsappLoginSchema = Yup.object().shape({
  whatsapp: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Please enter a valid WhatsApp number")
    .min(10, "WhatsApp number must be at least 10 digits")
    .required("WhatsApp number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
});

const Login = () => {
  const [mode, setMode] = React.useState<AuthMode>("email");
  const { login, loading, error, clearError } = useAuthStore();

  React.useEffect(() => {
    if (error) {
      clearError();
    }
  }, [mode, error, clearError]);

  const getValidationSchema = () => {
    switch (mode) {
      case "email":
        return emailLoginSchema;
      case "phone":
        return phoneLoginSchema;
      case "whatsapp":
        return whatsappLoginSchema;
      default:
        return emailLoginSchema;
    }
  };

  const getInitialValues = (): LoginFormValues => {
    switch (mode) {
      case "email":
        return { email: "", password: "" };
      case "phone":
        return { phone: "", password: "" };
      case "whatsapp":
        return { whatsapp: "", password: "" };
      default:
        return { email: "", password: "" };
    }
  };

  const onSubmit = async (values: LoginFormValues) => {

    if (mode !== "email") {
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: "Only email login is supported with Shopify API",
        position: "top",
      });
      return;
    }

    if (!values.email) {
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: "Email is required",
        position: "top",
      });
      return;
    }

    try {
      await login({
        email: values.email,
        password: values.password,
      });

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
        position: "top",
      });
      
      router.push("/(tabs)/(a-home)");
    } catch (err) {
      console.error("❌ Login error caught in component:", err);
      const errorMessage = err instanceof Error ? err.message : "Please check your credentials and try again";
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: errorMessage,
        position: "top",
      });
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
          title="Welcome Back"
          fontSize={SIZES.h3}
          style={styles.title}
        />
        <Typography
          title="Sign in to your account to continue"
          fontSize={SIZES.body}
          style={styles.subtitle}
        />
        <View style={styles.formContainer}>
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setMode("email")}
            style={[
              styles.segment,
              { borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
              mode === "email" && styles.segmentActive,
            ]}
          >
            <Feather
              name="mail"
              size={16}
              color={mode === "email" ? COLORS.white : COLORS.grey22}
              style={{ marginRight: 8 }}
            />
            <Typography
              title="Email"
              fontSize={SIZES.body}
              color={mode === "email" ? COLORS.white : COLORS.grey22}
              style={{ fontWeight: "600" }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setMode("phone")}
            style={[styles.segment, mode === "phone" && styles.segmentActive]}
          >
            <Feather
              name="phone"
              size={16}
              color={mode === "phone" ? COLORS.white : COLORS.grey22}
              style={{ marginRight: 8 }}
            />
            <Typography
              title="Phone"
              fontSize={SIZES.body}
              color={mode === "phone" ? COLORS.white : COLORS.grey22}
              style={{ fontWeight: "600" }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setMode("whatsapp")}
            style={[
              styles.segment,
              { borderTopRightRadius: 5, borderBottomRightRadius: 5 },
              mode === "whatsapp" && styles.segmentActive,
            ]}
          >
            <FontAwesome
              name="whatsapp"
              size={16}
              color={mode === "whatsapp" ? COLORS.white : COLORS.grey22}
              style={{ marginRight: 8 }}
            />
            <Typography
              title="WhatsApp"
              fontSize={SIZES.body}
              color={mode === "whatsapp" ? COLORS.white : COLORS.grey22}
              style={{ fontWeight: "600" }}
            />
          </TouchableOpacity>
        </View>

        <Formik<LoginFormValues>
          initialValues={getInitialValues()}
          validationSchema={getValidationSchema()}
          onSubmit={onSubmit}
          enableReinitialize={true}
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
              {mode === "email" ? (
                <CustomTextInput
                  label="Email"
                  email
                  placeholder="Enter your email"
                  containerStyle={{ marginBottom: 20 }}
                  height={45}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={
                    touched.email && errors.email ? errors.email : undefined
                  }
                />
              ) : mode === "phone" ? (
                <CustomTextInput
                  label="Phone"
                  placeholder="Enter your phone number"
                  number
                  iconName="phone"
                  containerStyle={{ marginBottom: 20 }}
                  height={45}
                  value={values.phone || ""}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  error={
                    touched.phone && errors.phone ? errors.phone : undefined
                  }
                />
              ) : (
                <CustomTextInput
                  label="WhatsApp Number"
                  placeholder="Enter your WhatsApp number"
                  number
                  iconName="phone"
                  containerStyle={{ marginBottom: 20 }}
                  height={45}
                  value={values.whatsapp || ""}
                  onChangeText={handleChange("whatsapp")}
                  onBlur={handleBlur("whatsapp")}
                  error={
                    touched.whatsapp && errors.whatsapp
                      ? errors.whatsapp
                      : undefined
                  }
                />
              )}
              <CustomTextInput
                label="Password"
                placeholder="Enter your password"
                containerStyle={{ marginBottom: 20 }}
                height={45}
                isSecure
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={
                  touched.password && errors.password
                    ? errors.password
                    : undefined
                }
              />

              {error && (
                <View style={styles.errorContainer}>
                  <Typography
                    title={error}
                    fontSize={SIZES.body}
                    color={COLORS.red}
                    style={styles.errorText}
                  />
                </View>
              )}

              <Button
                color="primary"
                style={{ marginTop: 30, borderRadius: 10, height: 45 }}
                onPress={() => handleSubmit()}
                disabled={!isValid || loading}
              >
                <Typography
                  title={loading ? "Logging in..." : "Login"}
                  fontSize={SIZES.body}
                  style={{ fontWeight: "700" }}
                  color={COLORS.white}
                />
              </Button>
            </>
          )}
        </Formik>
        {/* TODO: Might be need in future */}
        {/* <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Typography
            title="Or Continue with"
            fontSize={SIZES.body}
            style={{ fontWeight: "500" }}
          />
          <View style={styles.divider} />
        </View>
        <View style={styles.socialContainer}>
          <AntDesign name="apple" size={24} color="black" />
          <AntDesign name="google" size={24} color="green" />
        </View> */}
        <Typography
          title="Don't have an account? Sign up"
          fontSize={SIZES.body}
          style={{ fontWeight: "500", alignSelf: "center", marginTop: 20 }}
          onPress={() => {
            router.replace("/(auth)/sign-up");
          }}
        />
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default Login;

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
  },
  formContainer: {
    padding: 20,
    borderRadius: SIZES.radius,
  },
  segmentContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  segment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: COLORS.white4,
    flex: 1,
  },
  segmentActive: {
    backgroundColor: COLORS.primary,
  },
  headerIcon: {
    alignSelf: "center",
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 5,
    marginTop: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray,
    width: "30%",
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 20,
  },
  logo: {
    width: scale(80),
    height: verticalScale(50),
    alignSelf: "center",
    marginTop: verticalScale(16),
  },
  errorContainer: {
    backgroundColor: COLORS.red + "10",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.red + "30",
  },
  errorText: {
    textAlign: "center",
  },
});
