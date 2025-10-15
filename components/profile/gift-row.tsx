import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
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
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        <Image
          source={require("@/assets/images/premium.jpg")}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.textContainer}>
          <Typography
            title={label1}
            fontSize={SIZES.body}
            style={{ fontWeight: "bold" }}
          />
          <Typography
            title={label2}
            fontSize={SIZES.desc}
            color={COLORS.grey6}
          />
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="black" />
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
    marginLeft: SIZES.base,
    width: "80%",
  },
});
