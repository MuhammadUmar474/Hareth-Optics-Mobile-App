import { COLORS } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";
import Input from "../ui/input";

const NearByStores = () => {
  return (
    <View style={styles.container}>
      <Typography
        title="Nearby stores"
        fontSize={scale(17)}
        fontFamily="Poppins-Bold"
        color={COLORS.secondary}
        style={styles.headerTitle}
      />

      <View style={styles.locationContainer}>
        <Input
          placeholder="Find stores nearby"
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputContainerStyle}
          leftAccessory={
            <Feather name="search" size={20} color={COLORS.primary} />
          }
        />
        <Typography
          title="Use your current location"
          fontSize={scale(12)}
          fontFamily="Roboto-Regular"
          color={COLORS.black}
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
