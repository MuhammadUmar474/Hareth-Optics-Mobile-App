import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useAuthStore } from "@/store/shopifyStore";
import { AuthMode, SignupFormValues } from "@/types/auth";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useToast } from "react-native-toast-notifications";
import * as Yup from "yup";

const emailValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
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

const phoneValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
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

const whatsappValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
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

const SignUp = () => {
  const [mode, setMode] = React.useState<AuthMode>("email");
  const { signup, loading, error, clearError } = useAuthStore();
  const toast = useToast();
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    if (error) {
      clearError();
    }
  }, [mode, error, clearError]);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    });

    return () => {
      showSubscription.remove();
    };
  }, []);

  const getValidationSchema = () => {
    switch (mode) {
      case "email":
        return emailValidationSchema;
      case "phone":
        return phoneValidationSchema;
      case "whatsapp":
        return whatsappValidationSchema;
      default:
        return emailValidationSchema;
    }
  };

  const getInitialValues = () => {
    switch (mode) {
      case "email":
        return { firstName: "", lastName: "", email: "", password: "" };
      case "phone":
        return { firstName: "", lastName: "", phone: "", password: "" };
      case "whatsapp":
        return { firstName: "", lastName: "", whatsapp: "", password: "" };
      default:
        return { firstName: "", lastName: "", email: "", password: "" };
    }
  };

  const handleSubmit = async (values: SignupFormValues) => {
    if (mode !== "email") {
      toast.show("Only email signup is supported with Shopify API", {
        type: "danger",
        placement: "top",
      });
      return;
    }

    if (!values.email) {
      toast.show("Email is required", {
        type: "danger",
        placement: "top",
      });
      return;
    }

    try {
      await signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        acceptsMarketing: true,
      });

      toast.show("Welcome! You have been automatically logged in.", {
        type: "success",
        placement: "top",
      });

      router.push("/(tabs)/(a-home)");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Please try again";
      toast.show(errorMessage, {
        type: "danger",
        placement: "top",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollViewRef}
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
          title="Create Account"
          fontSize={SIZES.h3}
          style={styles.title}
        />
        <Typography
          title="Create an account and see the difference"
          fontSize={SIZES.body}
          style={styles.subtitle}
        />

        {/* TODO: Might be need in future */}

        {/* <View style={styles.segmentContainer}>
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
        </View> */}
        <View style={styles.formContainer}>
          <Formik
            initialValues={getInitialValues()}
            validationSchema={getValidationSchema()}
            onSubmit={handleSubmit}
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
                <View style={styles.nameColumn}>
                  <CustomTextInput
                    label="First Name"
                    placeholder="First name"
                    height={45}
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    error={
                      touched.firstName && errors.firstName
                        ? errors.firstName
                        : undefined
                    }
                  />
                </View>
                <View style={styles.nameColumn}>
                  <CustomTextInput
                    label="Last Name"
                    placeholder="Last name"
                    height={45}
                    value={values.lastName}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    error={
                      touched.lastName && errors.lastName
                        ? errors.lastName
                        : undefined
                    }
                  />
                </View>

                {mode === "email" ? (
                  <CustomTextInput
                    label="Email"
                    email
                    placeholder="Enter your email"
                    containerStyle={{ marginBottom: 20, marginTop: 20 }}
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
                    containerStyle={{ marginBottom: 20, marginTop: 20 }}
                    height={45}
                    value={values.phone}
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
                    containerStyle={{ marginBottom: 20, marginTop: 20 }}
                    height={45}
                    value={values.whatsapp}
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
                  {loading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Typography
                      title="Create Account"
                      fontSize={SIZES.body}
                      style={{ fontWeight: "700" }}
                      color={COLORS.white}
                    />
                  )}
                </Button>
              </>
            )}
          </Formik>

          {/* TODO: Might need in future */}
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
          <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 20 }}>
            <Typography
              title="Already have an account? "
              fontSize={SIZES.body}
              style={{ fontWeight: "500" }}
            />
            <Typography
              title="Login"
              fontSize={SIZES.body}
              style={{ fontWeight: "500", color: COLORS.primary }}
              onPress={() => {
                router.push("/(auth)/login");
              }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

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
    paddingBottom: verticalScale(10),
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
  nameColumn: {
    flex: 1,
    marginTop: 20,
  },
  segmentContainer: {
    flexDirection: "row",
    marginVertical: 16,
    marginHorizontal: 20,
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
