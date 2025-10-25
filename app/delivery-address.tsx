import Typography from "@/components/ui/custom-typography";
import Input from "@/components/ui/input";
import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { homeApi, ShopifyAddress } from "@/services/home/homeApi";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useAuthStore } from "@/store/shopifyStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import * as Yup from "yup";

// Validation schema for address form
const addressValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  streetAddress: Yup.string()
    .min(5, "Street address must be at least 5 characters")
    .required("Street address is required"),
  aptSuite: Yup.string().optional(),
  city: Yup.string()
    .min(2, "City must be at least 2 characters")
    .required("City is required"),
  state: Yup.string()
    .min(2, "State must be at least 2 characters")
    .required("State is required"),
  country: Yup.string()
    .min(2, "Country must be at least 2 characters")
    .required("Country is required"),
  zipCode: Yup.string()
    .min(3, "Zip code must be at least 3 characters")
    .required("Zip code is required"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Phone number is not valid")
    .optional(),
});

const DeliveryAddress = () => {
  const { t, isRtl } = useLocal();
  const router = useRouter();
  const {
    updateShippingAddress,
    loading,
    error,
    clearError,
    checkout,
    customerAccessToken,
  } = useCheckoutStore();

  const { accessToken: authAccessToken } = useAuthStore();
  const accessToken = customerAccessToken || authAccessToken;
  const [customerAddresses, setCustomerAddresses] = useState<ShopifyAddress[]>(
    []
  );
  const [selectedAddress, setSelectedAddress] = useState<ShopifyAddress | null>(
    null
  );
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const [isCreatingAddress, setIsCreatingAddress] = useState(false);

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: scale(6),
          paddingTop: verticalScale(10),
          paddingBottom: verticalScale(10),
          backgroundColor: COLORS.white,
        },
        addressContent: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          gap: scale(12),
        },
        inputRow: {
          flexDirection: isRtl ? "row-reverse" : "row",
          gap: scale(16),
        },
        checkboxContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          gap: scale(12),
        },
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

  const loadCustomerAddresses = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    setIsLoadingAddresses(true);
    try {
      const response = await homeApi.getCustomerAddresses(accessToken);

      if (response.customer) {
        const addresses = response.customer.addresses.edges.map(
          (edge) => edge.node
        );
        setCustomerAddresses(addresses);

        if (addresses.length > 0) {
          setSelectedAddress(addresses[0]);
        }

        if (response.customer.defaultAddress) {
          setSelectedAddress(response.customer.defaultAddress);
        }
      }
    } catch (error) {
      console.error("Failed to load customer addresses:", error);
      Alert.alert("Error", "Failed to load saved addresses");
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadCustomerAddresses();
  }, [loadCustomerAddresses]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  useEffect(() => {
    if (!checkout) {
      router.back();
    }
  }, [checkout, router]);

  const createNewAddress = async (values: any, { resetForm }: any) => {
    if (!accessToken) {
      Alert.alert("Error", "Please log in to save addresses");
      return;
    }

    setIsCreatingAddress(true);
    try {
      const addressData = {
        firstName: values.firstName,
        lastName: values.lastName,
        address1: values.streetAddress,
        address2: values.aptSuite || "",
        city: values.city,
        province: values.state,
        country: values.country,
        zip: values.zipCode,
        phone: values.phone || null,
      };

      const response = await homeApi.createCustomerAddress(
        accessToken,
        addressData
      );

      if (response.customerAddressCreate.customerUserErrors.length > 0) {
        const errors = response.customerAddressCreate.customerUserErrors
          .map((error) => error.message)
          .join(", ");
        Alert.alert("Error", errors);
        return;
      }

      if (response.customerAddressCreate.customerAddress) {
        Alert.alert("Success", "Address saved successfully");

        // Refresh addresses
        await loadCustomerAddresses();

        // Reset form
        resetForm();
      }
    } catch (error) {
      console.error("Failed to create address:", error);
      Alert.alert("Error", "Failed to save address");
    } finally {
      setIsCreatingAddress(false);
    }
  };

  const handleSelectAddress = (address: ShopifyAddress) => {
    setSelectedAddress(address);
  };

  const handleContinue = async () => {
    let addressToUse: any = null;

    if (selectedAddress) {
      // Use selected saved address from Shopify
      addressToUse = {
        firstName: selectedAddress.firstName || "Customer",
        lastName: selectedAddress.lastName || "Name",
        address1: selectedAddress.address1,
        address2: selectedAddress.address2 || "",
        city: selectedAddress.city,
        province: selectedAddress.province,
        country: selectedAddress.country,
        zip: selectedAddress.zip,
        phone: selectedAddress.phone || "",
      };
    } else {
      Alert.alert("Error", "Please select a saved address or create a new one");
      return;
    }

    try {
      // Update shipping address
      const success = await updateShippingAddress(addressToUse);
      if (!success) {
        Alert.alert("Error", "Failed to update shipping address");
        return;
      }

      // Navigate directly to payment screen with checkout URL
      // The payment screen will handle opening the Shopify checkout with pre-filled data
      router.push("/payment");
    } catch (error) {
      console.error("Address update error:", error);
      Alert.alert("Error", "Failed to process address");
    }
  };

  return (
    <View style={styles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name={isRtl ? "arrow-forward" : "arrow-back"}
            size={24}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Typography
          title={t("orderDetail.orderDetails")}
          fontSize={scale(18)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          style={[styles.headerTitle, dynamicStyles.textAlign]}
        />
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Typography
            title={t("address.savedAddress")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.sectionTitle, dynamicStyles.textAlign]}
          />
          <View style={styles.addressList}>
            {isLoadingAddresses ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Typography
                  title="Loading addresses..."
                  fontSize={scale(14)}
                  color={COLORS.grey29}
                  fontFamily="Roboto-Regular"
                  style={{ marginTop: 8 }}
                />
              </View>
            ) : customerAddresses.length > 0 ? (
              customerAddresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressCard,
                    selectedAddress?.id === address.id &&
                      styles.addressCardSelected,
                  ]}
                  onPress={() => handleSelectAddress(address)}
                >
                  <View style={dynamicStyles.addressContent}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="home" size={22} color={COLORS.primary} />
                    </View>
                    <View style={styles.addressInfo}>
                      <Typography
                        title={`${address.firstName} ${address.lastName}`}
                        fontSize={scale(16)}
                        fontFamily="Poppins-Bold"
                        color={COLORS.black}
                        style={[styles.addressLabel, dynamicStyles.textAlign]}
                      />
                      <Typography
                        title={`${address.address1}${
                          address.address2 ? `, ${address.address2}` : ""
                        }`}
                        fontSize={scale(13)}
                        color={COLORS.grey29}
                        fontFamily="Roboto-Regular"
                        style={[styles.addressText, dynamicStyles.textAlign]}
                      />
                      <Typography
                        title={`${address.city}, ${address.province} ${address.zip}`}
                        fontSize={scale(13)}
                        color={COLORS.grey29}
                        fontFamily="Roboto-Regular"
                        style={[styles.addressText, dynamicStyles.textAlign]}
                      />
                      {address.phone && (
                        <Typography
                          title={address.phone}
                          fontSize={scale(13)}
                          color={COLORS.grey29}
                          fontFamily="Roboto-Regular"
                          style={[styles.addressText, dynamicStyles.textAlign]}
                        />
                      )}
                    </View>
                    <View
                      style={[
                        styles.radioButton,
                        selectedAddress?.id === address.id &&
                          styles.radioButtonActive,
                      ]}
                    >
                      {selectedAddress?.id === address.id && (
                        <View style={styles.radioButtonSelected} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyAddressContainer}>
                <Typography
                  title="No saved addresses"
                  fontSize={scale(14)}
                  color={COLORS.grey29}
                  fontFamily="Roboto-Regular"
                  style={{ textAlign: "center" }}
                />
              </View>
            )}
          </View>
        </View>
        <View style={styles.section}>
          <Typography
            title={t("address.addNewAddress")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.sectionTitle, dynamicStyles.textAlign]}
          />
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              streetAddress: "",
              aptSuite: "",
              city: "",
              state: "",
              country: "Kuwait",
              zipCode: "",
              phone: "",
            }}
            validationSchema={addressValidationSchema}
            onSubmit={createNewAddress}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={styles.formContainer}>
                <View style={dynamicStyles.inputRow}>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Input
                      placeholder="First Name"
                      value={values.firstName}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      inputContainerStyle={[
                        styles.inputField,
                        dynamicStyles.textAlign,
                        errors.firstName &&
                          touched.firstName &&
                          styles.inputError,
                      ]}
                      placeholderTextColor={COLORS.grey10}
                    />
                    {errors.firstName && touched.firstName && (
                      <Typography
                        title={errors.firstName}
                        fontSize={scale(12)}
                        color={COLORS.red}
                        fontFamily="Roboto-Regular"
                        style={[styles.errorText, dynamicStyles.textAlign]}
                      />
                    )}
                  </View>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Input
                      placeholder="Last Name"
                      value={values.lastName}
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      inputContainerStyle={[
                        styles.inputField,
                        dynamicStyles.textAlign,
                        errors.lastName &&
                          touched.lastName &&
                          styles.inputError,
                      ]}
                      placeholderTextColor={COLORS.grey10}
                    />
                    {errors.lastName && touched.lastName && (
                      <Typography
                        title={errors.lastName}
                        fontSize={scale(12)}
                        color={COLORS.red}
                        fontFamily="Roboto-Regular"
                        style={[styles.errorText, dynamicStyles.textAlign]}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Input
                    placeholder={t("address.streetAddress")}
                    value={values.streetAddress}
                    onChangeText={handleChange("streetAddress")}
                    onBlur={handleBlur("streetAddress")}
                    inputContainerStyle={[
                      styles.inputField,
                      dynamicStyles.textAlign,
                      errors.streetAddress &&
                        touched.streetAddress &&
                        styles.inputError,
                    ]}
                    placeholderTextColor={COLORS.grey10}
                  />
                  {errors.streetAddress && touched.streetAddress && (
                    <Typography
                      title={errors.streetAddress}
                      fontSize={scale(12)}
                      color={COLORS.red}
                      fontFamily="Roboto-Regular"
                      style={[styles.errorText, dynamicStyles.textAlign]}
                    />
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <Input
                    placeholder={t("address.suite")}
                    value={values.aptSuite}
                    onChangeText={handleChange("aptSuite")}
                    onBlur={handleBlur("aptSuite")}
                    inputContainerStyle={[
                      styles.inputField,
                      dynamicStyles.textAlign,
                    ]}
                    placeholderTextColor={COLORS.grey10}
                  />
                </View>
                <View style={dynamicStyles.inputRow}>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Input
                      placeholder={t("address.city")}
                      value={values.city}
                      onChangeText={handleChange("city")}
                      onBlur={handleBlur("city")}
                      inputContainerStyle={[
                        styles.inputField,
                        dynamicStyles.textAlign,
                        errors.city && touched.city && styles.inputError,
                      ]}
                      placeholderTextColor={COLORS.grey10}
                    />
                    {errors.city && touched.city && (
                      <Typography
                        title={errors.city}
                        fontSize={scale(12)}
                        color={COLORS.red}
                        fontFamily="Roboto-Regular"
                        style={[styles.errorText, dynamicStyles.textAlign]}
                      />
                    )}
                  </View>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Input
                      placeholder="State"
                      value={values.state}
                      onChangeText={handleChange("state")}
                      onBlur={handleBlur("state")}
                      inputContainerStyle={[
                        styles.inputField,
                        dynamicStyles.textAlign,
                        errors.state && touched.state && styles.inputError,
                      ]}
                      placeholderTextColor={COLORS.grey10}
                    />
                    {errors.state && touched.state && (
                      <Typography
                        title={errors.state}
                        fontSize={scale(12)}
                        color={COLORS.red}
                        fontFamily="Roboto-Regular"
                        style={[styles.errorText, dynamicStyles.textAlign]}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Input
                    placeholder="Country"
                    value={values.country}
                    onChangeText={handleChange("country")}
                    onBlur={handleBlur("country")}
                    inputContainerStyle={[
                      styles.inputField,
                      dynamicStyles.textAlign,
                      errors.country && touched.country && styles.inputError,
                    ]}
                    placeholderTextColor={COLORS.grey10}
                  />
                  {errors.country && touched.country && (
                    <Typography
                      title={errors.country}
                      fontSize={scale(12)}
                      color={COLORS.red}
                      fontFamily="Roboto-Regular"
                      style={[styles.errorText, dynamicStyles.textAlign]}
                    />
                  )}
                </View>
                <View style={dynamicStyles.inputRow}>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Input
                      placeholder={t("address.zipCode")}
                      value={values.zipCode}
                      onChangeText={handleChange("zipCode")}
                      onBlur={handleBlur("zipCode")}
                      keyboardType="numeric"
                      inputContainerStyle={[
                        styles.inputField,
                        dynamicStyles.textAlign,
                        errors.zipCode && touched.zipCode && styles.inputError,
                      ]}
                      placeholderTextColor={COLORS.grey10}
                    />
                    {errors.zipCode && touched.zipCode && (
                      <Typography
                        title={errors.zipCode}
                        fontSize={scale(12)}
                        color={COLORS.red}
                        fontFamily="Roboto-Regular"
                        style={[styles.errorText, dynamicStyles.textAlign]}
                      />
                    )}
                  </View>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Input
                      placeholder="Phone (Optional)"
                      value={values.phone}
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
                      keyboardType="phone-pad"
                      inputContainerStyle={[
                        styles.inputField,
                        dynamicStyles.textAlign,
                        errors.phone && touched.phone && styles.inputError,
                      ]}
                      placeholderTextColor={COLORS.grey10}
                    />
                    {errors.phone && touched.phone && (
                      <Typography
                        title={errors.phone}
                        fontSize={scale(12)}
                        color={COLORS.red}
                        fontFamily="Roboto-Regular"
                        style={[styles.errorText, dynamicStyles.textAlign]}
                      />
                    )}
                  </View>
                </View>
                {accessToken && (
                  <TouchableOpacity
                    style={styles.saveAddressButton}
                    onPress={() => handleSubmit()}
                    disabled={isCreatingAddress}
                  >
                    {isCreatingAddress ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <Typography
                        title="Save Address"
                        fontSize={scale(14)}
                        color={COLORS.white}
                        fontFamily="Poppins-Bold"
                        style={dynamicStyles.textAlign}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => handleContinue()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Typography
              title="Continue"
              fontSize={scale(16)}
              color={COLORS.white}
              fontFamily="Poppins-Bold"
              style={[styles.continueButtonText, dynamicStyles.textAlign]}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white6,
  },
  headerButton: {
    width: scale(40),
    height: scale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontWeight: "600",
  },
  scrollContent: {
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(120),
  },
  section: {
    marginBottom: verticalScale(32),
  },
  sectionTitle: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
    fontWeight: "600",
  },
  addressList: {
    gap: scale(16),
    paddingHorizontal: scale(16),
  },
  addressCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: COLORS.white,
    padding: scale(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressCardSelected: {
    borderColor: COLORS.primary,
  },
  iconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(10),
    backgroundColor: COLORS.skyBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  addressInfo: {
    flex: 1,
    gap: verticalScale(2),
  },
  addressLabel: {
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  addressText: {
    lineHeight: scale(18),
  },
  radioButton: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(11),
    borderWidth: 2,
    borderColor: COLORS.grey10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(2),
  },
  radioButtonActive: {
    borderWidth: 7,
    borderColor: COLORS.primary,
  },
  radioButtonSelected: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(6),
    backgroundColor: COLORS.white,
  },
  formContainer: {
    paddingHorizontal: scale(16),
    gap: verticalScale(8),
  },
  inputContainer: {
    marginBottom: 0,
  },
  inputField: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderWidth: 1,
    borderColor: COLORS.grey4,
  },
  inputHalf: {
    flex: 1,
  },
  checkbox: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(4),
    borderWidth: 1,
    borderColor: COLORS.grey29,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSection: {
    paddingTop: verticalScale(16),
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: scale(16),
    marginBottom: verticalScale(26),
  },
  continueButtonText: {
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(20),
  },
  emptyAddressContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(20),
  },
  saveAddressButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(16),
  },
  inputError: {
    borderColor: COLORS.red,
    borderWidth: 1,
  },
  errorText: {
    marginTop: verticalScale(4),
    marginLeft: scale(4),
  },
});

export default DeliveryAddress;
