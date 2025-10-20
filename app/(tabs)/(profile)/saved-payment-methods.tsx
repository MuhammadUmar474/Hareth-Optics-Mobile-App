import PaymentCard from "@/components/profile/payment-card";
import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import React from "react";
import { View } from "react-native";

const SavedPaymentMethods: React.FC = () => {
  const{t}=useLocal()
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title={t("profile.menu.savedPayments")} />
      <View style={{ padding: SIZES.padding }}>
        <Typography
          title="Saved Cards"
          fontSize={SIZES.title}
          style={{ fontWeight: "bold", marginBottom: 20 }}
        />
        <PaymentCard />
        <PaymentCard />
        <Button
          color="primary"
          style={{ marginTop: 20, borderRadius: 10, height: 45 }}
        >
          <Typography
            title="Add Card"
            fontSize={SIZES.header}
            color={COLORS.white}
            style={{ fontWeight: "bold" }}
          />
        </Button>
      </View>
    </View>
  );
};

export default SavedPaymentMethods;
