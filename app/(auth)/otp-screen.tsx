import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { OtpFormValues } from "@/types/auth";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { StyleSheet, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { scale, verticalScale } from "react-native-size-matters";
import * as Yup from "yup";

const otpValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^[0-9]+$/, "OTP must contain only numbers")
    .required("OTP is required"),
});

const OtpScreen = () => {
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
        title="Verification"
        fontSize={SIZES.h3}
        style={styles.title}
      />
      <Typography
        title="We send a verification code to your Phone Number or Email.Enter verification code here!"
        fontSize={13}
        style={styles.subtitle}
      />
      <Typography
        title="OTP Verification"
        fontSize={18}
        style={{
          fontWeight: "bold",
          marginLeft: 15,
          marginTop: 20,
          color: COLORS.primary,
        }}
      />
      <Formik
        initialValues={{ otp: "" }}
        validationSchema={otpValidationSchema}
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
                  borderColor: touched.otp && errors.otp ? COLORS.red : COLORS.gray
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
              title="Didn't receive the code? Resend"
              fontSize={SIZES.body}
              style={{ fontWeight: "500", alignSelf: "center", marginTop: 20 }}
            />

            <Button
              color="primary"
              style={{ marginTop: 30, borderRadius: 10, height: 45 }}
              onPress={() => handleSubmit()}
              disabled={!isValid}
            >
              <Typography
                title="Continue"
                fontSize={SIZES.body}
                style={{ fontWeight: "700" }}
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
});
