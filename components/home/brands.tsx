import { COLORS } from "@/constants/colors";
import { GlassesBrand } from "@/constants/data";
import { homeApi, MenuItem } from "@/services/home/homeApi";
import { useLoadingStore } from "@/store/loadingStore";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { CardSkeleton } from "../skeletons";
import Typography from "../ui/custom-typography";

interface BrandCardProps {
  data: GlassesBrand;
  onPress?: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ data, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      <Image
        source={{ uri: data.featuredImage.url }}
        style={styles.cardContent}
        contentFit="cover"
      />
      <View style={styles.textContainer}>
        {data.title ? (
          <Typography
            title={data.title}
            fontSize={scale(14)}
            color={COLORS.black}
            style={styles.subtitle}
            numberOfLines={2}
            ellipsizeMode="tail"
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
    </TouchableOpacity>
  );
};

const Brands: React.FC<BrandsProps> = ({ brands, latest }) => {
  const [latestProducts, setLatestProducts] = useState<MenuItem[]>([]);
  const { isLoadingLatestProducts, setLoadingLatestProducts } = useLoadingStore();

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoadingLatestProducts(true);
        const latestProducts = await homeApi.getLatestProducts();
        setLatestProducts(latestProducts.products.edges);
      } catch (error) {
        console.error("Failed to fetch latest products:", error);
      } finally {
        setLoadingLatestProducts(false);
      }
    };
    fetchLatestProducts();
  }, [setLoadingLatestProducts]);

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
        {isLoadingLatestProducts ? (
          <CardSkeleton />
        ) : (
          latestProducts.map((card, index) => (
            <BrandCard
              key={card.id || `product-${index}`}
              data={card.node}
              onPress={() => {
                router.push(
                  `/product-details?id=${card.node.id}&title=${encodeURIComponent(card.node.title)}`
                );
              }}
            />
          ))
        )}
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
    width: scale(160),
  },
  cardContent: {
    flexDirection: "column",
    paddingHorizontal: scale(12),
    paddingVertical: scale(16),
    justifyContent: "flex-end",
    height: scale(120),
    borderTopLeftRadius: scale(16),
    borderTopRightRadius: scale(16),
    overflow: "hidden",
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: scale(12),
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
