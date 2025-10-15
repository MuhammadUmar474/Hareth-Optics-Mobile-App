import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import OnBoardingCard from "@/components/on-board/on-boarding-card";
import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";

import { COLORS } from "@/constants/colors";
import { styles } from "@/styles/auth/onBoard.styles";

const classicImage = require("@/assets/images/classic.jpg");
const premiumImage = require("@/assets/images/premium.jpg");
const lensesImage = require("@/assets/images/lenses.jpg");
const saleImage = require("@/assets/images/sale.jpg");
const harethLogo = require("@/assets/images/hareth-icon.png");

const OnBoard = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Image source={harethLogo} style={styles.logo} contentFit="contain" />

        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Typography
            title="Hello."
            fontSize={moderateScale(28)}
            color={COLORS.primary}
            fontFamily="Inter-Bold"
            style={styles.greeting}
          />
          <Typography
            title="Pick Your Spot"
            fontSize={moderateScale(28)}
            color={COLORS.secondary}
            fontFamily="Inter-Bold"
            style={styles.mainTitle}
          />
        </Animated.View>

        <View style={styles.categoriesSection}>
          <OnBoardingCard
            title="Style for Less"
            subtitle="FLAT 30% OFF"
            image={saleImage}
            index={0}
          />

          <OnBoardingCard
            title="Classic Eyewear"
            subtitle="Frames of Elegance"
            price="Starts at KD 30 ›"
            image={classicImage}
            index={1}
          />

          <OnBoardingCard
            title="Premium Eyewear"
            subtitle="Luxury in Focus"
            price="Starts at KD 40 ›"
            image={premiumImage}
            index={2}
          />

          <OnBoardingCard
            title="Contact Lenses"
            subtitle="Floral Inspired Focus"
            price="Starts at KD 14 ›"
            image={lensesImage}
            index={3}
          />
        </View>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Button
            style={styles.homeButton}
            onPress={() => router.push("/(tabs)/(a-home)")}
          >
            <Typography
              title="Go to Home"
              fontSize={moderateScale(18)}
              color={COLORS.white}
              fontFamily="Inter-SemiBold"
            />
          </Button>
        </Animated.View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

export default OnBoard;
