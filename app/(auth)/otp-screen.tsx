import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import { OtpFormValues } from "@/types/auth";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { scale, verticalScale } from "react-native-size-matters";
import * as Yup from "yup";

const otpValidationSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    otp: Yup.string()
      .length(6, t("otp.otpLengthError"))
      .matches(/^[0-9]+$/, t("otp.otpNumberError"))
      .required(t("otp.otpRequired")),
  });

const OtpScreen = () => {
  const { t, isRtl } = useLocal();

  // Dynamic RTL-aware styles
  const dynStyles = useMemo(
    () =>
      StyleSheet.create({
        textAlign: { textAlign: isRtl ? "right" : "left" },
      }),
    [isRtl]
  );

  const handleSubmit = (values: OtpFormValues) => {
    router.push("/(tabs)/(a-home)");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/hareth-icon.png")}
        style={styles.logo}
        contentFit="contain"
      />
      <Typography
        title={t("otp.title")}
        fontSize={SIZES.h3}
        style={[styles.title, dynStyles.textAlign]}
      />
      <Typography
        title={t("otp.subtitle")}
        fontSize={13}
        style={[styles.subtitle, dynStyles.textAlign]}
      />
      <Typography
        title={t("otp.otpLabel")}
        fontSize={18}
        style={{
          fontWeight: "bold",
          marginLeft: isRtl ? 0 : 15,
          marginRight: isRtl ? 15 : 0,
          marginTop: 20,
          color: COLORS.primary,
          ...dynStyles.textAlign,
        }}
      />
      <Formik
        initialValues={{ otp: "" }}
        validationSchema={() => otpValidationSchema(t)}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
          <View style={{ marginTop: 20, marginHorizontal: 15 }}>
            <OtpInput
              numberOfDigits={6}
              onTextChange={(text) => {
                handleChange("otp")(text);
              }}
              onBlur={() => handleBlur("otp")}
              theme={{
                pinCodeContainerStyle: {
                  height: 50,
                  width: 50,
                  borderRadius: 5,
                  borderColor: touched.otp && errors.otp ? COLORS.red : COLORS.gray,
                },
                filledPinCodeContainerStyle: { borderColor: COLORS.primary },
              }}
            />

            {touched.otp && errors.otp && (
              <Typography
                title={errors.otp}
                fontSize={12}
                color={COLORS.red}
                style={{ marginTop: 8, textAlign: "center" }}
              />
            )}

            <Typography
              title={t("otp.resendCode")}
              fontSize={SIZES.body}
              style={{ fontWeight: "500", alignSelf: "center", marginTop: 20, ...dynStyles.textAlign }}
            />

            <Button
              color="primary"
              style={{ marginTop: 30, borderRadius: 10, height: 45 }}
              onPress={() => handleSubmit()}
              disabled={!isValid}
            >
              <Typography
                title={t("otp.continue")}
                fontSize={SIZES.body}
                style={[styles.buttonText, dynStyles.textAlign]}
                color={COLORS.white}
              />
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  title: {
    marginBottom: 5,
    fontWeight: "bold",
    alignSelf: "center",
    color: COLORS.primary,
  },
  subtitle: {
    textAlign: "center",
    alignSelf: "center",
    color: COLORS.black,
    fontWeight: "500",
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
});