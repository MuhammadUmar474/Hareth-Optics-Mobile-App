import { AnimatedProductCard } from "@/components/explore/animated-product-card";
import BestSelling from "@/components/home/best-selling";
import Brands from "@/components/home/brands";
import StickyHeader from "@/components/home/header";
import NearByStores from "@/components/home/near-by-stores";
import OurPromiseComponent from "@/components/home/our-promise";
import PaymentMethods from "@/components/home/payment-methods";
import Products from "@/components/home/products";
import SearchResults from "@/components/home/search-results";
import TrendingNow from "@/components/home/trending-now";
import {
  CardSkeleton,
  ExploreCardSkeleton,
  TrendingNowSkeleton,
} from "@/components/skeletons";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import {
  glassesBrandsData,
  ourPromiseData,
  paymentMethodTypes,
  storeBenefits,
} from "@/constants/data";
import { handleLargerText } from "@/constants/helper";
import { useLocal } from "@/hooks/use-lang";
import { MenuItem, homeApi } from "@/services/home/homeApi";
import { useCommonStore } from "@/store/commonStore";
import { useLoadingStore } from "@/store/loadingStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
type ExploreProduct = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
};

const HomeScreen = () => {
  const { t } = useLocal();
  const [isPlaying, setIsPlaying] = useState(false);
  const [mainCategories, setMainCategories] = useState<MenuItem[]>([]);
  const [handle, setHandle] = useState<string>("");
  const [products, setProducts] = useState<ExploreProduct[]>([]);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const clearSearchRef = useRef<(() => void) | null>(null);
  const setCategories = useCommonStore((state) => state.setCategories);
  const { isLoadingCategories, setLoadingCategories } = useLoadingStore();

  const handleGetCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const categories = await homeApi.getCategories();
      const colllectionCategories = categories.filter(
        (category) => category.type === "COLLECTION"
      );
      setMainCategories(colllectionCategories);
      setCategories(colllectionCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoadingCategories(false);
      setInitialLoading(false);
    }
  }, [setLoadingCategories, setCategories]);

  useEffect(() => {
    handleGetCategories();
  }, [handleGetCategories]);

  useEffect(() => {
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [headerFadeAnim]);

  const player = useVideoPlayer(
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    (player) => {
      player.loop = false;
    }
  );

  const handlePlayPress = () => {
    if (player) {
      player.play();
      setIsPlaying(true);
    }
  };

  player.addListener("playingChange", (newIsPlaying) => {
    setIsPlaying(newIsPlaying.isPlaying);
  });

  const onProductPress = () => {
    router.navigate("/(tabs)/(explore)");
  };

  const fetchProducts = useCallback(
    async (loadMore = false) => {
      setLoading(true);
      const { collection } = await homeApi.getProductsByCollection(
        handle,
        20,
        loadMore ? endCursor ?? undefined : undefined
      );

      const edges = collection?.products.edges ?? [];

      const mapped: ExploreProduct[] = edges.map(({ node }) => ({
        id: node.id,
        name: handleLargerText(node.title, 20),
        price: node.priceRange.minVariantPrice.amount,
        image:
          node.featuredImage?.url || node.images?.edges?.[0]?.node?.url || "",
        category: node.productType ?? "",
      }));

      setProducts((prev) => (loadMore ? [...prev, ...mapped] : mapped));

      setEndCursor(collection?.products.pageInfo?.endCursor ?? null);
      setHasNextPage(collection?.products.pageInfo?.hasNextPage ?? false);
      setLoading(false);
    },
    [handle, endCursor]
  );

  useEffect(() => {
    fetchProducts(false); // initial load
  }, [fetchProducts]);

  const renderProduct = ({
    item,
    index,
  }: {
    item: ExploreProduct;
    index: number;
  }) => (
    <AnimatedProductCard
      item={item}
      index={index}
      // onToggleFavorite={toggleFavorite}
      // isFavorite={favorites.has(item.id)}
    />
  );

  // Show initial loading skeleton while data is being fetched
  if (initialLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerSkeleton}>
          <View style={styles.headerSkeletonContent} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TrendingNowSkeleton />
          <ExploreCardSkeleton />
          <CardSkeleton />
        </ScrollView>
      </View>
    );
  }

  const handleSearchStateChange = (
    isSearching: boolean,
    query: string = ""
  ) => {
    setIsSearching(isSearching);
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
    clearSearchRef.current?.();
  };

  return (
    <View style={styles.container}>
      <StickyHeader
        categories={mainCategories}
        setHandle={setHandle}
        onSearchStateChange={handleSearchStateChange}
        clearSearchRef={clearSearchRef}
      />
      {isSearching ? (
        <SearchResults
          searchQuery={searchQuery}
          onClose={handleClearSearch}
          onClearInput={handleClearSearch}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {products.length > 0 ? (
            <Animated.View
              style={[styles.content, { opacity: headerFadeAnim }]}
            >
              <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.productRow}
                contentContainerStyle={styles.productsContainer}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator size="large" color={COLORS.primary} />
                    ) : (
                      <Text>No products found</Text>
                    )}
                  </View>
                }
                onEndReached={() => {
                  if (hasNextPage && !loading) {
                    fetchProducts(true); // load more
                  }
                }}
                ListFooterComponent={
                  loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                  ) : null
                }
              />
            </Animated.View>
          ) : (
            <>
              <TrendingNow />

              {mainCategories.map((category) => (
                <Products
                  key={category.id}
                  productCategory={category.items || []}
                  onProductPress={onProductPress}
                  title={category.title}
                  loading={isLoadingCategories}
                />
              ))}

              <PaymentMethods paymentMethods={paymentMethodTypes} />

              <Brands brands={glassesBrandsData} />

              <OurPromiseComponent
                promises={ourPromiseData}
                title="Hareth Optics Promise"
              />

              <BestSelling />

              <Brands brands={glassesBrandsData} latest />

              <NearByStores />

              <OurPromiseComponent
                promises={storeBenefits}
                title="Store Benefits"
              />

              <View style={styles.videoContainer}>
                <View style={styles.videoWrapper}>
                  <VideoView
                    player={player}
                    style={styles.video}
                    allowsFullscreen
                    allowsPictureInPicture
                    nativeControls
                  />
                  {!isPlaying && (
                    <>
                      <TouchableOpacity
                        style={styles.overlayContainer}
                        onPress={handlePlayPress}
                        activeOpacity={0.9}
                      >
                        <View style={styles.playButton}>
                          <Ionicons
                            name="play"
                            size={20}
                            color={COLORS.black}
                          />
                        </View>
                      </TouchableOpacity>
                      <Typography
                        title="FROM THE FACTORY STRAIGHT TO YOU"
                        fontSize={moderateScale(14)}
                        color={COLORS.white}
                        style={styles.overlayText}
                      />
                    </>
                  )}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 2,
  },
  videoContainer: {
    width: "100%",
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(130),
  },
  videoWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: scale(8),
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  overlayText: {
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  content: {
    flex: 1,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
  productsContainer: {
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(100),
  },
  headerSkeleton: {
    height: verticalScale(60),
    backgroundColor: COLORS.white,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey4,
  },
  headerSkeletonContent: {
    height: verticalScale(36),
    backgroundColor: COLORS.grey4,
    borderRadius: scale(8),
  },
});
