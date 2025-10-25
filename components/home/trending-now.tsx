import { COLORS } from "@/constants/colors";
import { TrendingCardData } from "@/constants/data";
import { useDynamicStyles } from "@/constants/dynamicStyles";
import { handleLargerText } from "@/constants/helper";
import { useLocal } from "@/hooks/use-lang";
import { executeHomeQuery } from "@/services/home/homeApi";
import { useLoadingStore } from "@/store/loadingStore";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { TrendingNowSkeleton } from "../skeletons";
import Typography from "../ui/custom-typography";
import SimpleOptimizedImage from "../ui/simple-optimized-image";

const BRAND_COLOR = COLORS.primary;

interface TrendingCardProps {
  data: TrendingCardData;
  onPress?: () => void;
}

type ExploreProduct = {
  id: string;
  name: string;
  price: string;
  image: string;
};

const TrendingCard: React.FC<TrendingCardProps> = ({ data, onPress }) => {
  const {t,isRtl}=useLocal();
  const commonStyles=useDynamicStyles();
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <SimpleOptimizedImage
        source={typeof data.image === 'string' ? { uri: data.image } : { uri: data.image.uri || '' }}
        style={styles.cardContent}
        contentFit="cover"
        priority="high"
      />
      <View style={styles.textContainer}>
        <Typography
          title={t("home.bestSelling")}
          fontSize={scale(12)}
          fontFamily="Poppins-Bold"
          color={COLORS.orange}
          style={styles.title}
          textAlign={commonStyles.textAlignment.textAlign}
        />
        <View style={styles.titleContainer}>
          <Typography
            title={handleLargerText(data.title, 22)}
            fontSize={scale(20)}
            color={COLORS.black}
            textAlign={commonStyles.textAlignment.textAlign}
            style={styles.subtitle}
          />
        </View>

        <TouchableOpacity
          style={[styles.shopNowButton,commonStyles.horizontal,commonStyles.alignSelf]}
          onPress={() => router.push(`/(tabs)/(explore)`)}
        >
          <Typography
            title={t("home.showNow")}
            fontSize={scale(10)}
            color={COLORS.white}
            fontFamily="Roboto-Bold"
            style={styles.shopNowButtonText}
            textAlign={commonStyles.textAlignment.textAlign}
          />
          <Feather name={isRtl ? "chevron-left" :"chevron-right"}  size={14} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const TrendingNow: React.FC = () => {
  const {t,isRtl}=useLocal();
  const commonStyles=useDynamicStyles();
  const [trendingProducts, setTrendingProducts] = useState<ExploreProduct[]>(
    []
  );
  const { isLoadingTrending, setLoadingTrending } = useLoadingStore();

  const handleFetchLatestProducts = useCallback(async () => {
    try {
      setLoadingTrending(true);
      const query = `
      query GetBestSellingEyeglasses {
        products(first: 5, sortKey: BEST_SELLING) {
          edges {
            node {
              id
              title
              handle
              description
              vendor
              productType
              tags
              totalInventory
              availableForSale
              featuredImage { url altText }
              images(first: 5) { edges { node { url altText } } }
              priceRange {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
            }
          }
        }
      }
    `;

      const data = await executeHomeQuery<{ products: { edges: any[] } }>(
        query
      );
      const mapped: ExploreProduct[] = data.products.edges.map(({ node }) => ({
        id: node.id,
        name: node.title,
        price: node.priceRange.minVariantPrice.amount,
        image:
          node.featuredImage?.url || node.images?.edges?.[0]?.node?.url || "",
      }));
      setTrendingProducts(mapped);
    } catch (error) {
      console.error("Failed to fetch trending products:", error);
    } finally {
      setLoadingTrending(false);
    }
  }, [setLoadingTrending]);

  useEffect(() => {
    handleFetchLatestProducts();
  }, [handleFetchLatestProducts]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography
          title={t("home.trendingOptics")}
          fontSize={scale(17)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          textAlign= {isRtl? "right":"left"}
          style={styles.headerTitle}
        />
      </View>

      <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={[
    styles.scrollContainer,
    commonStyles.horizontal
  ]}
  style={[
    styles.scrollView,
    commonStyles.flipHoriz
  ]}
>
  {isLoadingTrending ? (
    <View style={commonStyles.flipHoriz}>
      <TrendingNowSkeleton />
    </View>
  ) : (
    trendingProducts.map((card, index) => (
      <View 
        key={card.id}
        style={commonStyles.flipHoriz} // Flip back the content
      >
        <TrendingCard
          data={{
            id: index + 1,
            title: card.name,
            subtitle: `$${card.price}`,
            image: { uri: card.image },
            filter: "trending",
          }}
          onPress={() => router.push(`/product-details?id=${card.id}&title=${encodeURIComponent(card.name)}`)}
        />
      </View>
    ))
  )}
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
    gap: scale(10),
  },
  card: {
    width: scale(280),
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey4,
    borderRadius: scale(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.11,
    shadowRadius: 12,
    elevation: 6,
    marginHorizontal: scale(4),
    marginBottom: verticalScale(6),
  },
  accentBar: {
    height: 4,
    width: "100%",
    backgroundColor: BRAND_COLOR,
  },
  cardContent: {
    width: "100%",
    height: verticalScale(112),
    borderTopLeftRadius: scale(16),
    borderTopRightRadius: scale(16),
    overflow: "hidden",
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(16),
  },
  title: {
    marginBottom: verticalScale(4),
    fontWeight: "600",
    marginLeft: scale(3),
  },
  subtitle: {
    fontWeight: "500",
  },
  cardImage: {
    width: scale(80),
    height: scale(60),
    borderRadius: scale(12),
  },
  shopNowButton: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: scale(40),
    alignSelf: "flex-start",
  },
  shopNowButtonText: {
    fontWeight: "600",
  },
  titleContainer: {
    backgroundColor: COLORS.white,
    padding: scale(4),
    borderRadius: 100,
    marginBottom: verticalScale(4),
  },
});

export default TrendingNow;
