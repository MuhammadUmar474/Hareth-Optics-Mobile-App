import HarethGoldContent from "@/components/profile/hareth-gold";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import React from "react";
import { View } from "react-native";

const HarethGoldMembership: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title="Hareth Gold" />
      <HarethGoldContent />
    </View>
  );
};

export default HarethGoldMembership;
