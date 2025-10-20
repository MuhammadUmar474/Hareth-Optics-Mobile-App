import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

interface VirtualTryOnProps {
  onTryNow?: () => void;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ onTryNow }) => {
  const {isRtl,t} = useLocal();
  const dynamicStyles = useMemo(()=>
  StyleSheet.create({
    contentContainer: {
      flexDirection:isRtl?"row-reverse" : "row",
      alignItems: "center",
      flex: 1,
      gap: scale(14),
    },
    container: {
      flexDirection:isRtl?"row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLORS.lightSkyBlue,
      paddingVertical: verticalScale(16),
      paddingHorizontal: scale(16),
      borderRadius: scale(12),
      marginBottom: verticalScale(24),
    },
  
  }),[isRtl])
  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.contentContainer}>
        <Image
          source={require("@/assets/images/home/cube-focus.png")}
          style={styles.icon}
          contentFit="contain"
        />
        <View style={styles.textContainer}>
          <Typography
            title={t("eyeglassesDetails.virtualTryOn")}
            fontSize={scale(16)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            textAlign={isRtl ? "right":"left"}
            style={styles.title}
          />
          <Typography
            title={t("eyeglassesDetails.seeHowTheyLook")}
            fontSize={scale(10)}
            color={COLORS.grey16}
            fontFamily="Roboto-Regular"
            textAlign={isRtl ? "right":"left"}
            style={styles.subtitle}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.tryNowButton} onPress={onTryNow}>
        <Typography
          title={t("eyeglassesDetails.tryNow")}
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
