import BackButton from "@/components/ui/back-button";
import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import { useAuthStore } from "@/store/shopifyStore";
import { AuthMode, LoginFormValues } from "@/types/auth";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useToast } from "react-native-toast-notifications";
import * as Yup from "yup";

const emailLoginSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    email: Yup.string().email(t("auth.validEmail")).required(t("auth.reqEmail")),
    password: Yup.string()
      .min(8, t("auth.pswrdLengthError"))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t("auth.pswrdRegexError"))
      .required(t("auth.pswrdReqError")),
  });

const phoneLoginSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, t("auth.numberValidErr"))
      .min(10, t("auth.numberLengthError"))
      .required(t("auth.numberError")),
    password: Yup.string()
      .min(8, t("auth.pswrdLengthError"))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t("auth.pswrdRegexError"))
      .required(t("auth.pswrdReqError")),
  });

const whatsappLoginSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    whatsapp: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, t("auth.whatsValidError"))
      .min(10, t("auth.waNumberLengthError"))
      .required(t("auth.waRequiredError")),
    password: Yup.string()
      .min(8, t("auth.pswrdLengthError"))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t("auth.pswrdRegexError"))
      .required(t("auth.pswrdReqError")),
  });

const Login = () => {
  const [mode, setMode] = React.useState<AuthMode>("email");
  const { login, loading, error, clearError } = useAuthStore();
  const toast = useToast();
  const { isRtl, t } = useLocal();

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        backButton: {
          width: scale(40),
          height: scale(30),
          borderRadius: scale(10),
          alignItems: "center",
          borderColor: COLORS.grey20,
          borderWidth: 1,
          justifyContent: "center",
          left: isRtl ? scale(-10) : scale(10),
          alignSelf: isRtl ? "flex-end" : "flex-start",
        },
        segmentContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          marginBottom: 16,
        },
        segment: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 14,
          backgroundColor: COLORS.white4,
          flex: 1,
        },
        socialContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          gap: 20,
        },
        dividerContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
        },
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

  React.useEffect(() => {
    if (error) {
      clearError();
    }
  }, [mode, error, clearError]);

  const getValidationSchema = () => {
    switch (mode) {
      case "email":
        return emailLoginSchema(t);
      case "phone":
        return phoneLoginSchema(t);
      case "whatsapp":
        return whatsappLoginSchema(t);
      default:
        return emailLoginSchema(t);
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
      toast.show(t("login.shopifyEmailError"), {
        type: "danger",
        placement: "top",
      });
      return;
    }

    if (!values.email) {
      toast.show(t("auth.reqEmail"), {
        type: "danger",
        placement: "top",
      });
      return;
    }

    try {
      await login({
        email: values.email,
        password: values.password,
      });

      toast.show(t("login.welcomeBack"), {
        type: "success",
        placement: "top",
      });

      router.push("/(tabs)/(a-home)");
    } catch (err) {
      console.error("❌ Login error caught in component:", err);
      const errorMessage =
        err instanceof Error ? t("auth.genericError") : t("login.checkCred");
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
      <BackButton />

        <Image
          source={require("@/assets/images/hareth-icon.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <Typography
          title={t("login.welcomeBack")}
          fontSize={SIZES.h3}
          style={[styles.title]}
          color={COLORS.primary}
        />
        <Typography
          title={t("login.signInAccount")}
          fontSize={SIZES.body}
          style={[styles.subtitle]}
          color={COLORS.black}
        />
        <View style={styles.formContainer}>
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
                    label={t("login.email")}
                    email
                    placeholder={t("login.emailPlaceholder")}
                    containerStyle={{ marginBottom: 20 }}
                    height={45}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email && errors.email ? errors.email : undefined}
                    textAlign={isRtl ? "right" : "left"}
                    labelStyles={{ textAlign: isRtl ? "right" : "left" }}
                  />
                ) : mode === "phone" ? (
                  <CustomTextInput
                    label={t("login.phone")}
                    placeholder={t("login.phoneNumber")}
                    number
                    iconName="phone"
                    containerStyle={{ marginBottom: 20 }}
                    height={45}
                    value={values.phone || ""}
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    error={touched.phone && errors.phone ? errors.phone : undefined}
                    textAlign={isRtl ? "right" : "left"}
                    labelStyles={{ textAlign: isRtl ? "right" : "left" }}
                  />
                ) : (
                  <CustomTextInput
                    label={t("login.waNumber")}
                    placeholder={t("login.enterWaNumber")}
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
                    textAlign={isRtl ? "right" : "left"}
                    labelStyles={{ textAlign: isRtl ? "right" : "left" }}
                  />
                )}
                <CustomTextInput
                  label={t("login.password")}
                  placeholder={t("login.enterPassword")}
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
                  textAlign={isRtl ? "right" : "left"}
                  labelStyles={{ textAlign: isRtl ? "right" : "left" }}
                />
                {error && (
                  <View style={styles.errorContainer}>
                    <Typography
                      title={t(error)}
                      fontSize={SIZES.body}
                      color={COLORS.red}
                      style={[styles.errorText, dynamicStyles.textAlign]}
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
                      title={t("auth.login")}
                      fontSize={SIZES.body}
                      style={[styles.buttonText, dynamicStyles.textAlign]}
                      color={COLORS.white}
                    />
                  )}
                </Button>
              </>
            )}
          </Formik>
          <Typography
            title={t("login.dontHaveAccount")}
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
              title="Don't have an account? "
              fontSize={SIZES.body}
              style={{ fontWeight: "500" }}
            />
            <Typography
              title="Sign up"
              fontSize={SIZES.body}
              style={{ fontWeight: "500", color: COLORS.primary }}
              onPress={() => {
                router.replace("/(auth)/sign-up");
              }}
            />
          </View>

          <Typography
            title={t("login.forgotPswrd")}
            fontSize={SIZES.body}
            style={[styles.footerText, dynamicStyles.textAlign]}
            color={COLORS.primary}
            onPress={() => {
              router.push("/(auth)/forgot-password");
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
  headerButton: {
    width: scale(40),
    height: scale(40),
  },
  title: {
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontWeight: "500",
    textAlign: "center",
  },
  formContainer: {
    padding: 20,
    borderRadius: SIZES.radius,
  },
  segmentActive: {
    backgroundColor: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray,
    width: "30%",
  },
  logo: {
    width: scale(80),
    height: verticalScale(50),
    alignSelf: "center",
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
    fontWeight: "500",
  },
  buttonText: {
    fontWeight: "700",
  },
  footerText: {
    fontWeight: "500",
    alignSelf: "center",
    marginTop: 10,
  },
});

export default Login;