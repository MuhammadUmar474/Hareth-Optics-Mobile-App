import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { useCartStore } from "@/store/cartStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const {
    cart,
    loading,
    error,
    updateCartLines,
    removeFromCart,
    clearError,
    loadCart,
  } = useCartStore();
  const [promoCode, setPromoCode] = useState<string>("");

  const memoizedLoadCart = useCallback(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    memoizedLoadCart();
  }, [memoizedLoadCart]);

  useFocusEffect(
    useCallback(() => {
      memoizedLoadCart();
    }, [memoizedLoadCart])
  );

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(lineId);
      return;
    }

    const success = await updateCartLines([
      {
        id: lineId,
        quantity: newQuantity,
      },
    ]);

    if (!success) {
      Alert.alert("Error", "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const success = await removeFromCart([lineId]);
            if (!success) {
              Alert.alert("Error", "Failed to remove item");
            }
          },
        },
      ]
    );
  };

  const handleApplyPromo = () => {
    // TODO: Implement promo code functionality
    Alert.alert("Promo Code", "Promo code functionality coming soon!");
  };

  const handleCheckout = () => {
    if (!cart?.checkoutUrl) {
      Alert.alert("Error", "Checkout URL not available");
      return;
    }
    // TODO: Implement checkout navigation
    Alert.alert("Checkout", "Checkout functionality coming soon!");
  };

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

  const subtotal = cart
    ? cart.lines.edges.reduce((sum, { node }) => {
        const priceAmount = node.merchandise.price?.amount || "0.00";
        const itemPrice = parseFloat(priceAmount);
        const itemTotal = itemPrice * node.quantity;
        return sum + itemTotal;
      }, 0)
    : 0;
  const shipping = 10.0;
  const estimatedTax = 15.0;
  const total = subtotal + shipping + estimatedTax;

  if (!cart || cart.lines.edges.length === 0) {
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
            style={styles.emptyCartMessage}
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Typography
                title="Loading cart..."
                fontSize={scale(16)}
                color={COLORS.grey29}
                fontFamily="Roboto-Regular"
                style={{ marginTop: 10 }}
              />
            </View>
          ) : cart?.lines.edges.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Typography
                title="Your cart is empty"
                fontSize={scale(18)}
                color={COLORS.grey29}
                fontFamily="Poppins-Bold"
                style={{ textAlign: "center", marginBottom: 20 }}
              />
              <Typography
                title="Add some items to get started"
                fontSize={scale(14)}
                color={COLORS.grey29}
                fontFamily="Roboto-Regular"
                style={{ textAlign: "center" }}
              />
            </View>
          ) : (
            cart?.lines.edges.map(({ node: lineItem }, index) => {
              return (
                <TouchableOpacity
                  key={`${lineItem.id}-${index}`}
                  style={styles.cartCard}
                  onPress={() => {
                    const productId = lineItem.merchandise.product.id;

                    if (!productId) {
                      console.error(
                        "🛒 Cart: Product ID not found in cart data"
                      );
                      Alert.alert(
                        "Error",
                        "Product information not found. Please remove and re-add this item."
                      );
                      return;
                    }
                    router.push({
                      pathname: "/product-details",
                      params: {
                        id: productId,
                        cartLineId: lineItem.id,
                        isFromCart: "true",
                      },
                    });
                  }}
                >
                  <View style={dynamicStyles.cartItemContent}>
                    {/* Product Image */}
                    <View style={styles.imageContainer}>
                      <Image
                        source={{
                          uri:
                            lineItem.merchandise.product.featuredImage?.url ||
                            "https://via.placeholder.com/100x100",
                        }}
                        style={styles.productImage}
                        contentFit="cover"
                      />
                    </View>

                    {/* Product Info */}
                    <View style={styles.productInfo}>
                      <Typography
                        title={lineItem.merchandise.product.title}
                        fontSize={scale(16)}
                        fontFamily="Poppins-Bold"
                        color={COLORS.black}
                        style={[styles.productName, dynamicStyles.textAlign]}
                        numberOfLines={1}
                      />
                      <Typography
                        title={`${(
                          parseFloat(
                            lineItem.merchandise.price?.amount || "0.00"
                          ) * lineItem.quantity
                        ).toFixed(2)} ${
                          lineItem.merchandise.price?.currencyCode || "USD"
                        }`}
                        fontSize={scale(16)}
                        fontFamily="Poppins-Bold"
                        color={COLORS.grey33}
                        style={dynamicStyles.textAlign}
                      />
                      <View style={dynamicStyles.quantityContainer}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() =>
                            handleQuantityChange(
                              lineItem.id,
                              lineItem.quantity - 1
                            )
                          }
                          disabled={loading}
                        >
                          <Ionicons
                            name="remove"
                            size={16}
                            color={loading ? COLORS.grey4 : COLORS.primary}
                          />
                        </TouchableOpacity>
                        <Typography
                          title={lineItem.quantity.toString()}
                          fontSize={scale(16)}
                          fontFamily="Roboto-Bold"
                          color={COLORS.black}
                          style={styles.quantityText}
                        />
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() =>
                            handleQuantityChange(
                              lineItem.id,
                              lineItem.quantity + 1
                            )
                          }
                          disabled={loading}
                        >
                          <Ionicons
                            name="add"
                            size={16}
                            color={loading ? COLORS.grey4 : COLORS.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.quantitySection}>
                      {/* Delete Button */}
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleRemoveItem(lineItem.id)}
                        disabled={loading}
                      >
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={24}
                          color={COLORS.grey33}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
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
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyPromo}
          >
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
          onPress={handleCheckout}
          disabled={loading || !cart || cart.lines.edges.length === 0}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Typography
              title={t("purchases.proceedToCheckout")}
              fontSize={scale(16)}
              color={COLORS.white}
              fontFamily="Poppins-Bold"
              style={[styles.checkoutButtonText, dynamicStyles.textAlign]}
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
    gap: verticalScale(2),
    justifyContent: "center",
  },
  productName: {
    fontWeight: "600",
    lineHeight: scale(22),
  },
  quantitySection: {
    alignItems: "center",
    gap: verticalScale(12),
  },
  quantityButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: COLORS.skyBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    minWidth: scale(24),
    textAlign: "center",
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
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
    paddingHorizontal: scale(24),
    marginTop: verticalScale(10),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(50),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(50),
  },
});

export default ShoppingCart;
