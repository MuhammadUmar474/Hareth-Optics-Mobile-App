import Button from "@/components/ui/custom-button";
import CustomTextInput from "@/components/ui/custom-text-input";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const ViewGiftCardBalance: React.FC = () => {
  const [giftCode, setGiftCode] = React.useState<string>("");
  const balanceAmount = 120.0;

  return (
    <View style={styles.screen}>
      <Header title="Gift Card Balance" />

      <View style={styles.content}>
        <Typography
          title="Your current balance"
          fontSize={SIZES.body}
          color={COLORS.grayText}
          textAlign="center"
        />

        <Typography
          title={`$${balanceAmount.toFixed(2)}`}
          fontSize={36}
          color={COLORS.secondary}
          style={styles.balance}
          textAlign="center"
        />

        <CustomTextInput
          placeHolder="Enter gift card code"
          value={giftCode}
          onChangeText={setGiftCode}
          containerStyle={styles.inputContainer}
          placeholderTextColor={COLORS.grey10}
          height={56}
        />

        <Button
          color="primary"
          shadow
          style={styles.addButton}
          onPress={() => {}}
        >
          <Typography
            title="Add Gift Card"
            color={COLORS.white}
            fontSize={SIZES.title}
          />
        </Button>

        <TouchableOpacity style={styles.historyRow} activeOpacity={0.8}>
          <Typography
            title="View Transaction History"
            color={COLORS.primary}
            fontSize={SIZES.title}
          />
          <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SIZES.padding },
  balance: { marginTop: 4, marginBottom: SIZES.padding },
  inputContainer: { marginTop: SIZES.padding },
  addButton: {
    marginTop: SIZES.padding,
    paddingVertical: 14,
    borderRadius: 14,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 8,
    marginTop: SIZES.padding,
  },
});

export default ViewGiftCardBalance;
