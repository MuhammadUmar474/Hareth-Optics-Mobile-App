import BestSelling from "@/components/home/best-selling";
import Brands from "@/components/home/brands";
import StickyHeader from "@/components/home/header";
import NearByStores from "@/components/home/near-by-stores";
import OurPromiseComponent from "@/components/home/our-promise";
import PaymentMethods from "@/components/home/payment-methods";
import ProductCard, { ProductData } from "@/components/home/product-card";
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
import { MenuItem, homeApi } from "@/services/home/homeApi";
import { prescriptionToCartAttributes, useCartStore } from "@/store/cartStore";
import { useCommonStore } from "@/store/commonStore";
import { useLoadingStore } from "@/store/loadingStore";
import { useAuthStore } from "@/store/shopifyStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useWishlistActions } from "@/utils/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
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
  variantId?: string;
  compareAtPrice?: string;
};

const HomeScreen = () => {
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
  const { initializeCart, createCart } = useCartStore();
  const { initializeWishlist, setCurrentUser: setWishlistCurrentUser } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  const { isInWishlist, toggleWishlist } = useWishlistActions();
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set());
  const [successProducts, setSuccessProducts] = useState<Set<string>>(new Set());
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

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
    const initializeStores = async () => {
      if (isAuthenticated && user?.email) {
        await initializeCart();
        await setWishlistCurrentUser(user.email);
        initializeWishlist();
      }
    };
    
    initializeStores();
  }, [isAuthenticated, user?.email, initializeCart, setWishlistCurrentUser, initializeWishlist]);

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

  const onProductPress = (title: string) => {
    router.push({
      pathname: "/(tabs)/(explore)",
      params: { category: title },
    });
  };

  const fetchProducts = async (
    categoryHandle: string,
    loadMore = false,
    cursor?: string | null
  ) => {
    if (!categoryHandle) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { collection } = await homeApi.getProductsByCollection(
        categoryHandle,
        20,
        loadMore && cursor ? cursor : undefined
      );

      const edges = collection?.products.edges ?? [];

      const mapped: ExploreProduct[] = edges.map(({ node }) => ({
        id: node.id,
        name: handleLargerText(node.title, 20),
        price: node.priceRange.minVariantPrice.amount,
        image:
          node.featuredImage?.url || node.images?.edges?.[0]?.node?.url || "",
        category: node.productType ?? "",
        variantId: node.variants?.edges?.[0]?.node?.id,
        compareAtPrice: node.variants?.edges?.[0]?.node?.compareAtPrice?.amount,
      }));

      setProducts((prev) => (loadMore ? [...prev, ...mapped] : mapped));
      setEndCursor(collection?.products.pageInfo?.endCursor ?? null);
      setHasNextPage(collection?.products.pageInfo?.hasNextPage ?? false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setEndCursor(null);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (handle) {
      setProducts([]);
      setEndCursor(null);
      setHasNextPage(false);
      fetchProducts(handle, false);
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [handle]);

  // Convert ExploreProduct to ProductData format
  const convertToProductData = (item: ExploreProduct): ProductData => {
    return {
      id: item.id,
      title: item.name,
      handle: item.id.replace('gid://shopify/Product/', ''),
      description: '',
      vendor: '',
      productType: item.category,
      tags: [],
      totalInventory: 0,
      availableForSale: true,
      featuredImage: {
        url: item.image,
        altText: item.name
      },
      images: {
        edges: [{
          node: {
            url: item.image,
            altText: item.name
          }
        }]
      },
      variants: {
        edges: [{
          node: {
            id: item.variantId || item.id,
            title: 'Default',
            sku: '',
            availableForSale: true,
            price: {
              amount: item.price,
              currencyCode: 'KD'
            },
            compareAtPrice: {
              amount: item.compareAtPrice || item.price,
              currencyCode: 'KD'
            },
            selectedOptions: [],
            image: {
              url: item.image,
              altText: item.name
            }
          }
        }]
      },
      priceRange: {
        minVariantPrice: {
          amount: item.price,
          currencyCode: 'KD'
        },
        maxVariantPrice: {
          amount: item.price,
          currencyCode: 'KD'
        }
      }
    };
  };

  const handleAddToCart = async (product: ProductData) => {
    const productId = product.id;
    setLoadingProducts((prev) => new Set(prev).add(productId));

    try {
      const firstVariant = product.variants?.edges?.[0]?.node;
      if (!firstVariant) {
        console.error("No variants available for product:", product.title);
        return;
      }

      const cartLine = {
        merchandiseId: firstVariant.id,
        quantity: 1,
        attributes: prescriptionToCartAttributes(
          {
            lensType: "Single Vision",
            leftEye: "",
            rightEye: "",
            lensTint: "Clear",
            blueLightFilter: "No",
          },
          product.id
        ),
      };

      const success = await createCart([cartLine]);

      if (success) {
        setSuccessProducts((prev) => new Set(prev).add(productId));
        setTimeout(() => {
          setSuccessProducts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
          setAddedProducts((prev) => new Set(prev).add(productId));
        }, 2000);
      } else {
        console.error("❌ Home: Failed to add to cart");
      }
    } catch (error) {
      console.error("❌ Home: Error adding to cart:", error);
    } finally {
      setLoadingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleToggleWishlist = (product: ProductData) => {
    const price = parseFloat(
      product.priceRange?.minVariantPrice?.amount || "0"
    );
    const numericId = parseInt(product.id.replace(/\D/g, ""), 10);
    const firstVariant = product.variants?.edges?.[0]?.node;
    toggleWishlist({
      id: numericId,
      name: product.title,
      price: price,
      image: { uri: product.featuredImage?.url || "" },
      variantId: firstVariant?.id,
    });
  };

  const renderProduct = ({
    item,
    index,
  }: {
    item: ExploreProduct;
    index: number;
  }) => {
    const productData = convertToProductData(item);
    const numericId = parseInt(item.id.replace(/\D/g, ""), 10);
    
    return (
      <View style={{ width: '50%', paddingHorizontal: 8 }}>
        <ProductCard
          product={productData}
          onPress={() => {
            router.push(
              `/product-details?id=${item.id}&title=${encodeURIComponent(
                item.name
              )}`
            );
          }}
          onAddToCart={() => handleAddToCart(productData)}
          onToggleWishlist={() => handleToggleWishlist(productData)}
          isFavorited={isInWishlist(numericId)}
          isLoading={loadingProducts.has(item.id)}
          showSuccess={successProducts.has(item.id)}
          isAdded={addedProducts.has(item.id)}
        />
      </View>
    );
  };

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
          {handle ? (
            // When a category is selected, only show products or "no data" message
            <Animated.View
              style={[styles.content, { opacity: headerFadeAnim }]}
            >
              {loading && products.length === 0 ? (
                <View style={styles.centerContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              ) : products.length > 0 ? (
                <FlatList
                  data={products}
                  renderItem={renderProduct}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  numColumns={2}
                  columnWrapperStyle={styles.productRow}
                  contentContainerStyle={styles.productsContainer}
                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={0.5}
                  onEndReached={() => {
                    if (hasNextPage && !loading) {
                      fetchProducts(handle, true, endCursor);
                    }
                  }}
                  ListFooterComponent={
                    loading ? (
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : null
                  }
                />
              ) : (
                <View style={styles.centerContainer}>
                  <Ionicons
                    name="folder-open-outline"
                    size={64}
                    color={COLORS.grey3}
                  />
                  <Typography
                    title="No Products Found"
                    fontSize={moderateScale(18)}
                    color={COLORS.black}
                    style={{ marginTop: verticalScale(16) }}
                  />
                </View>
              )}
            </Animated.View>
          ) : (
            // When no category is selected, show all home components
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
  centerContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: verticalScale(50),
  },
});
