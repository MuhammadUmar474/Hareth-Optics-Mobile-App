import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import React from "react";
import { StyleSheet, View } from "react-native";

export interface StatRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const StatRow: React.FC<StatRowProps> = ({ label, value, highlight }) => {
  return (
    <View style={styles.statRow}>
      <Typography
        title={label}
        fontSize={SIZES.body}
        color={highlight ? COLORS.primary : COLORS.secondary}
      />
      <Typography
        title={value}
        fontSize={SIZES.h3}
        color={highlight ? COLORS.primary : COLORS.secondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
});

export default StatRow;
