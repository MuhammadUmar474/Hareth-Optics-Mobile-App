import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import Entypo from "@expo/vector-icons/Entypo";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import Typography from "../ui/custom-typography";

const PaymentCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          source={require("@/assets/images/lenses.jpg")}
          style={styles.image}
        />
        <View>
          <Typography
            title="Mastercard **** 1234"
            fontSize={SIZES.body}
            style={{ fontWeight: "700" }}
          />
          <Typography
            title="Expiry  01/25"
            fontSize={SIZES.desc}
            style={{ fontWeight: "500" }}
            color={COLORS.gray}
          />
        </View>
      </View>
      <Entypo name="dots-three-vertical" size={24} color="black" />
    </View>
  );
};

export default PaymentCard;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SIZES.padding,
    paddingHorizontal: 20,
    borderRadius: SIZES.padding,
    backgroundColor: COLORS.white6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.84,

    elevation: 5,
    marginBottom: 20,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: SIZES.base,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
