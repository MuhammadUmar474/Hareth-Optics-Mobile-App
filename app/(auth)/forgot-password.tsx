import BackButton from "@/components/ui/back-button";
import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import { authApi } from "@/services/auth/authApi";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useToast } from "react-native-toast-notifications";
import * as Yup from "yup";

const forgotPasswordSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("auth.validEmail"))
      .required(t("auth.reqEmail")),
  });

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { t, isRtl } = useLocal();

  // Dynamic RTL-aware styles
  const dynStyles = useMemo(
    () =>
      StyleSheet.create({
        textAlign: { textAlign: isRtl ? "right" : "left" },
        rowReverse: { flexDirection: isRtl ? "row-reverse" : "row" },
      }),
    [isRtl]
  );

  const handleResetPassword = async (values: ForgotPasswordFormValues) => {
    setLoading(true);

    try {
      await authApi.forgotPassword(values.email);

      Alert.alert(
        t("forgot.resetEmailSentTitle"),
        t("forgot.resetEmailSentMessage"),
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
      const errorMessage = err instanceof Error ? err.message : t("forgot.resetEmailFailed");
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
        <BackButton />

        <Image
          source={require("@/assets/images/hareth-icon.png")}
          style={styles.logo}
          contentFit="contain"
        />

        <Typography
          title={t("forgot.title")}
          fontSize={SIZES.h3}
          style={[styles.title, dynStyles.textAlign]}
        />

        <Typography
          title={t("forgot.subtitle")}
          fontSize={SIZES.body}
          style={[styles.subtitle, dynStyles.textAlign]}
        />

        <View style={styles.formContainer}>
          <Formik<ForgotPasswordFormValues>
            initialValues={{ email: "" }}
            validationSchema={() => forgotPasswordSchema(t)}
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
                  label={t("auth.email")}
                  email
                  placeholder={t("forgot.emailPlaceholder")}
                  containerStyle={{ marginBottom: 20 }}
                  height={45}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email && errors.email ? errors.email : undefined}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="done"
                  textAlign={isRtl ? "right" : "left"}
                  labelStyles={dynStyles.textAlign}
                />

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
                      title={t("forgot.resetPassword")}
                      fontSize={SIZES.body}
                      style={[styles.buttonText, dynStyles.textAlign]}
                      color={COLORS.white}
                    />
                  )}
                </Button>
              </>
            )}
          </Formik>

          <View style={[styles.linkRow, dynStyles.rowReverse, { marginTop: 20,gap:5 }]}>
            <Typography
              title={t("forgot.rememberPassword")}
              fontSize={SIZES.body}
              style={{ fontWeight: "500" }}
            />
            <Typography
              title={t("forgot.backToLogin")}
              fontSize={SIZES.body}
              style={{ fontWeight: "500", color: COLORS.primary }}
              onPress={() => {
                router.replace("/(auth)/login");
              }}
            />
          </View>
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
  buttonText: {
    fontWeight: "700",
  },
  linkRow: {
    alignSelf: "center",
    alignItems: "center",
  },
});