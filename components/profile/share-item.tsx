import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface ShareItemProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const ShareItem: React.FC<ShareItemProps> = ({ label, icon, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.shareItem}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.shareIcon}>{icon}</View>
      <Typography
        title={label}
        fontSize={SIZES.caption}
        color={COLORS.secondary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shareItem: {
    width: "24%",
    alignItems: "center",
    justifyContent: "center",
  },
  shareIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary20,
    marginBottom: 8,
  },
});

export default ShareItem;
