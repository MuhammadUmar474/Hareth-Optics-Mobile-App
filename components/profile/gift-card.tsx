import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Typography from "../ui/custom-typography";
import GiftRow from "./gift-row";

const GiftCard = () => {
  const { isRtl } = useLocal();
  return (
    <View style={styles.container}>
      <Typography
        title="Wallet & Gift Card"
        fontSize={SIZES.desc}
        style={ { fontWeight: "bold", marginBottom: SIZES.base,textAlign: isRtl?"right" :"left"}}
      />
      <GiftRow
        label1="View Gift Card balance"
        label2="Validity show here when logged in"
        onPress={() => {
          router.push("/(tabs)/(profile)/view-gift-card-balance");
        }}
      />
      <GiftRow
        label1="Saved Payment Methods"
        label2="Manage cards"
        onPress={() => {
          router.push("/(tabs)/(profile)/saved-payment-methods");
        }}
      />
    </View>
  );
};

export default GiftCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.3,
    borderColor: COLORS.gray,
    marginHorizontal: SIZES.caption,
    borderRadius: SIZES.base,
    padding: SIZES.padding,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
