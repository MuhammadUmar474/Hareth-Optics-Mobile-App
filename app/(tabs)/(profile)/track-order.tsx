import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const TrackOrder: React.FC = () => {
  const { t, isRtl } = useLocal();

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title={t("profile.menu.trackOrder")} />
      <View style={{ padding: SIZES.padding }}>
        <CustomTextInput
          label={t("orderDetail.orderId")}
          placeholder={t("orderDetail.enterOrderId")}
          height={45}
          labelStyles={{textAlign:isRtl ? "right" : "left"}}
          textAlign={isRtl ? "right" : "left"}
          />
        <Button
          style={{ marginTop: SIZES.padding, borderRadius: 10, }}
          color="primary"
          >
          <Typography
            title={t("orderDetail.checkStatus")}
            color={COLORS.white}
            style={[dynamicStyles.textAlign, { fontWeight: "700" }]}
          />
        </Button>
      </View>
    </View>
  );
};

export default TrackOrder;