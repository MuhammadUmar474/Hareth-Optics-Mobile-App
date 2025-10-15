import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { MaterialIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "../ui/custom-typography";

export interface ContactActionProps {
  label: string;
  subtitle?: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

const ICON_SIZE = 20;
const AVATAR_SIZE = 48;

const ContactAction: React.FC<ContactActionProps> = ({
  label,
  subtitle,
  iconName,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.actionContainer}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.actionLeft}>
        <View style={styles.actionAvatar}>
          <MaterialIcons
            name={iconName}
            size={ICON_SIZE}
            color={COLORS.white}
          />
        </View>
        <View style={styles.actionTextWrap}>
          <Typography
            title={label}
            fontSize={SIZES.title}
            color={COLORS.secondary}
            fontFamily="Inter-SemiBold"
          />
          {subtitle ? (
            <Typography
              title={subtitle}
              fontSize={SIZES.caption}
              color={COLORS.grayText}
            />
          ) : null}
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={18} color={COLORS.grey10} />
    </TouchableOpacity>
  );
};

export default memo(ContactAction);

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary10,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTextWrap: {
    marginLeft: SIZES.padding,
    flex: 1,
  },
});
