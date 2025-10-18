import { COLORS } from "@/constants/colors";
import { TrendingCardData, trendingCards } from "@/constants/data";
import { Feather } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";

const BRAND_COLOR = COLORS.primary;

interface TrendingCardProps {
  data: TrendingCardData;
  onPress?: () => void;
}

const TrendingCard: React.FC<TrendingCardProps> = ({ data, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <ImageBackground source={data.image} style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Typography
            title={data.title}
            fontSize={scale(12)}
            fontFamily="Poppins-Bold"
            color={COLORS.orange}
            style={styles.title}
          />
          {data.subtitle ? (
            <Typography
              title={data.subtitle}
              fontSize={scale(20)}
              color={COLORS.white}
              style={styles.subtitle}
            />
          ) : null}
          <TouchableOpacity style={styles.shopNowButton} onPress={() => router.push(`/(tabs)/(explore)`)}>
            <Typography
              title="Shop Now"
              fontSize={scale(10)}
              color={COLORS.black}
              fontFamily="Roboto-Bold"
            />
            <Feather name="chevron-right" size={14} color={COLORS.black} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const TrendingNow: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography
          title="#Trending at Hareth Oticps"
          fontSize={scale(17)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          style={styles.headerTitle}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        {trendingCards.map((card) => (
          <TrendingCard
            key={card.id}
            data={card}
            onPress={() => router.navigate("/product-details")}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  headerTitle: {
    fontWeight: "600",
  },
  header: {
    marginBottom: verticalScale(16),
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  scrollView: {
    marginBottom: verticalScale(16),
  },
  scrollContainer: {
    paddingRight: scale(16),
    gap: scale(12),
  },
  card: {
    width: scale(280),
    backgroundColor: COLORS.white,
    borderRadius: scale(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  accentBar: {
    height: 4,
    width: "100%",
    backgroundColor: BRAND_COLOR,
  },
  cardContent: {
    flexDirection: "row",
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    alignItems: "center",
    gap: scale(16),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: verticalScale(7),
  },
  subtitle: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(10),
    fontWeight: "600",
  },
  cardImage: {
    width: scale(80),
    height: scale(60),
    borderRadius: scale(12),
  },
  shopNowButton: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(5),
    borderRadius: scale(40),
    alignSelf: "flex-start",
    marginBottom: verticalScale(16),
  },
});

export default TrendingNow;
