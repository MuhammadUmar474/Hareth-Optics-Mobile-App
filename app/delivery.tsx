import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { DeliveryOption, deliveryOptions } from "@/constants/data";
import { useLocal } from "@/hooks/use-lang";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const Delivery = () => {  
  const { t } = useLocal()

  const router = useRouter();
  const [options, setOptions] = useState<DeliveryOption[]>(deliveryOptions);

  const handleSelectOption = (id: number) => {
    setOptions((prev) =>
      prev.map((option) => ({
        ...option,
        isSelected: option.id === id,
      }))
    );
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
          title="Delivery"
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
        {/* Delivery Options Section */}
        <View style={styles.section}>
          <Typography
            title="Delivery options"
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={styles.sectionTitle}
          />

          <View style={styles.optionsList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  option.isSelected && styles.optionCardSelected,
                ]}
                onPress={() => handleSelectOption(option.id)}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionInfo}>
                    <Typography
                      title={option.title}
                      fontSize={scale(16)}
                      fontFamily="Poppins-Bold"
                      color={COLORS.black}
                      style={styles.optionTitle}
                    />
                    <Typography
                      title={option.description}
                      fontSize={scale(13)}
                      color={COLORS.grey29}
                      fontFamily="Roboto-Regular"
                      style={styles.optionDescription}
                    />
                  </View>

                  <View
                    style={[
                      styles.radioButton,
                      option.isSelected && styles.radioButtonActive,
                    ]}
                  >
                    {option.isSelected && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.push("/payment")}
        >
          <Typography
            title="Continue to payment"
            fontSize={scale(16)}
            color={COLORS.white}
            fontFamily="Poppins-Bold"
            style={styles.continueButtonText}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Delivery;

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
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: scale(12),
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
});

