import { COLORS } from "@/constants/colors";
import { GlassesBrand } from "@/constants/data";
import { homeApi, MenuItem } from "@/services/home/homeApi";
import { Feather } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";

interface BrandsProps {
  brands: GlassesBrand[];
  latest?: boolean;
}

interface BrandCardProps {
  data: GlassesBrand;
  onPress?: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ data, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      <ImageBackground
        source={{uri: data.featuredImage.url}}
        style={styles.cardContent}
        imageStyle={styles.cardImage}
        contentFit="cover"
      >
        <View style={styles.textContainer}>
          {data.title ? (
            <Typography
              title={data.title}
              fontSize={scale(14)}
              color={COLORS.black}
              style={styles.subtitle}
            />
          ) : null}
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => router.push(`/(tabs)/(explore)`)}
          >
            <Typography
              title="Shop Now"
              fontSize={scale(10)}
              color={COLORS.white}
              fontFamily="Roboto-Bold"
            />
            <Feather name="chevron-right" size={14} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const Brands: React.FC<BrandsProps> = ({ brands, latest }) => {

  const [latestProducts, setLatestProducts] = useState<MenuItem[]>([]);


  useEffect(() => {
    const fetchLatestProducts = async () => {
      const latestProducts = await homeApi.getLatestProducts();
      setLatestProducts(latestProducts.products.edges);
    };
    fetchLatestProducts();
  }, []);

  return (
    <View style={styles.container}>
      {latest ? (
        <View style={styles.header}>
          <Typography
            title="Latest and Greatest"
            fontSize={scale(17)}
            color={COLORS.black}
            fontFamily="Roboto-Bold"
            style={styles.headerTitle}
          />
          <View style={styles.subtitleContainer}>
            <Typography
              title="Drop alert"
              fontSize={scale(10)}
              color={COLORS.black}
              fontFamily="Roboto-Bold"
            />
          </View>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {latestProducts.map((card) => (
          <BrandCard
            key={card.id}
            data={card.node}
            onPress={() => router.push(`/(tabs)/(explore)`)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
  },
  header: {
    marginBottom: verticalScale(12),
    flexDirection: "row",
    gap: scale(8),
    marginTop: verticalScale(12),
  },
  headerTitle: {
    fontWeight: "600",
  },
  subtitleContainer: {
    backgroundColor: COLORS.grey3,
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(40),
  },
  scrollContainer: {
    paddingRight: scale(16),
    gap: scale(12),
  },
  card: {
    borderRadius: scale(16),
    shadowColor: COLORS.grey29,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: COLORS.white,
    marginBottom: verticalScale(6),
  },
  cardContent: {
    flexDirection: "column",
    paddingHorizontal: scale(12),
    paddingVertical: scale(16),
    justifyContent: "flex-end",
    height: scale(220),
    width: scale(160),
    borderRadius: scale(16),
    overflow: "hidden",
  },
  cardImage: {
    borderRadius: scale(16),
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  title: {
    marginBottom: verticalScale(7),
  },
  subtitle: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(10),
    fontWeight: "600",
    flexWrap: "wrap",
  },
  shopNowButton: {
    backgroundColor: COLORS.primary,
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

export default Brands;
