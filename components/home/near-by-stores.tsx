import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";
import Input from "../ui/input";

const NearByStores = () => {
  const { t, isRtl } = useLocal();
  const dynStyles = (useMemo(() =>
    StyleSheet.create({
      textAlign: { textAlign: isRtl ? "right" : "left" },
    })
    , [isRtl]))
  return (
    <View style={styles.container}>
      <Typography
        title={t("home.nearbyStores")}
        fontSize={scale(17)}
        fontFamily="Poppins-Bold"
        color={COLORS.secondary}
        textAlign={dynStyles.textAlign.textAlign}
        style={styles.headerTitle}
      />

      <View style={styles.locationContainer}>
        <Input
          placeholder={t("home.findStores")}
          containerStyle={styles.inputContainer}
          textAlign={dynStyles.textAlign.textAlign}
          inputContainerStyle={styles.inputContainerStyle}
          {...(isRtl
            ? {
              rightAccessory: (
                <Feather name="search" size={20} color={COLORS.primary} />
              ),
            }
            : {
              leftAccessory: (
                <Feather name="search" size={20} color={COLORS.primary} />
              ),
            })}
        />
        <Typography
          title={t("home.useYourCurrentLocation")}
          fontSize={scale(12)}
          fontFamily="Roboto-Regular"
          color={COLORS.black}
          textAlign={dynStyles.textAlign.textAlign}
          style={styles.inputTitle}
        />
      </View>
    </View>
  );
};

export default NearByStores;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
  },
  headerTitle: {
    fontWeight: "600",
  },
  locationContainer: {
    borderWidth: 1,
    borderColor: COLORS.grey4,
    borderRadius: scale(14),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    gap: scale(4),
    marginTop: verticalScale(12),
  },
  inputContainer: {
    borderRadius: scale(14),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: COLORS.grey12,
  },
  inputContainerStyle: {
    borderWidth: 0,
    backgroundColor: COLORS.grey12,
    borderRadius: scale(14),
  },
  inputTitle: {
    fontWeight: "500",
    textDecorationLine: "underline",
    marginTop: verticalScale(4),
  },
});
