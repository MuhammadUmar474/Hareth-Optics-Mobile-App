import Typography from "@/components/ui/custom-typography";
import Input from "@/components/ui/input";
import { COLORS } from "@/constants/colors";
import { SavedAddress, savedAddresses } from "@/constants/data";
import { useLocal } from "@/hooks/use-lang";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const DeliveryAddress = () => {
  const { t, isRtl } = useLocal();
  const router = useRouter();
  const [addresses, setAddresses] = useState<SavedAddress[]>(savedAddresses);
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [aptSuite, setAptSuite] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [setAsDefault, setSetAsDefault] = useState<boolean>(false);

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

  const handleSelectAddress = (id: number) => {
    setAddresses((prev) =>
      prev.map((addr) => {
        if (addr.id === id) {
          return { ...addr, isSelected: !addr.isSelected };
        }
        return { ...addr, isSelected: false };
      })
    );
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
            {addresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.addressCard,
                  address.isSelected && styles.addressCardSelected,
                ]}
                onPress={() => handleSelectAddress(address.id)}
              >
                <View style={dynamicStyles.addressContent}>
                  <View style={styles.iconContainer}>
                    {address.iconLibrary === "ionicons" ? (
                      <Ionicons
                        name={address.iconName as any}
                        size={22}
                        color={COLORS.primary}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={
                          address.iconName as keyof typeof MaterialCommunityIcons.glyphMap
                        }
                        size={22}
                        color={COLORS.primary}
                      />
                    )}
                  </View>
                  <View style={styles.addressInfo}>
                    <Typography
                      title={address.label}
                      fontSize={scale(16)}
                      fontFamily="Poppins-Bold"
                      color={COLORS.black}
                      style={[styles.addressLabel, dynamicStyles.textAlign]}
                    />
                    <Typography
                      title={`${address.address},`}
                      fontSize={scale(13)}
                      color={COLORS.grey29}
                      fontFamily="Roboto-Regular"
                      style={[styles.addressText, dynamicStyles.textAlign]}
                    />
                    <Typography
                      title={`${address.city}, ${address.state} ${address.zipCode}`}
                      fontSize={scale(13)}
                      color={COLORS.grey29}
                      fontFamily="Roboto-Regular"
                      style={[styles.addressText, dynamicStyles.textAlign]}
                    />
                  </View>
                  <View
                    style={[
                      styles.radioButton,
                      address.isSelected && styles.radioButtonActive,
                    ]}
                  >
                    {address.isSelected && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
          <View style={styles.formContainer}>
            <Input
              placeholder={t("address.streetAddress")}
              value={streetAddress}
              onChangeText={setStreetAddress}
              containerStyle={styles.inputContainer}
              inputContainerStyle={[styles.inputField, dynamicStyles.textAlign]}
              placeholderTextColor={COLORS.grey10}
            />
            <Input
              placeholder={t("address.suite")}
              value={aptSuite}
              onChangeText={setAptSuite}
              containerStyle={styles.inputContainer}
              inputContainerStyle={[styles.inputField, dynamicStyles.textAlign]}
              placeholderTextColor={COLORS.grey10}
            />
            <View style={dynamicStyles.inputRow}>
              <Input
                placeholder={t("address.city")}
                value={city}
                onChangeText={setCity}
                containerStyle={[styles.inputContainer, styles.inputHalf]}
                inputContainerStyle={[styles.inputField, dynamicStyles.textAlign]}
                placeholderTextColor={COLORS.grey10}
              />
              <Input
                placeholder={t("address.state")}
                value={state}
                onChangeText={setState}
                containerStyle={[styles.inputContainer, styles.inputHalf]}
                inputContainerStyle={[styles.inputField, dynamicStyles.textAlign]}
                placeholderTextColor={COLORS.grey10}
              />
            </View>
            <Input
              placeholder={t("address.zipCode")}
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
              inputContainerStyle={[styles.inputField, dynamicStyles.textAlign]}
              placeholderTextColor={COLORS.grey10}
            />
            <View style={dynamicStyles.checkboxContainer}>
              <TouchableOpacity onPress={() => setSetAsDefault(!setAsDefault)}>
                <View style={styles.checkbox}>
                  {setAsDefault && (
                    <Feather name="check" size={16} color={COLORS.primary} />
                  )}
                </View>
              </TouchableOpacity>
              <Typography
                title={t("address.setdefaultAddress")}
                fontSize={scale(14)}
                color={COLORS.grey29}
                fontFamily="Roboto-Regular"
                style={dynamicStyles.textAlign}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push("/delivery")}
        >
          <Typography
            title={t("address.continue")}
            fontSize={scale(16)}
            color={COLORS.white}
            fontFamily="Poppins-Bold"
            style={[styles.continueButtonText, dynamicStyles.textAlign]}
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
});

export default DeliveryAddress;