import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { useCartStore } from "@/store/cartStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const ShoppingCart = () => {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity: updateCartQuantity } = useCartStore();
  const [promoCode, setPromoCode] = useState<string>("");

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
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Typography
            title="Cart"
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={styles.headerTitle}
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
            title="Your Cart is Waiting to Shine"
            fontSize={scale(20)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={styles.emptyCartTitle}
          />
          <Typography
            title="Don't leave your vision on hold — discover the perfect frame, lenses, and styles to match your look."
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Typography
          title="Shopping Cart"
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
        {/* Cart Items */}
        <View style={styles.cartItemsContainer}>
          {cartItems.map((item, index) => (
            <View key={`${item.id}-${item.name}-${index}`} style={styles.cartCard}>
              <View style={styles.cartItemContent}>
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
                    style={styles.productName}
                    numberOfLines={1}
                  />
                  <Typography
                    title={`$${item.price.toFixed(2)}`}
                    fontSize={scale(13)}
                    fontFamily="Roboto-Bold"
                    color={COLORS.grey33}
                  />

                  {/* Quantity Controls */}
                  <View style={styles.quantityContainer}>
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
                      style={styles.quantityText}
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
        <View style={styles.promoContainer}>
          <TextInput
            style={styles.promoInput}
            placeholder="Enter Promo Code"
            placeholderTextColor={COLORS.grey10}
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity style={styles.applyButton}>
            <Typography
              title="Apply"
              fontSize={scale(14)}
              fontFamily="Roboto-Bold"
              color={COLORS.primary}
              style={styles.applyButtonText}
            />
          </TouchableOpacity>
        </View>

        {/* Price Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Typography
              title="Subtotal"
              fontSize={scale(15)}
              fontFamily="Roboto-Regular"
              color={COLORS.grey29}
            />
            <Typography
              title={`$${subtotal.toFixed(2)}`}
              fontSize={scale(16)}
              fontFamily="Roboto-Bold"
              color={COLORS.black}
              style={styles.summaryValue}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Typography
              title="Shipping"
              fontSize={scale(15)}
              fontFamily="Roboto-Regular"
              color={COLORS.grey29}
            />
            <Typography
              title={`$${shipping.toFixed(2)}`}
              fontSize={scale(16)}
              fontFamily="Roboto-Bold"
              color={COLORS.black}
              style={styles.summaryValue}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Typography
              title="Estimated Tax"
              fontSize={scale(15)}
              fontFamily="Roboto-Regular"
              color={COLORS.grey29}
            />
            <Typography
              title={`$${estimatedTax.toFixed(2)}`}
              fontSize={scale(16)}
              fontFamily="Roboto-Bold"
              color={COLORS.black}
              style={styles.summaryValue}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Typography
              title="Total"
              fontSize={scale(16)}
              fontFamily="Poppins-Bold"
              color={COLORS.black}
              style={styles.totalLabel}
            />
            <Typography
              title={`$${total.toFixed(2)}`}
              fontSize={scale(20)}
              fontFamily="Poppins-Bold"
              color={COLORS.black}
              style={styles.totalValue}
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
              title="Proceed to Checkout"
              fontSize={scale(16)}
              color={COLORS.white}
              fontFamily="Poppins-Bold"
              style={styles.checkoutButtonText}
            />
          </TouchableOpacity>
        </View>
    </View>
  );
};

export default ShoppingCart;

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
  cartItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    marginTop: verticalScale(4),
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
  promoContainer: {
    flexDirection: "row",
    gap: scale(12),
    paddingHorizontal: scale(16),
    marginTop: verticalScale(24),
    marginBottom: verticalScale(24),
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
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryValue: {
    fontWeight: "400",
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
    marginBottom: verticalScale(12),
  },
  emptyCartMessage: {
    textAlign: "center",
    lineHeight: scale(22),
    paddingHorizontal: scale(16),
  },
});
