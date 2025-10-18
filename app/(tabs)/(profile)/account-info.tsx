import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useAuthStore } from "@/store/shopifyStore";
import { Formik } from "formik";
import React, { useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import * as Yup from "yup";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const accountInfoSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Please enter a valid phone number")
    .min(7, "Phone number must be at least 7 digits")
    .required("Phone number is required"),
});

const AccountInfo: React.FC = () => {
  const { customerDetails, fetchCustomerDetails, updateCustomer } = useAuthStore();
  const toast = useToast();

  // Get initial values from customer details
  const getInitialValues = (): FormValues => {
    if (customerDetails) {
      return {
        firstName: customerDetails.firstName || "",
        lastName: customerDetails.lastName || "",
        email: customerDetails.email || "",
        phone: customerDetails.phone || "",
      };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    };
  };

  // Fetch customer details when component mounts
  useEffect(() => {
    if (!customerDetails) {
      fetchCustomerDetails().catch((error) => {
        console.error("Failed to fetch customer details:", error);
      });
    }
  }, [customerDetails, fetchCustomerDetails]);

  // Check if form values have changed from original customer details
  const hasChanges = (values: FormValues): boolean => {
    if (!customerDetails) return false;
    
    return (
      values.firstName !== (customerDetails.firstName || "") ||
      values.lastName !== (customerDetails.lastName || "") ||
      values.email !== (customerDetails.email || "") ||
      values.phone !== (customerDetails.phone || "")
    );
  };

  const handleSave = async (values: FormValues) => {
    try {
      if (!hasChanges(values)) {
        Alert.alert("No Changes", "No changes were made to your account details.");
        return;
      }

      await updateCustomer({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      });

      Alert.alert("Success", "Your account details have been updated successfully.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update account details";
      toast.show(errorMessage, {
        type: "danger",
        placement: "top",
      });
    }
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
          <Formik<FormValues>
            initialValues={getInitialValues()}
            validationSchema={accountInfoSchema}
            onSubmit={handleSave}
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
                <CustomTextInput
                  label="First Name"
                  placeHolder="John"
                  value={values.firstName}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  containerStyle={{ marginBottom: SIZES.padding }}
                  error={touched.firstName && errors.firstName ? errors.firstName : undefined}
                  returnKeyType="next"
                />

                <CustomTextInput
                  label="Last Name"
                  placeHolder="Doe"
                  value={values.lastName}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  containerStyle={{ marginBottom: SIZES.padding }}
                  error={touched.lastName && errors.lastName ? errors.lastName : undefined}
                  returnKeyType="next"
                />

                <CustomTextInput
                  label="Email"
                  email
                  placeHolder="john.doe@example.com"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  containerStyle={{ marginBottom: SIZES.padding }}
                  error={touched.email && errors.email ? errors.email : undefined}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />

                <CustomTextInput
                  label="Phone Number"
                  placeHolder="+1 (555) 123-4567"
                  value={values.phone}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  containerStyle={{ marginBottom: SIZES.padding * 1.5 }}
                  error={touched.phone && errors.phone ? errors.phone : undefined}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                />

                <Button
                  color="primary"
                  onPress={() => handleSubmit()}
                  disabled={!isValid}
                  style={{ marginTop: SIZES.padding, borderRadius: 10, height: 45 }}
                >
                  <Typography
                    title="Save Changes"
                    color={COLORS.white}
                    fontFamily="Inter-Bold"
                  />
                </Button>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AccountInfo;
