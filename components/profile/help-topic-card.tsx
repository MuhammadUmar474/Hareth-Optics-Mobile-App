import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "../ui/custom-typography";

interface HelpTopicCardProps {
  label: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

const HelpTopicCard: React.FC<HelpTopicCardProps> = ({
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
      <View style={styles.content}>
        <MaterialIcons name={iconName} size={28} color={COLORS.primary} />
        <Typography title={label} fontSize={SIZES.body} style={styles.label} />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(HelpTopicCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white6,
    borderColor: COLORS.gray1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: SIZES.base,
    fontWeight: "600",
    textAlign: "center",
  },
});
