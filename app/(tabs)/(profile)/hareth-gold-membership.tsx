import HarethGoldContent from "@/components/profile/hareth-gold";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import React from "react";
import { View } from "react-native";

const HarethGoldMembership: React.FC = () => {
  const{t}=useLocal()
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title={t("profile.menu.gold")} />
      <HarethGoldContent />
    </View>
  );
};

export default HarethGoldMembership;
