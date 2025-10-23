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

  const isEvenIndex = index % 2 === 0;

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
        flexDirection: isEvenIndex ? "row" : "row-reverse",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Button
        style={[
          styles.categoryCard,
          
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.categoryCardContent}>
          <View style={styles.categoryTextSection}>
            <Typography
              title={title}
              fontSize={moderateScale(16)}
              color={COLORS.secondary}
              fontFamily="Inter-Bold"
              style={styles.categoryTitle}
            />
            <Typography
              title={subtitle}
              fontSize={moderateScale(12)}
              color={COLORS.black}
              fontFamily="Inter-Regular"
              style={styles.categorySubtitle}
            />
            {price && (
              <Typography
                title={price}
                fontSize={moderateScale(15)}
                color={COLORS.primary}
                fontFamily="Inter-SemiBold"
                style={styles.priceText}
              />
            )}
          </View>
        </View>
        <ImageBackground
        source={image}
        style={[
          styles.categoryImageContainer,
          {
            marginLeft: isEvenIndex ? scale(6) : 0,
            marginRight: isEvenIndex ? 0 : scale(6),
          },
        ]}
        imageStyle={styles.categoryImageStyle}
        resizeMode="cover"
      />
      </Button>
     
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    marginVertical: verticalScale(8),
    borderRadius: scale(14),
    backgroundColor: COLORS.white,
    ...COLORS.shadow,
    shadowColor: COLORS.primary,
    flex:1,
    borderTopColor:COLORS.primary,
    borderTopWidth:4,
    flexDirection:"row",
    justifyContent:"space-between",
  },
  categoryCardContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    alignSelf: "flex-start",
  },
  categoryTextSection: {
    justifyContent: "center",
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
    height: verticalScale(70),
    width: verticalScale(80),
    borderRadius: scale(14),
    overflow: "hidden",
    backgroundColor: "blue",
  },
  categoryImageStyle: {
    borderRadius: scale(8),
  },
});

export default OnBoardingCard;
