import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { OrderItem, orderSummaryData } from "@/constants/data";
import { useLocal } from "@/hooks/use-lang";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const OrderSummary = () => {
  const { t, isRtl } = useLocal();
  const router = useRouter();
  const orderData = orderSummaryData;

  // Dynamic styles for RTL support
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
          borderBottomWidth: 1,
          borderBottomColor: COLORS.grey4,
        },
        itemCard: {
          flexDirection: isRtl ? "row-reverse" : "row",
          backgroundColor: COLORS.white,
          borderRadius: scale(12),
          padding: scale(12),
          alignItems: "center",
          gap: scale(12),
        },
        discountCard: {
          flexDirection: isRtl ? "row-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: COLORS.white,
          borderRadius: scale(12),
          padding: scale(16),
          marginHorizontal: scale(16),
        },
        addressCard: {
          flexDirection: isRtl ? "row-reverse" : "row",
          backgroundColor: COLORS.white,
          borderRadius: scale(12),
          padding: scale(16),
          marginHorizontal: scale(16),
          gap: scale(12),
        },
        deliveryCard: {
          flexDirection: isRtl ? "row-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: COLORS.white,
          borderRadius: scale(12),
          padding: scale(16),
          marginHorizontal: scale(16),
        },
        paymentCard: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          backgroundColor: COLORS.white,
          borderRadius: scale(12),
          padding: scale(16),
          marginHorizontal: scale(16),
          gap: scale(12),
        },
        costRow: {
          flexDirection: isRtl ? "row-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        totalRow: {
          flexDirection: isRtl ? "row-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: verticalScale(4),
        },
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

  const subtotal = orderData.items.reduce((sum, item) => sum + item.price, 0);
  const total =
    subtotal - orderData.discount.amount + orderData.deliveryMethod.price;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name={isRtl? "arrow-forward":"arrow-back"} size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Typography
          title={t("orderDetail.orderSummary")}
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
        {/* Items Section */}
        <View style={styles.section}>
          <Typography
            title={t("orderDetail.items")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.sectionTitle, dynamicStyles.textAlign]}
          />

          <View style={styles.itemsList}>
            {orderData.items.map((item: OrderItem) => (
              <View key={item.id} style={dynamicStyles.itemCard}>
                <View style={styles.itemImageContainer}>
                  <Image source={item.image} style={styles.itemImage} />
                </View>
                <View style={styles.itemInfo}>
                  <Typography
                    title={item.name}
                    fontSize={scale(15)}
                    fontFamily="Poppins-Bold"
                    color={COLORS.black}
                    style={[styles.itemName, dynamicStyles.textAlign]}
                  />
                  <Typography
                    title={item.description}
                    fontSize={scale(13)}
                    color={COLORS.grey29}
                    fontFamily="Roboto-Regular"
                    style={[styles.itemDescription, dynamicStyles.textAlign]}
                  />
                </View>
                <Typography
                  title={`$${item.price}`}
                  fontSize={scale(16)}
                  fontFamily="Roboto-Bold"
                  color={COLORS.black}
                  style={[styles.itemPrice, dynamicStyles.textAlign]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Discounts Section */}
        <View style={styles.section}>
          <Typography
            title={t("purchases.discounts")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.sectionTitle, dynamicStyles.textAlign]}
          />

          <View style={dynamicStyles.discountCard}>
            <Typography
              title={orderData.discount.name}
              fontSize={scale(14)}
              fontFamily="Roboto-Regular"
              color={COLORS.black}
              style={dynamicStyles.textAlign}
            />
            <Typography
              title={`-$${orderData.discount.amount}`}
              fontSize={scale(14)}
              fontFamily="Roboto-Bold"
              color={COLORS.green2}
              style={[styles.discountAmount, dynamicStyles.textAlign]}
            />
          </View>
        </View>

        {/* Delivery Address Section */}
        <View style={styles.section}>
          <Typography
            title={t("address.deliveryAddress")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.sectionTitle, dynamicStyles.textAlign]}
          />

          <View style={dynamicStyles.addressCard}>
            <View style={styles.addressIconContainer}>
              <Ionicons name="location" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.addressInfo}>
              <Typography
                title={orderData.deliveryAddress.label}
                fontSize={scale(15)}
                fontFamily="Poppins-Bold"
                color={COLORS.black}
                style={[styles.addressLabel, dynamicStyles.textAlign]}
              />
              <Typography
                title={orderData.deliveryAddress.address}
                fontSize={scale(13)}
                color={COLORS.grey29}
                fontFamily="Roboto-Regular"
                style={[styles.addressText, dynamicStyles.textAlign]}
              />
            </View>
          </View>
        </View>

        {/* Delivery Method Section */}
        <View style={styles.section}>
          <Typography
            title={t("purchases.deliveryMethod")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.sectionTitle, dynamicStyles.textAlign]}
          />

          <View style={dynamicStyles.deliveryCard}>
            <Typography
              title={orderData.deliveryMethod.name}
              fontSize={scale(14)}
              fontFamily="Roboto-Regular"
              color={COLORS.black}
              style={dynamicStyles.textAlign}
            />
            <Typography
              title={`$${orderData.deliveryMethod.price}`}
              fontSize={scale(14)}
              fontFamily="Roboto-Bold"
              color={COLORS.black}
              style={[styles.deliveryPrice, dynamicStyles.textAlign]}
            />
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Typography
            title={t("purchases.paymentMethod")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.sectionTitle, dynamicStyles.textAlign]}
          />

          <View style={dynamicStyles.paymentCard}>
            <View style={styles.paymentIconContainer}>
              <Ionicons name="card" size={22} color={COLORS.black} />
            </View>
            <Typography
              title={orderData.paymentMethod}
              fontSize={scale(14)}
              fontFamily="Roboto-Regular"
              color={COLORS.black}
              style={dynamicStyles.textAlign}
            />
          </View>
        </View>

        {/* Cost Summary Section */}
        <View style={styles.section}>
          <Typography
            title={t("purchases.costSummary")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.sectionTitle, dynamicStyles.textAlign]}
          />

          <View style={styles.costSummaryCard}>
            <View style={dynamicStyles.costRow}>
              <Typography
                title={t("purchases.subtotal")}
                fontSize={scale(14)}
                fontFamily="Roboto-Regular"
                color={COLORS.grey29}
                style={dynamicStyles.textAlign}
              />
              <Typography
                title={`$${subtotal.toFixed(2)}`}
                fontSize={scale(14)}
                fontFamily="Roboto-Bold"
                color={COLORS.black}
                style={[styles.costValue, dynamicStyles.textAlign]}
              />
            </View>

            <View style={dynamicStyles.costRow}>
              <Typography
                title={t("purchases.discount")}
                fontSize={scale(14)}
                fontFamily="Roboto-Regular"
                color={COLORS.grey29}
                style={dynamicStyles.textAlign}
              />
              <Typography
                title={`-$${orderData.discount.amount.toFixed(2)}`}
                fontSize={scale(14)}
                fontFamily="Roboto-Bold"
                color={COLORS.green}
                style={[styles.costValue, dynamicStyles.textAlign]}
              />
            </View>

            <View style={dynamicStyles.costRow}>
              <Typography
                title={t("purchases.shipping")}
                fontSize={scale(14)}
                fontFamily="Roboto-Regular"
                color={COLORS.grey29}
                style={dynamicStyles.textAlign}
              />
              <Typography
                title={`$${orderData.deliveryMethod.price.toFixed(2)}`}
                fontSize={scale(14)}
                fontFamily="Roboto-Bold"
                color={COLORS.black}
                style={[styles.costValue, dynamicStyles.textAlign]}
              />
            </View>

            <View style={dynamicStyles.costRow}>
              <Typography
                title={t("orderDetail.taxes")}
                fontSize={scale(14)}
                fontFamily="Roboto-Regular"
                color={COLORS.grey29}
                style={dynamicStyles.textAlign}
              />
              <Typography
                title="$15.00"
                fontSize={scale(14)}
                fontFamily="Roboto-Bold"
                color={COLORS.black}
                style={[styles.costValue, dynamicStyles.textAlign]}
              />
            </View>

            <View style={styles.divider} />

            <View style={dynamicStyles.totalRow}>
              <Typography
                title={t("purchases.total")}
                fontSize={scale(16)}
                fontFamily="Poppins-Bold"
                color={COLORS.black}
                style={[styles.totalLabel, dynamicStyles.textAlign]}
              />
              <Typography
                title={`$${(total + 15).toFixed(2)}`}
                fontSize={scale(18)}
                fontFamily="Poppins-Bold"
                color={COLORS.black}
                style={[styles.totalValue, dynamicStyles.textAlign]}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={() => router.push("/order-confirmation")}
        >
          <Typography
            title={t("orderDetail.placeOrder")}
            fontSize={scale(16)}
            color={COLORS.white}
            fontFamily="Poppins-Bold"
            style={[styles.placeOrderButtonText, dynamicStyles.textAlign]}
          />
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
    paddingBottom: verticalScale(100),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(12),
    fontWeight: "600",
  },
  itemsList: {
    gap: scale(12),
    paddingHorizontal: scale(16),
  },
  itemImageContainer: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(10),
    backgroundColor: COLORS.grey3,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  itemInfo: {
    flex: 1,
    gap: verticalScale(4),
  },
  itemName: {
    fontWeight: "600",
    lineHeight: scale(18),
  },
  itemDescription: {
    lineHeight: scale(16),
  },
  itemPrice: {
    fontWeight: "600",
  },
  discountAmount: {
    fontWeight: "500",
  },
  addressIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: COLORS.skyBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  addressInfo: {
    flex: 1,
    gap: verticalScale(4),
  },
  addressLabel: {
    fontWeight: "600",
  },
  addressText: {
    lineHeight: scale(18),
  },
  deliveryPrice: {
    fontWeight: "500",
  },
  paymentIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(8),
    backgroundColor: COLORS.grey3,
    alignItems: "center",
    justifyContent: "center",
  },
  costSummaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    padding: scale(16),
    marginHorizontal: scale(16),
    gap: verticalScale(12),
  },
  costValue: {
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grey4,
    marginVertical: verticalScale(4),
  },
  totalLabel: {
    fontWeight: "600",
  },
  totalValue: {
    fontWeight: "600",
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
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
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(14),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  placeOrderButtonText: {
    fontWeight: "600",
  },
});

export default OrderSummary;
