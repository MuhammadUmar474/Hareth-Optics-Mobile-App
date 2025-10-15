import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { goBack } from "expo-router/build/global-state/routing";
import { I18nManager, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Typography from "./custom-typography";

export const Header = ({
  onBack,
  title,
}: {
  onBack?: () => void;
  title?: string;
}) => {
  const goBackHandler = () => {
    goBack();
  };
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack || goBackHandler}
      >
        <Ionicons
          name={I18nManager.isRTL ? "chevron-forward" : "chevron-back"}
          size={moderateScale(24)}
          color={COLORS.secondary}
        />
      </TouchableOpacity>
      <Typography
        title={title || "Explore"}
        fontSize={moderateScale(18)}
        color={COLORS.secondary}
        fontFamily="Inter-Bold"
      />
      <View style={styles.placeholder} />
    </View>
  );
};

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(8),
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.grey10,
  },
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
