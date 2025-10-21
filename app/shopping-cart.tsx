import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { useCartStore } from "@/store/cartStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const ShoppingCart = () => {
  const { t, isRtl } = useLocal();
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity: updateCartQuantity } = useCartStore();
  const [promoCode, setPromoCode] = useState<string>("");

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
          borderBottomWidth: 1,
          borderBottomColor: COLORS.grey4,
        },
        cartItemContent: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          gap: scale(12),
        },
        quantityContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          gap: scale(12),
          marginTop: verticalScale(4),
        },
        promoContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          gap: scale(12),
          paddingHorizontal: scale(16),
          marginTop: verticalScale(24),
          marginBottom: verticalScale(24),
        },
        summaryRow: {
          flexDirection: isRtl ? "row-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

  const updateQuantity = (id: number, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      updateCartQuantity(id, newQuantity);
    }
  };

  const removeItem = (id: number) => {
    removeFromCart(id);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 10.0;
  const estimatedTax = 15.0;
  const total = subtotal + shipping + estimatedTax;

  if (cartItems.length === 0) {
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
            title={t("purchases.cart")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.headerTitle, dynamicStyles.textAlign]}
          />
          <View style={styles.headerButton} />
        </View>

        <View style={styles.emptyCartContainer}>
          <Image
            source={require("@/assets/images/home/empty-cart.png")}
            style={styles.emptyCartImage}
            contentFit="contain"
          />
          <Typography
            title={t("purchases.yourCartTitle")}
            fontSize={scale(20)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.emptyCartTitle, dynamicStyles.textAlign]}
          />
          <Typography
            title={t("purchases.yourCartDescription")}
            fontSize={scale(14)}
            fontFamily="Roboto-Regular"
            color={COLORS.grey29}
            style={[styles.emptyCartMessage, dynamicStyles.textAlign]}
          />
        </View>
      </View>
    );
  }

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
          title={t("purchases.cart")}
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
        {/* Cart Items */}
        <View style={styles.cartItemsContainer}>
          {cartItems.map((item, index) => (
            <View key={`${item.id}-${item.name}-${index}`} style={styles.cartCard}>
              <View style={dynamicStyles.cartItemContent}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                  <Image source={item.image} style={styles.productImage} />
                </View>

                {/* Product Info */}
                <View style={styles.productInfo}>
                  <Typography
                    title={item.name}
                    fontSize={scale(15)}
                    fontFamily="Poppins-Bold"
                    color={COLORS.black}
                    style={[styles.productName, dynamicStyles.textAlign]}
                    numberOfLines={1}
                  />
                  <Typography
                    title={`${item.price.toFixed(2)} ${t("common.currency")}`}
                    fontSize={scale(13)}
                    fontFamily="Roboto-Bold"
                    color={COLORS.grey33}
                    style={dynamicStyles.textAlign}
                  />

                  {/* Quantity Controls */}
                  <View style={dynamicStyles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Ionicons
                        name="remove"
                        size={16}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                    <Typography
                      title={item.quantity.toString()}
                      fontSize={scale(14)}
                      fontFamily="Roboto-Bold"
                      color={COLORS.black}
                      style={[styles.quantityText]}
                    />
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Ionicons name="add" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeItem(item.id)}
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={22}
                    color={COLORS.grey33}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Code Section */}
        <View style={dynamicStyles.promoContainer}>
          <TextInput
            style={[styles.promoInput, dynamicStyles.textAlign]}
            placeholder={t("purchases.enterPromoCode")}
            placeholderTextColor={COLORS.grey10}
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity style={styles.applyButton}>
            <Typography
              title={t("home.apply")}
              fontSize={scale(14)}
              fontFamily="Roboto-Bold"
              color={COLORS.primary}
              style={[styles.applyButtonText, dynamicStyles.textAlign]}
            />
          </TouchableOpacity>
        </View>

        {/* Price Summary */}
        <View style={styles.summaryContainer}>
          <View style={dynamicStyles.summaryRow}>
            <Typography
              title={t("purchases.subtotal")}
              fontSize={scale(15)}
              fontFamily="Roboto-Regular"
              color={COLORS.grey29}
              style={dynamicStyles.textAlign}
            />
            <Typography
              title={`${subtotal.toFixed(2)} ${t("common.currency")}`}
              fontSize={scale(16)}
              fontFamily="Roboto-Bold"
              color={COLORS.black}
              style={dynamicStyles.textAlign}
            />
          </View>

          <View style={styles.divider} />

          <View style={dynamicStyles.summaryRow}>
            <Typography
              title={t("purchases.shipping")}
              fontSize={scale(15)}
              fontFamily="Roboto-Regular"
              color={COLORS.grey29}
              style={dynamicStyles.textAlign}
            />
            <Typography
              title={`${shipping.toFixed(2)} ${t("common.currency")}`}
              fontSize={scale(16)}
              fontFamily="Roboto-Bold"
              color={COLORS.black}
              style={dynamicStyles.textAlign}
            />
          </View>

          <View style={styles.divider} />

          <View style={dynamicStyles.summaryRow}>
            <Typography
              title={t("purchases.estimatedTax")}
              fontSize={scale(15)}
              fontFamily="Roboto-Regular"
              color={COLORS.grey29}
              style={dynamicStyles.textAlign}
            />
            <Typography
              title={`${estimatedTax.toFixed(2)} ${t("common.currency")}`}
              fontSize={scale(16)}
              fontFamily="Roboto-Bold"
              color={COLORS.black}
              style={dynamicStyles.textAlign}
            />
          </View>

          <View style={styles.divider} />

          <View style={dynamicStyles.summaryRow}>
            <Typography
              title={t("purchases.total")}
              fontSize={scale(16)}
              fontFamily="Poppins-Bold"
              color={COLORS.black}
              style={[styles.totalLabel, dynamicStyles.textAlign]}
            />
            <Typography
              title={`${total.toFixed(2)} ${t("common.currency")}`}
              fontSize={scale(20)}
              fontFamily="Poppins-Bold"
              color={COLORS.black}
              style={[styles.totalValue, dynamicStyles.textAlign]}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push("/delivery-address")}
        >
          <Typography
            title={t("purchases.proceedToCheckout")}
            fontSize={scale(16)}
            color={COLORS.white}
            fontFamily="Poppins-Bold"
            style={[styles.checkoutButtonText, dynamicStyles.textAlign]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    paddingBottom: verticalScale(100),
    paddingTop: verticalScale(16),
  },
  cartItemsContainer: {
    gap: scale(16),
    paddingHorizontal: scale(16),
  },
  cartCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(16),
    padding: scale(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(12),
    backgroundColor: COLORS.grey3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productInfo: {
    flex: 1,
    gap: verticalScale(6),
  },
  productName: {
    fontWeight: "600",
    lineHeight: scale(20),
  },
  quantityButton: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(16),
    backgroundColor: COLORS.skyBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    minWidth: scale(20),
    textAlign: "center",
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: verticalScale(4),
  },
  promoInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    fontSize: scale(14),
    fontFamily: "Roboto-Regular",
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.grey4,
  },
  applyButton: {
    backgroundColor: COLORS.skyBlue,
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontWeight: "600",
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    borderRadius: scale(16),
    padding: scale(20),
    marginHorizontal: scale(16),
    gap: verticalScale(16),
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grey4,
  },
  totalLabel: {
    fontWeight: "600",
  },
  totalValue: {
    fontWeight: "600",
  },
  bottomSection: {
    paddingTop: verticalScale(16),
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: scale(16),
    marginBottom: verticalScale(26),
  },
  checkoutButtonText: {
    fontWeight: "600",
  },
  emptyCartContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(40),
  },
  emptyCartImage: {
    width: scale(200),
    height: scale(200),
    marginBottom: verticalScale(32),
  },
  emptyCartTitle: {
    fontWeight: "600",
    textAlign: "center",
  },
  emptyCartMessage: {
    textAlign: "center",
    lineHeight: scale(22),
    paddingHorizontal: scale(16),
  },
});

export default ShoppingCart;