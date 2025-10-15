import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Typography from "../ui/custom-typography";

interface TimeSlotChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const TimeSlotChip: React.FC<TimeSlotChipProps> = ({ label, selected, onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.chip, selected ? styles.chipSelected : styles.chipDefault, style]}
    >
      <Typography
        title={label}
        fontSize={SIZES.caption}
        color={selected ? COLORS.white : COLORS.secondary}
        style={{ fontWeight: "700" }}
      />
    </TouchableOpacity>
  );
};

export default memo(TimeSlotChip);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.white,
  },
  chipDefault: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
  },
});


