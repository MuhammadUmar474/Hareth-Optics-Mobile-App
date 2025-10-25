import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import {
  OtherPaymentMethod,
  otherPaymentMethods,
  SavedCard,
  savedCards,
} from "@/constants/data";
import { useLocal } from "@/hooks/use-lang";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useAuthStore } from "@/store/shopifyStore";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
let useShopifyCheckoutSheet = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const checkoutKit = require("@shopify/checkout-sheet-kit");
  useShopifyCheckoutSheet = checkoutKit.useShopifyCheckoutSheet;
} catch {
  console.warn("useShopifyCheckoutSheet not available in Expo Go");
  useShopifyCheckoutSheet = () => ({
    present: (url: string) => {
      console.warn("Checkout not available in Expo Go. URL:", url);
    },
  });
}

const Payment = () => {
  const { t, isRtl } = useLocal();
  const router = useRouter();
  const checkout = useShopifyCheckoutSheet();
  const { accessToken } = useAuthStore();
  const {
    checkout: checkoutData,
    loading,
    error,
    clearError,
    getCustomerOrders,
    clearCheckoutState,
  } = useCheckoutStore();
  const [cards, setCards] = useState<SavedCard[]>(savedCards);
  const [paymentMethods, setPaymentMethods] =
    useState<OtherPaymentMethod[]>(otherPaymentMethods);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);

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
        paymentContent: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          gap: scale(12),
        },
        addNewCardButton: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: scale(4),
          alignSelf: isRtl ? "flex-start" : "flex-end",
          marginHorizontal: scale(16),
          marginVertical: verticalScale(16),
          borderBottomWidth: 1,
          borderBottomColor: COLORS.primary,
        },
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

  const handleCardToggle = (id: number, value: boolean) => {
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        isSelected: card.id === id ? value : false,
      }))
    );
    if (value) {
      setPaymentMethods((prev) =>
        prev.map((method) => ({ ...method, isSelected: false }))
      );
    }
  };

  const handlePaymentMethodToggle = (id: number, value: boolean) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isSelected: method.id === id ? value : false,
      }))
    );

    if (value) {
      setCards((prev) => prev.map((card) => ({ ...card, isSelected: false })));
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  useEffect(() => {
    if (!checkoutData) {
      router.back();
    }
  }, [checkoutData, router]);

  // Handle app state changes to detect when user returns from checkout
  const handleAppStateChange = useCallback(
    async (nextAppState: string) => {
      if (checkoutInProgress && nextAppState === "active") {
        setCheckoutInProgress(false);

        try {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await getCustomerOrders();
          await clearCheckoutState();
          router.push("/order-confirmation");
        } catch (error) {
          console.error("Error getting orders after checkout:", error);
          Alert.alert(
            "Payment Status",
            "Unable to verify payment status. Please check your orders or try again."
          );
        }
      }
    },
    [checkoutInProgress, getCustomerOrders, clearCheckoutState, router]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [handleAppStateChange]);

  const handleProceedToPayment = async () => {
    if (!checkoutData?.webUrl) {
      Alert.alert("Error", "Checkout URL not available");
      return;
    }

    if (!accessToken) {
      Alert.alert("Error", "Authentication required for payment");
      return;
    }

    try {
      setIsProcessingPayment(true);

      let checkoutUrl = checkoutData.webUrl;
      const { shippingAddress } = useCheckoutStore.getState();

      if (shippingAddress) {
        const urlParams = new URLSearchParams();

        // Add shipping address parameters to pre-fill the checkout
        if (shippingAddress.firstName)
          urlParams.append(
            "checkout[shipping_address][first_name]",
            shippingAddress.firstName
          );
        if (shippingAddress.lastName)
          urlParams.append(
            "checkout[shipping_address][last_name]",
            shippingAddress.lastName
          );
        if (shippingAddress.address1)
          urlParams.append(
            "checkout[shipping_address][address1]",
            shippingAddress.address1
          );
        if (shippingAddress.address2)
          urlParams.append(
            "checkout[shipping_address][address2]",
            shippingAddress.address2
          );
        if (shippingAddress.city)
          urlParams.append(
            "checkout[shipping_address][city]",
            shippingAddress.city
          );
        if (shippingAddress.province)
          urlParams.append(
            "checkout[shipping_address][province]",
            shippingAddress.province
          );
        if (shippingAddress.country)
          urlParams.append(
            "checkout[shipping_address][country]",
            shippingAddress.country
          );
        if (shippingAddress.zip)
          urlParams.append(
            "checkout[shipping_address][zip]",
            shippingAddress.zip
          );
        if (shippingAddress.phone)
          urlParams.append(
            "checkout[shipping_address][phone]",
            shippingAddress.phone
          );

        const separator = checkoutUrl.includes("?") ? "&" : "?";
        checkoutUrl = `${checkoutUrl}${separator}${urlParams.toString()}`;
      }

      // Present Shopify's hosted checkout with pre-filled address
      checkout.present(checkoutUrl);
      setCheckoutInProgress(true);
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Failed to open payment screen");
    } finally {
      setIsProcessingPayment(false);
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
          title={t("purchases.payment")}
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
            title={t("purchases.savedCards")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.sectionTitle, dynamicStyles.textAlign]}
          />
          <View style={styles.cardsList}>
            {cards.map((card) => (
              <View key={card.id} style={styles.paymentCard}>
                <View style={dynamicStyles.paymentContent}>
                  <Image source={card.icon} style={styles.cardIcon} />
                  <View style={styles.cardInfo}>
                    <Typography
                      title={card.type}
                      fontSize={scale(14)}
                      fontFamily="Poppins-Bold"
                      color={COLORS.black}
                      style={[styles.cardType, dynamicStyles.textAlign]}
                    />
                    <Typography
                      title={`.... ${card.lastFour}`}
                      fontSize={scale(13)}
                      color={COLORS.grey29}
                      fontFamily="Roboto-Regular"
                      style={[styles.cardNumber, dynamicStyles.textAlign]}
                    />
                  </View>
                  <Switch
                    value={card.isSelected}
                    onValueChange={(value) => handleCardToggle(card.id, value)}
                    trackColor={{
                      false: COLORS.grey10,
                      true: COLORS.primary,
                    }}
                    thumbColor={COLORS.white}
                    ios_backgroundColor={COLORS.grey20}
                    style={styles.switch}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Typography
            title={t("purchases.otherPayments")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.sectionTitle, dynamicStyles.textAlign]}
          />
          <View style={styles.methodsList}>
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentCard}>
                <View style={dynamicStyles.paymentContent}>
                  <View style={styles.methodIconContainer}>
                    {method.iconLibrary === "ionicons" ? (
                      <Ionicons
                        name={method.iconName as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={COLORS.black}
                      />
                    ) : (
                      <FontAwesome5
                        name={method.iconName}
                        size={24}
                        color={COLORS.black}
                      />
                    )}
                  </View>
                  <View style={styles.methodInfo}>
                    <Typography
                      title={method.name}
                      fontSize={scale(14)}
                      fontFamily="Poppins-Bold"
                      color={COLORS.black}
                      style={[styles.methodName, dynamicStyles.textAlign]}
                    />
                  </View>
                  <Switch
                    value={method.isSelected}
                    onValueChange={(value) =>
                      handlePaymentMethodToggle(method.id, value)
                    }
                    trackColor={{
                      false: COLORS.grey10,
                      true: COLORS.primary,
                    }}
                    thumbColor={COLORS.white}
                    ios_backgroundColor={COLORS.grey20}
                    style={styles.switch}
                  />
                </View>
              </View>
            ))}
          </View>
          <TouchableOpacity style={dynamicStyles.addNewCardButton}>
            <AntDesign name="plus" size={13} color={COLORS.primary} />
            <Typography
              title={t("purchases.addNewCard")}
              fontSize={scale(13)}
              color={COLORS.primary}
              fontFamily="Poppins-Bold"
              style={dynamicStyles.textAlign}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.addCardButton}
          onPress={handleProceedToPayment}
          disabled={loading || isProcessingPayment}
        >
          {loading || isProcessingPayment ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Typography
              title="Proceed To Payment"
              fontSize={scale(16)}
              color={COLORS.white}
              fontFamily="Poppins-Bold"
              style={[styles.addCardButtonText, dynamicStyles.textAlign]}
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
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  sectionTitle: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
    fontWeight: "600",
  },
  cardsList: {
    gap: scale(16),
    paddingHorizontal: scale(16),
  },
  methodsList: {
    gap: scale(16),
    paddingHorizontal: scale(16),
  },
  paymentCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    padding: scale(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: scale(28),
    height: scale(28),
    resizeMode: "contain",
  },
  cardInfo: {
    flex: 1,
    gap: verticalScale(2),
  },
  cardType: {
    fontWeight: "600",
  },
  cardNumber: {
    lineHeight: scale(18),
  },
  methodIconContainer: {
    width: scale(40),
    height: scale(40),
    backgroundColor: COLORS.grey3,
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontWeight: "600",
  },
  bottomSection: {
    paddingTop: verticalScale(16),
  },
  addCardButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: scale(16),
    marginBottom: verticalScale(26),
  },
  addCardButtonText: {
    fontWeight: "600",
  },
});

export default Payment;
