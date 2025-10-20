import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import React from "react";
import { View } from "react-native";

const TrackOrder: React.FC = () => {
  const {t}=useLocal()
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title={t("profile.menu.trackOrder")} />
      <View style={{ padding: SIZES.padding }}>
        <CustomTextInput
          label="Order ID"
          placeholder="Enter Order ID"
          height={45}
        />
        <Button
          style={{ marginTop: SIZES.padding, borderRadius: 10, height: 45 }}
          color="primary"
        >
          <Typography
            title="Check Status"
            color={COLORS.white}
            style={{ fontWeight: "700" }}
          />
        </Button>
      </View>
    </View>
  );
};

export default TrackOrder;
