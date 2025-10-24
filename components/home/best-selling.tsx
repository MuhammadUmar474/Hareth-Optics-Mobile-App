import { COLORS } from "@/constants/colors";
import { BestSellingProduct } from "@/constants/data";
import { executeHomeQuery, MenuItem } from "@/services/home/homeApi";
import { prescriptionToCartAttributes, useCartStore } from "@/store/cartStore";
import { useLoadingStore } from "@/store/loadingStore";
import { useWishlistActions } from "@/utils/wishlist";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { CardSkeleton } from "../skeletons";
import Typography from "../ui/custom-typography";
import SimpleOptimizedImage from "../ui/simple-optimized-image";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ProductCardProps {
  product: BestSellingProduct;
  onPress?: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isFavorited: boolean;
  isLoading?: boolean;
  showSuccess?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isFavorited,
  isLoading = false,
  showSuccess = false,
}) => {
  const { isInWishlist } = useWishlistActions();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showSuccess) {
      // Button pulse animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Checkmark animation
      Animated.parallel([
        Animated.spring(checkmarkScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Hide checkmark after delay
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(checkmarkScale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(checkmarkOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1500);
    }
  }, [showSuccess]);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onToggleWishlist}
        >
          <Animated.View>
            <Ionicons
              name={isInWishlist(product.id) ? "heart" : "heart-outline"}
              size={moderateScale(20)}
              color={
                isInWishlist(product.id) ? COLORS.danger : COLORS.secondary
              }
            />
          </Animated.View>
        </TouchableOpacity>

        <SimpleOptimizedImage
          source={{ uri: product.featuredImage.url }}
          style={styles.productImage}
          contentFit="cover"
          priority="high"
        />

        <View style={styles.infoContainer}>
          <Typography
            title={product.title}
            fontSize={scale(12)}
            fontFamily="Roboto-Bold"
            color={COLORS.black7}
            style={styles.productName}
            numberOfLines={2}
          />
          <View style={styles.priceContainer}>
            <Typography
              title={
                product.priceRange.minVariantPrice.amount +
                " " +
                product.priceRange.minVariantPrice.currencyCode
              }
              fontSize={scale(14)}
              fontFamily="Roboto-Bold"
              color={COLORS.primary}
            />
            <Typography
              title={
                product.priceRange.minVariantPrice.amount +
                " " +
                product.priceRange.minVariantPrice.currencyCode
              }
              fontSize={scale(11)}
              color={COLORS.grey10}
              style={styles.originalPrice}
            />
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.addToCart,
                isLoading && styles.addToCartDisabled,
                showSuccess && styles.addToCartSuccess,
              ]}
              onPress={onAddToCart}
              disabled={isLoading || showSuccess}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : showSuccess ? (
                <Animated.View
                  style={{
                    transform: [{ scale: checkmarkScale }],
                    opacity: checkmarkOpacity,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(6),
                  }}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={scale(18)}
                    color={COLORS.white}
                  />
                  <Typography
                    title="Added!"
                    fontSize={scale(12)}
                    color={COLORS.white}
                    fontFamily="Roboto-Bold"
                  />
                </Animated.View>
              ) : (
                <Typography
                  title="Add to Cart"
                  fontSize={scale(12)}
                  color={COLORS.white}
                  fontFamily="Roboto-Bold"
                />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BestSelling: React.FC = () => {
  const { createCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistActions();
  const { isLoadingBestSelling, setLoadingBestSelling } = useLoadingStore();
  const [bestSellingProducts, setBestSellingProducts] = useState<MenuItem[]>(
    []
  );

  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(
    new Set()
  );
  const [successProducts, setSuccessProducts] = useState<Set<string>>(
    new Set()
  );

  const handleAddToCart = async (product: any) => {
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
        }, 2000);
      } else {
        console.error("❌ BestSelling: Failed to add to cart");
      }
    } catch (error) {
      console.error("❌ BestSelling: Error adding to cart:", error);
    } finally {
      setLoadingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleToggleWishlist = (product: any) => {
    const price = parseFloat(
      product.priceRange?.minVariantPrice?.amount || "0"
    );
    toggleWishlist({
      id: product.id,
      name: product.title,
      price: price,
      image: { uri: product.featuredImage?.url },
    });
  };

  const handleFetchLatestProducts = async () => {
    try {
      setLoadingBestSelling(true);
      const query = `
        query GetBestSellingEyeglasses {
    products(first: 20, sortKey: BEST_SELLING, query: \"product_type:eyeglasses\") {
      edges {
        node {
          id
          title
          handle
          description
          createdAt
          featuredImage {
            url
            altText
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 10) {
            edges {
              node {
                title
                sku
                availableForSale
                selectedOptions {
                  name
                  value
                }
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          collections(first: 1) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
      }
    }
}
      `;

      const data = await executeHomeQuery<{ products: { edges: any[] } }>(
        query
      );
      setBestSellingProducts(data.products.edges);
    } catch (error) {
      console.error("Failed to fetch best selling products:", error);
    } finally {
      setLoadingBestSelling(false);
    }
  };

  useEffect(() => {
    handleFetchLatestProducts();
  }, [setLoadingBestSelling]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography
          title="Bestselling Eyeglasses"
          fontSize={scale(17)}
          fontFamily="Poppins-Bold"
          color={COLORS.secondary}
          style={styles.headerTitle}
        />
      </View>

      <FlatList
        data={isLoadingBestSelling ? [] : bestSellingProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item.node}
            onPress={() => {
              router.push(
                `/product-details?id=${item.node.id}&title=${encodeURIComponent(
                  item.node.collections.edges[0].node.title
                )}`
              );
            }}
            onAddToCart={() => handleAddToCart(item.node)}
            onToggleWishlist={() => handleToggleWishlist(item.node)}
            isFavorited={isInWishlist(item.node.id)}
            isLoading={loadingProducts.has(item.node.id)}
            showSuccess={successProducts.has(item.node.id)}
          />
        )}
        ListEmptyComponent={isLoadingBestSelling ? <CardSkeleton /> : null}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.viewAllButtons}>
        <TouchableOpacity
          style={[styles.viewAllButtonContainer, styles.eyeglassesButton]}
          onPress={() => router.push("/(tabs)/(explore)")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonGradient}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonSecondaryContent}>
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name="visibility"
                    size={24}
                    color={COLORS.white}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Typography
                    title="Eyeglasses"
                    fontSize={scale(16)}
                    color={COLORS.white}
                    fontFamily="Roboto-Bold"
                    style={styles.buttonTitle}
                  />
                  <Typography
                    title="Best Sellers"
                    fontSize={scale(12)}
                    color={COLORS.white}
                    fontFamily="Roboto-Regular"
                    style={styles.buttonSubtitle}
                  />
                </View>
                <View style={styles.arrowContainer}>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={COLORS.white}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.viewAllButtonContainer, styles.sunglassesButton]}
          onPress={() => router.push("/(tabs)/(explore)")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonGradient}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonSecondaryContent}>
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name="wb-sunny"
                    size={24}
                    color={COLORS.white}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Typography
                    title="Sunglasses"
                    fontSize={scale(16)}
                    color={COLORS.white}
                    fontFamily="Roboto-Bold"
                    style={styles.buttonTitle}
                  />
                  <Typography
                    title="Best Sellers"
                    fontSize={scale(12)}
                    color={COLORS.white}
                    fontFamily="Roboto-Regular"
                    style={styles.buttonSubtitle}
                  />
                </View>
                <View style={styles.arrowContainer}>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={COLORS.white}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(8),
  },
  header: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(12),
  },
  headerTitle: {
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: scale(16),
    gap: scale(12),
  },
  card: {
    width: (SCREEN_WIDTH - scale(40)) / 2,
    borderRadius: scale(16),
    alignSelf: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: COLORS.white,
    marginBottom: verticalScale(6),
  },
  cardContent: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: scale(16),
    backgroundColor: COLORS.white,
  },
  favoriteButton: {
    width: scale(28),
    height: scale(28),
    position: "absolute",
    zIndex: 10,
    borderRadius: scale(8),
    top: scale(12),
    right: scale(12),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  productImage: {
    width: "100%",
    height: scale(112),
    resizeMode: "cover",
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    gap: scale(6),
  },
  productName: {
    fontWeight: "700",
    minHeight: scale(22),
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  originalPrice: {
    textDecorationLine: "line-through",
  },
  addToCart: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(10),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: verticalScale(4),
    minHeight: verticalScale(38),
  },
  addToCartDisabled: {
    backgroundColor: COLORS.grey4,
    borderColor: COLORS.grey4,
  },
  addToCartSuccess: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  viewAllButtons: {
    gap: scale(16),
    marginHorizontal: scale(16),
    marginTop: verticalScale(20),
  },
  viewAllButtonContainer: {
    flex: 1,
    height: verticalScale(70),
    borderRadius: scale(16),
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  eyeglassesButton: {
    backgroundColor: COLORS.primary,
  },
  sunglassesButton: {
    backgroundColor: COLORS.orange,
  },
  buttonGradient: {
    flex: 1,
    paddingHorizontal: scale(14),
    justifyContent: "center",
  },
  buttonContent: {
    alignItems: "center",
    gap: scale(16),
  },
  iconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  textContainer: {
    flex: 1,
    gap: scale(6),
  },
  buttonTitle: {
    textAlign: "left",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontWeight: "600",
  },
  buttonSubtitle: {
    textAlign: "left",
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontWeight: "500",
  },
  arrowContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSecondaryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
});

export default BestSelling;
