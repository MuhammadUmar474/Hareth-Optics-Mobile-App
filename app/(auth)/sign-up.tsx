import BackButton from "@/components/ui/back-button";
import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import { useAuthStore } from "@/store/shopifyStore";
import { AuthMode, SignupFormValues } from "@/types/auth";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useMemo, useRef } from "react";
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

const emailValidationSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    firstName: Yup.string()
      .min(2, t("auth.nameError"))
      .max(50, t("signUp.fnameLength"))
      .required(t("auth.nameReq")),
    lastName: Yup.string()
      .min(1, t("auth.lnameReq"))
      .max(50, t("auth.lnameLength"))
      .required(t("auth.lnameReq")),
    email: Yup.string()
      .email(t("auth.validEmail"))
      .required(t("auth.reqEmail")),
    password: Yup.string()
      .min(8, t("auth.pswrdLengthError"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t("auth.pswrdRegexError")
      )
      .required(t("auth.pswrdReqError")),
  });

const phoneValidationSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    firstName: Yup.string()
      .min(2, t("auth.nameError"))
      .max(50, t("signUp.fnameLength"))
      .required(t("login.nameReq")),
    lastName: Yup.string()
      .min(1, t("login.lnameReq"))
      .max(50, t("auth.lnameLength"))
      .required(t("auth.lnameReq")),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, t("auth.numberValidErr"))
      .min(10, t("auth.numberLengthError"))
      .required(t("auth.numberError")),
    password: Yup.string()
      .min(8, t("auth.pswrdLengthError"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t("auth.pswrdRegexError")
      )
      .required(t("auth.pswrdReqError")),
  });

const whatsappValidationSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    firstName: Yup.string()
      .min(2, t("auth.nameError"))
      .max(50, t("signUp.fnameLength"))
      .required(t("auth.nameReq")),
    lastName: Yup.string()
      .min(1, t("auth.lnameReq"))
      .max(50, t("auth.lnameLength"))
      .required(t("auth.lnameReq")),
    whatsapp: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, t("auth.whatsValidError"))
      .min(10, t("auth.waNumberLengthError"))
      .required(t("auth.waRequiredError")),
    password: Yup.string()
      .min(8, t("auth.pswrdLengthError"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t("auth.pswrdRegexError")
      )
      .required(t("auth.pswrdReqError")),
  });

const SignUp = () => {
  const [mode, setMode] = React.useState<AuthMode>("email");
  const { signup, loading, error, clearError } = useAuthStore();
  const toast = useToast();
  const scrollViewRef = useRef<ScrollView>(null);
  const { t, isRtl } = useLocal();

  // ---------- RTL-aware dynamic styles ----------
  const dyn = useMemo(
    () =>
      StyleSheet.create({
        textAlign: { textAlign: isRtl ? "right" : "left" },
        rowReverse: { flexDirection: isRtl ? "row-reverse" : "row" },
      }),
    [isRtl]
  );

  React.useEffect(() => {
    if (error) clearError();
  }, [mode, error, clearError]);

  // Scroll to bottom when keyboard opens
  React.useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 200);
    });
    return () => sub.remove();
  }, []);

  const getValidationSchema = () => {
    switch (mode) {
      case "email":
        return emailValidationSchema(t);
      case "phone":
        return phoneValidationSchema(t);
      case "whatsapp":
        return whatsappValidationSchema(t);
      default:
        return emailValidationSchema(t);
    }
  };

  const getInitialValues = (): SignupFormValues => {
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
      toast.show(t("signUp.supportedSignup"), { type: "danger", placement: "top" });
      return;
    }

    try {
      await signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email!,
        password: values.password,
        acceptsMarketing: true,
      });

      toast.show(t("signUp.autoLogin"), { type: "success", placement: "top" });
      router.push("/(tabs)/(a-home)");
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("common.tryagain");
      toast.show(msg, { type: "danger", placement: "top" });
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
        <BackButton />

        <Image
          source={require("@/assets/images/hareth-icon.png")}
          style={styles.logo}
          contentFit="contain"
        />

        <Typography
          title={t("signUp.createAcc")}
          fontSize={SIZES.h3}
          style={[styles.title, dyn.textAlign]}
        />
        <Typography
          title={t("signUp.createAccount")}
          fontSize={SIZES.body}
          style={[styles.subtitle, dyn.textAlign]}
        />

        <View style={styles.formContainer}>
          <Formik
            initialValues={getInitialValues()}
            validationSchema={getValidationSchema()}
            onSubmit={handleSubmit}
            enableReinitialize
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
                {/* ----- First Name ----- */}
                <CustomTextInput
                  label={t("auth.fname")}
                  placeholder={t("auth.fname")}
                  height={45}
                  value={values.firstName}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  error={touched.firstName && errors.firstName ? errors.firstName : undefined}
                  textAlign={isRtl ? "right" : "left"}
                  labelStyles={dyn.textAlign}
                />

                {/* ----- Last Name ----- */}
                <CustomTextInput
                  label={t("auth.lname")}
                  placeholder={t("auth.lname")}
                  height={45}
                  value={values.lastName}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  error={touched.lastName && errors.lastName ? errors.lastName : undefined}
                  textAlign={isRtl ? "right" : "left"}
                  labelStyles={dyn.textAlign}
                />

                {/* ----- Email / Phone / WhatsApp ----- */}
                {mode === "email" ? (
                  <CustomTextInput
                    label={t("auth.email")}
                    email
                    placeholder={t("login.emailPlaceholder")}
                    containerStyle={{ marginVertical: 20 }}
                    height={45}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email && errors.email ? errors.email : undefined}
                    textAlign={isRtl ? "right" : "left"}
                    labelStyles={dyn.textAlign}
                  />
                ) : mode === "phone" ? (
                  <CustomTextInput
                    label={t("login.phone")}
                    placeholder={t("login.phoneNumber")}
                    number
                    iconName="phone"
                    containerStyle={{ marginVertical: 20 }}
                    height={45}
                    value={values.phone}
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    error={touched.phone && errors.phone ? errors.phone : undefined}
                    textAlign={isRtl ? "right" : "left"}
                    labelStyles={dyn.textAlign}
                  />
                ) : (
                  <CustomTextInput
                    label={t("login.waNumber")}
                    placeholder={t("login.enterWaNumber")}
                    number
                    iconName="phone"
                    containerStyle={{ marginVertical: 20 }}
                    height={45}
                    value={values.whatsapp}
                    onChangeText={handleChange("whatsapp")}
                    onBlur={handleBlur("whatsapp")}
                    error={touched.whatsapp && errors.whatsapp ? errors.whatsapp : undefined}
                    textAlign={isRtl ? "right" : "left"}
                    labelStyles={dyn.textAlign}
                  />
                )}

                {/* ----- Password ----- */}
                <CustomTextInput
                  label={t("login.password")}
                  placeholder={t("login.enterPassword")}
                  containerStyle={{ marginBottom: 20 }}
                  height={45}
                  isSecure
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  error={touched.password && errors.password ? errors.password : undefined}
                  labelStyles={dyn.textAlign}
                  textAlign={isRtl ? "right" : "left"}
                />

                {/* ----- Server error ----- */}
                {error && (
                  <View style={styles.errorContainer}>
                    <Typography
                      title={t(error)}
                      fontSize={SIZES.body}
                      color={COLORS.red}
                      style={[styles.errorText, dyn.textAlign]}
                    />
                  </View>
                )}

                {/* ----- Submit ----- */}
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
                      title={t("signUp.createAcc")}
                      fontSize={SIZES.body}
                      style={[styles.buttonText, dyn.textAlign]}
                      color={COLORS.white}
                    />
                  )}
                </Button>
              </>
            )}
          </Formik>

          {/* ----- Already have account ----- */}
          <View style={[styles.alreadyRow, dyn.rowReverse, { gap: 5, marginTop: 20 }]}>
            <Typography
              title={t("signUp.alreadAcc")}
              fontSize={SIZES.body}
              style={{ fontWeight: "500" }}
            />
            <Typography
              title={t("auth.login")}
              fontSize={SIZES.body}
              style={{ fontWeight: "500", color: COLORS.primary }}
              onPress={() => router.push("/(auth)/login")}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: { flex: 1 },
  scrollContainer: { paddingTop: verticalScale(20), paddingBottom: verticalScale(10) },
  title: { marginBottom: 5, fontWeight: "bold", alignSelf: "center", color: COLORS.primary },
  subtitle: { fontWeight: "500", alignSelf: "center", color: COLORS.black },
  formContainer: { padding: 20, borderRadius: SIZES.radius },
  logo: { width: scale(80), height: verticalScale(50), alignSelf: "center" },
  errorContainer: {
    backgroundColor: `${COLORS.red}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${COLORS.red}30`,
  },
  errorText: { textAlign: "center" },
  buttonText: { fontWeight: "700" },
  alreadyRow: { alignSelf: "center", alignItems: "center" },
});