import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { Ionicons } from "@expo/vector-icons";
import { goBack } from "expo-router/build/global-state/routing";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Typography from "./custom-typography";

export const Header = ({
  onBack,
  title,
}: {
  onBack?: () => void;
  title?: string;
}) => {
  const { t, isRtl } = useLocal();
  const goBackHandler = () => {
    goBack();
  };

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: scale(8),
          paddingVertical: verticalScale(8),
          backgroundColor: COLORS.white,
          borderBottomWidth: 0.5,
          borderBottomColor: COLORS.grey10,
        },
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

  return (
    <View style={dynamicStyles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack || goBackHandler}
      >
        <Ionicons
          name={isRtl ? "arrow-forward" : "arrow-back"}
          size={moderateScale(24)}
          color={COLORS.secondary}
        />
      </TouchableOpacity>
      <Typography
        title={title}
        fontSize={moderateScale(18)}
        color={COLORS.secondary}
        fontFamily="Inter-Bold"
        style={dynamicStyles.textAlign}
      />
      <View style={styles.placeholder} />
    </View>
  );
};

export const styles = StyleSheet.create({
  backButton: {
    width: scale(40),
    height: scale(30),
    borderRadius: scale(10),
    alignItems: "center",
    borderColor: COLORS.grey20,
    borderWidth: 1,
    justifyContent: "center",
    left: scale(10),
  },
  placeholder: {
    width: scale(40),
  },
});