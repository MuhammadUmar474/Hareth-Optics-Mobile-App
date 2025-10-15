import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

const Divider: React.FC = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.grey20,
  },
});

export default Divider;
