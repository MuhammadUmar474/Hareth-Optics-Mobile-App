import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { orderConfirmationData } from "@/constants/data";
import { useLocal } from "@/hooks/use-lang";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const OrderConfirmation = () => {
  const {t}=useLocal()
  const router = useRouter();
  const orderData = orderConfirmationData;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Typography
          title={t("orderDetail.orderConfirmation")}
          fontSize={scale(18)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          style={styles.headerTitle}
        />
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Icon */}
        <View style={styles.successSection}>
          <View style={styles.successIconOuterCircle}>
            <View style={styles.successIconInnerCircle}>
              <FontAwesome5 name="check" size={36} color={COLORS.primary} />
            </View>
          </View>

          <Typography
            title={t("orderDetail.orderReceived")}
            fontSize={scale(24)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={styles.successTitle}
          />

          <Typography
            title="Your order has been successfully placed. You will receive an email confirmation shortly."
            fontSize={scale(14)}
            fontFamily="Roboto-Regular"
            color={COLORS.grey29}
            style={styles.successMessage}
          />
        </View>

        {/* Order Details Section */}
        <View style={styles.orderDetailsSection}>
          <View style={styles.detailsCard}>
            <Typography
              title={t("orderDetail.orderDetails")}
              fontSize={scale(18)}
              fontFamily="Poppins-Bold"
              color={COLORS.black}
              style={styles.sectionTitle}
            />

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Typography
                title={t("orderDetail.orderNumber")}
                fontSize={scale(14)}
                fontFamily="Roboto-Regular"
                color={COLORS.grey29}
              />
              <Typography
                title={orderData.orderNumber}
                fontSize={scale(14)}
                fontFamily="Roboto-Bold"
                color={COLORS.black}
                style={styles.detailValue}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Typography
                title={t("purchases.estimatedDelivery")}
                fontSize={scale(14)}
                fontFamily="Roboto-Regular"
                color={COLORS.grey29}
              />
              <Typography
                title={orderData.estimatedDelivery}
                fontSize={scale(14)}
                fontFamily="Roboto-Bold"
                color={COLORS.black}
                style={styles.detailValue}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.trackOrderButton} onPress={() => router.push("/track-order")}>
          <Typography
            title={t("common.trackOrder")}
            fontSize={scale(16)}
            color={COLORS.white}
            fontFamily="Poppins-Bold"
            style={styles.trackOrderButtonText}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueShoppingButton} onPress={() => router.push("/(tabs)/(a-home)")}>
          <Typography
            title={t("purchases.continueShopping")}
            fontSize={scale(16)}
            color={COLORS.primary}
            fontFamily="Poppins-Bold"
            style={styles.continueShoppingButtonText}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(6),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey4,
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
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(140),
    paddingHorizontal: scale(16),
  },
  successSection: {
    alignItems: "center",
    marginBottom: verticalScale(40),
  },
  successIconOuterCircle: {
    width: scale(160),
    height: scale(160),
    borderRadius: scale(90),
    backgroundColor: COLORS.skyBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(32),
  },
  successIconInnerCircle: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(45),
    backgroundColor: COLORS.skyBlue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 7,
    borderColor: COLORS.primary,
  },
  successTitle: {
    fontWeight: "600",
    marginBottom: verticalScale(12),
  },
  successMessage: {
    textAlign: "center",
    lineHeight: scale(22),
    paddingHorizontal: scale(12),
  },
  orderDetailsSection: {
    marginBottom: verticalScale(24),
    borderWidth: 1,
    borderColor: COLORS.grey4,
    borderRadius: scale(12),
    paddingVertical: scale(7),
  },
  sectionTitle: {
    fontWeight: "600",
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    padding: scale(16),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailValue: {
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grey4,
    marginVertical: verticalScale(16),
  },
  bottomSection: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    gap: scale(12),
  },
  trackOrderButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(14),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  trackOrderButtonText: {
    fontWeight: "600",
  },
  continueShoppingButton: {
    backgroundColor: COLORS.skyBlue,
    paddingVertical: verticalScale(14),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  continueShoppingButtonText: {
    fontWeight: "600",
  },
});
