import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import {
  OtherPaymentMethod,
  otherPaymentMethods,
  SavedCard,
  savedCards,
} from "@/constants/data";
import { useLocal } from "@/hooks/use-lang";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const Payment = () => {
  const{t}=useLocal()
  const router = useRouter();
  const [cards, setCards] = useState<SavedCard[]>(savedCards);
  const [paymentMethods, setPaymentMethods] =
    useState<OtherPaymentMethod[]>(otherPaymentMethods);

  const handleCardToggle = (id: number, value: boolean) => {
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        isSelected: card.id === id ? value : false,
      }))
    );
    // Unselect other payment methods when a card is selected
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
          title={t("purchases.payment")}
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
        {/* Saved Cards Section */}
        <View style={styles.section}>
          <Typography
            title={t("purchases.savedCards")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={styles.sectionTitle}
          />

          <View style={styles.cardsList}>
            {cards.map((card) => (
              <View key={card.id} style={styles.paymentCard}>
                <View style={styles.paymentContent}>
                  <Image source={card.icon} style={styles.cardIcon} />
                  <View style={styles.cardInfo}>
                    <Typography
                      title={card.type}
                      fontSize={scale(14)}
                      fontFamily="Poppins-Bold"
                      color={COLORS.black}
                      style={styles.cardType}
                    />
                    <Typography
                      title={`.... ${card.lastFour}`}
                      fontSize={scale(13)}
                      color={COLORS.grey29}
                      fontFamily="Roboto-Regular"
                      style={styles.cardNumber}
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

        {/* Other Payment Methods Section */}
        <View style={styles.section}>
          <Typography
            title={t("purchases.otherPayments")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={styles.sectionTitle}
          />

          <View style={styles.methodsList}>
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentCard}>
                <View style={styles.paymentContent}>
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
                      style={styles.methodName}
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
          <TouchableOpacity style={styles.addNewCardButton}>
            <AntDesign name="plus" size={13} color={COLORS.primary} />
            <Typography
              title={t("purchases.addNewCard")}
              fontSize={scale(13)}
              color={COLORS.primary}
              fontFamily="Poppins-Bold"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.addCardButton}
          onPress={() => router.push("/order-summary")}
        >
          <Typography
            title={t("address.continue")}
            fontSize={scale(16)}
            color={COLORS.white}
            fontFamily="Poppins-Bold"
            style={styles.addCardButtonText}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(6),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    backgroundColor: COLORS.white,
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
  paymentContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
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
  addNewCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(4),
    alignSelf: "flex-end",
    marginHorizontal: scale(16),
    marginVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
});
