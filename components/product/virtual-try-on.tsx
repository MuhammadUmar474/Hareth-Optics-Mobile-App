import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

interface VirtualTryOnProps {
  onTryNow?: () => void;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ onTryNow }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require("@/assets/images/home/cube-focus.png")}
          style={styles.icon}
          contentFit="contain"
        />
        <View style={styles.textContainer}>
          <Typography
            title="Virtual Try-On"
            fontSize={scale(16)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={styles.title}
          />
          <Typography
            title="See how they look on you!"
            fontSize={scale(10)}
            color={COLORS.grey16}
            fontFamily="Roboto-Regular"
            style={styles.subtitle}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.tryNowButton} onPress={onTryNow}>
        <Typography
          title="Try Now"
          fontSize={scale(14)}
          color={COLORS.white}
          fontFamily="Roboto-Bold"
          style={styles.tryNowButtonText}
        />
      </TouchableOpacity>
    </View>
  );
};

export default VirtualTryOn;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.lightSkyBlue,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    marginBottom: verticalScale(24),
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(14),
  },
  icon: {
    width: scale(36),
    height: scale(36),
    tintColor: COLORS.primary,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: verticalScale(2),
    fontWeight: "600",
  },
  subtitle: {
    lineHeight: scale(16),
  },
  tryNowButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(10),
    borderRadius: scale(50),
    alignItems: "center",
    justifyContent: "center",
  },
  tryNowButtonText: {
    fontWeight: "600",
  },
});
