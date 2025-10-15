import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "../ui/custom-typography";

interface ContactRowProps {
  label: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

const ContactRow: React.FC<ContactRowProps> = ({
  label,
  iconName,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={styles.avatar}>
          <MaterialIcons name={iconName} size={20} color={COLORS.white} />
        </View>
        <Typography title={label} fontSize={SIZES.body} style={styles.label} />
      </View>
      <AntDesign name="right" size={16} color="black" />
    </TouchableOpacity>
  );
};

export default React.memo(ContactRow);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginLeft: SIZES.padding,
    fontWeight: "600",
  },
});
