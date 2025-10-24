import { COLORS } from "@/constants/colors";
import { PaymentMethod } from "@/constants/data";
import { useLocal } from "@/hooks/use-lang";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";
interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
}
const PaymentMethods: React.FC<PaymentMethodsProps> = ({ paymentMethods }) => {
   const {t,isRtl}=useLocal();
   const dynStyles = useMemo(() =>
    StyleSheet.create({
      textAlign: { textAlign: isRtl ? "right" : "left" },
    })
    , [isRtl])
  const renderPaymentMethodItem = (item: PaymentMethod) => {
    return (
      <TouchableOpacity style={styles.paymentMethodItem}>
        <Image
          source={item.image}
          style={styles.paymentMethodImage}
          contentFit="contain"
        />
        <Typography
          title={item.name}
          fontSize={scale(12)}
          fontFamily="Roboto-Bold"
          color={COLORS.black}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Typography
        title={t("purchases.paymentMethods")}
        fontSize={scale(14)}
        fontFamily="Poppins-Bold"
        color={COLORS.secondary}
        textAlign={dynStyles.textAlign.textAlign}
        style={styles.title}
      />
      <FlatList
        data={paymentMethods}
        inverted={isRtl}
        renderItem={({ item }) => renderPaymentMethodItem(item)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.paymentMethodList}
      />
    </View>
  );
};

export default PaymentMethods;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.grey4,
    borderRadius: moderateScale(18),
    paddingHorizontal: scale(14),
    paddingVertical: scale(16),
    gap: scale(10),
    marginHorizontal: scale(22),
    marginBottom: verticalScale(14),
    marginTop: verticalScale(2),
  },
  paymentMethodItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
    backgroundColor: COLORS.gray18,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: moderateScale(50),
  },
  paymentMethodImage: {
    width: scale(14),
    height: scale(14),
    borderRadius: moderateScale(50),
  },
  paymentMethodList: {
    gap: scale(10),
  },
  title: {
    marginBottom: scale(2),
    fontWeight: "600",
  },
});
