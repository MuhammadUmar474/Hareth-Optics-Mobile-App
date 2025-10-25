import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { ShippingRate } from "@/services/checkout-api";
import { useCheckoutStore } from "@/store/checkoutStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const Delivery = () => {
  const { t, isRtl } = useLocal();
  const router = useRouter();
  const {
    availableShippingRates,
    getShippingRates,
    selectShippingRate,
    associateCustomer,
    loading,
    error,
    clearError,
    checkout,
  } = useCheckoutStore();
  const [selectedShippingRate, setSelectedShippingRate] =
    useState<ShippingRate | null>(null);

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: isRtl ? "row-reverse" : "row", // Add dynamic header direction
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: scale(6),
          paddingTop: verticalScale(10),
          paddingBottom: verticalScale(10),
          backgroundColor: COLORS.white,
        },
        optionContent: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: scale(12),
        },
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

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

  useEffect(() => {
    const fetchShippingRates = async () => {
      if (checkout) {
        await getShippingRates();
      }
    };

    fetchShippingRates();
  }, [checkout, getShippingRates]);

  const handleSelectShippingRate = (rate: any) => {
    setSelectedShippingRate(rate);
  };

  const handleContinue = async () => {
    if (!selectedShippingRate) {
      Alert.alert("Error", "Please select a shipping option");
      return;
    }

    try {
      // Select shipping rate
      const success = await selectShippingRate(selectedShippingRate);
      if (!success) {
        Alert.alert("Error", "Failed to select shipping rate");
        return;
      }

      // Associate customer if logged in
      await associateCustomer();

      // Navigate to payment page
      router.push("/payment");
    } catch (error) {
      console.error("Shipping rate selection error:", error);
      Alert.alert("Error", "Failed to process shipping selection");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
          title={t("purchases.delivery")}
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
        {/* Delivery Options Section */}
        <View style={styles.section}>
          <Typography
            title={t("purchases.deliveryOption")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.sectionTitle, dynamicStyles.textAlign]}
          />

          <View style={styles.optionsList}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Typography
                  title="Loading shipping options..."
                  fontSize={scale(14)}
                  color={COLORS.grey29}
                  fontFamily="Roboto-Regular"
                  style={[styles.loadingText, dynamicStyles.textAlign]}
                />
              </View>
            ) : availableShippingRates.length > 0 ? (
              availableShippingRates.map((rate, index) => (
                <TouchableOpacity
                  key={rate.handle}
                  style={[
                    styles.optionCard,
                    selectedShippingRate?.handle === rate.handle &&
                      styles.optionCardSelected,
                  ]}
                  onPress={() => handleSelectShippingRate(rate)}
                >
                  <View style={dynamicStyles.optionContent}>
                    <View style={styles.optionInfo}>
                      <Typography
                        title={rate.title}
                        fontSize={scale(16)}
                        fontFamily="Poppins-Bold"
                        color={COLORS.black}
                        style={[styles.optionTitle, dynamicStyles.textAlign]}
                      />
                      <Typography
                        title={`${rate.price.amount} ${rate.price.currencyCode}`}
                        fontSize={scale(13)}
                        color={COLORS.grey29}
                        fontFamily="Roboto-Regular"
                        style={[
                          styles.optionDescription,
                          dynamicStyles.textAlign,
                        ]}
                      />
                    </View>

                    <View
                      style={[
                        styles.radioButton,
                        selectedShippingRate?.handle === rate.handle &&
                          styles.radioButtonActive,
                      ]}
                    >
                      {selectedShippingRate?.handle === rate.handle && (
                        <View style={styles.radioButtonSelected} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noOptionsContainer}>
                <Typography
                  title="No shipping options available"
                  fontSize={scale(14)}
                  color={COLORS.grey29}
                  fontFamily="Roboto-Regular"
                  style={[styles.noOptionsText, dynamicStyles.textAlign]}
                />
                <Typography
                  title="Please try again or contact support"
                  fontSize={scale(12)}
                  color={COLORS.grey29}
                  fontFamily="Roboto-Regular"
                  style={[styles.noOptionsSubtext, dynamicStyles.textAlign]}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Typography
              title={t("purchases.continuePayment")}
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
  optionsList: {
    gap: scale(16),
    paddingHorizontal: scale(16),
  },
  optionCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: COLORS.grey4,
    padding: scale(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  optionInfo: {
    flex: 1,
    gap: verticalScale(4),
  },
  optionTitle: {
    fontWeight: "600",
  },
  optionDescription: {
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    paddingVertical: verticalScale(20),
  },
  loadingText: {
    marginLeft: scale(8),
  },
  noOptionsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(20),
    gap: verticalScale(8),
  },
  noOptionsText: {
    fontWeight: "600",
  },
  noOptionsSubtext: {
    opacity: 0.7,
  },
});

export default Delivery;
