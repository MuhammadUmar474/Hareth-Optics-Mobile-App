import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "../ui/custom-typography";

const GiftRow = ({
  label1,
  label2,
  onPress,
}: {
  label1: string;
  label2: string;
  onPress: () => void;
}) => {
  const { isRtl } = useLocal();

  return (
    <TouchableOpacity
      style={[styles.container, { flexDirection: isRtl ? "row-reverse" : "row" }]}
      onPress={onPress}
    >
      <View style={[styles.row, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
        <Image
          source={require("@/assets/images/premium.jpg")}
          style={styles.image}
          contentFit="cover"
        />
        <View
          style={[
            styles.textContainer,
            {
              marginLeft: isRtl ? 0 : SIZES.base,
              marginRight: isRtl ? SIZES.base : 0,
            },
          ]}
        >
          <Typography
            title={label1}
            fontSize={SIZES.body}
            style={{ fontWeight: "bold", textAlign: isRtl ? "right" : "left" }}
          />
          <Typography
            title={label2}
            fontSize={SIZES.desc}
            color={COLORS.grey6}
            style={{ textAlign: isRtl ? "right" : "left" }}
          />
        </View>
      </View>
      <Feather name={isRtl ? "chevron-left" : "chevron-right"} size={20} color="black" />
    </TouchableOpacity>
  );
};

export default GiftRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0.5,
    paddingVertical: SIZES.padding,
    paddingHorizontal: 20,
    borderRadius: SIZES.padding,
    borderColor: COLORS.gray,
    marginBottom: SIZES.base,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  textContainer: {
    width: "80%",
  },
});