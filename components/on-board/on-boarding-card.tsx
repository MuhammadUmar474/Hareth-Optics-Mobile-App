import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    ImageBackground,
    ImageSourcePropType,
    StyleSheet,
    View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";

interface OnBoardingCardProps {
  title: string;
  subtitle: string;
  price?: string;
  image: ImageSourcePropType;
  index: number;
}

const OnBoardingCard: React.FC<OnBoardingCardProps> = ({
  title,
  subtitle,
  price,
  image,
  index,
}) => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered fade-in animation for each card
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 600,
      delay: 300 + index * 150,
      useNativeDriver: true,
    }).start();
  }, [index]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const onPress = () => {
    router.push("/(tabs)/(explore)");
  };

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Button
        style={styles.categoryCard}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.categoryCardContent}>
          <View style={styles.categoryTextSection}>
            <Typography
              title={title}
              fontSize={moderateScale(18)}
              color={COLORS.secondary}
              fontFamily="Inter-Bold"
              style={styles.categoryTitle}
            />
            <Typography
              title={subtitle}
              fontSize={moderateScale(14)}
              color={COLORS.black}
              fontFamily="Inter-Regular"
              style={styles.categorySubtitle}
            />
            {price && (
              <Typography
                title={price}
                fontSize={moderateScale(16)}
                color={COLORS.primary}
                fontFamily="Inter-SemiBold"
                style={styles.priceText}
              />
            )}
          </View>
          <ImageBackground
            source={image}
            style={styles.categoryImageContainer}
            imageStyle={styles.categoryImageStyle}
          />
        </View>
      </Button>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    marginVertical: verticalScale(8),
    borderRadius: scale(16),
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.primary,
    borderTopWidth: verticalScale(4),
    ...COLORS.shadow,
    shadowColor: COLORS.primary,
  },
  categoryCardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(5),
    paddingVertical: verticalScale(16),
    minHeight: verticalScale(96),
  },
  categoryTextSection: {
    flex: 1,
    paddingRight: scale(16),
  },
  categoryTitle: {
    marginBottom: verticalScale(4),
  },
  categorySubtitle: {
    marginBottom: verticalScale(8),
    lineHeight: verticalScale(18),
  },
  priceText: {
    marginTop: verticalScale(4),
  },
  categoryImageContainer: {
    width: scale(90),
    height: verticalScale(64),
    borderRadius: scale(8),
    overflow: "hidden",
  },
  categoryImageStyle: {
    borderRadius: scale(8),
  },
});

export default OnBoardingCard;
