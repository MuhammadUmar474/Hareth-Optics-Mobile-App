import { COLORS } from "@/constants/colors";
import { executeHomeQuery, MenuItem } from "@/services/home/homeApi";
import { prescriptionToCartAttributes, useCartStore } from "@/store/cartStore";
import { useLoadingStore } from "@/store/loadingStore";
import { useWishlistActions } from "@/utils/wishlist";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { CardSkeleton } from "../skeletons";
import Typography from "../ui/custom-typography";
import ProductCard, { ProductData } from "./product-card";


const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  const [addedProducts, setAddedProducts] = useState<Set<string>>(
    new Set()
  );

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

  const handleFetchLatestProducts = useCallback(async () => {
    try {
      setLoadingBestSelling(true);
      const query = `
        query GetBestSellingEyeglasses {
          products(first: 20, sortKey: BEST_SELLING, query: "product_type:eyeglasses") {
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
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      sku
                      availableForSale
                      price { amount currencyCode }
                      compareAtPrice { amount currencyCode }
                      selectedOptions { name value }
                      image { url altText }
                    }
                  }
                }
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
      setBestSellingProducts(data.products.edges);
    } catch (error) {
      console.error("Failed to fetch best selling products:", error);
    } finally {
      setLoadingBestSelling(false);
    }
  }, [setLoadingBestSelling]);

  useEffect(() => {
    handleFetchLatestProducts();
  }, [handleFetchLatestProducts, setLoadingBestSelling]);

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
        renderItem={({ item }) => {
          const product =
            (item as unknown as { node: ProductData }).node ||
            (item as unknown as ProductData);
          return (
            <View style={{ width: (SCREEN_WIDTH - scale(40)) / 2 }}>
              <ProductCard
                product={product}
                onPress={() => {
                  router.push(
                    `/product-details?id=${product.id}&title=${encodeURIComponent(
                      product.title
                    )}`
                  );
                }}
                onAddToCart={() => handleAddToCart(product)}
                onToggleWishlist={() => handleToggleWishlist(product)}
                isFavorited={isInWishlist(
                  parseInt(product.id.replace(/\D/g, ""), 10)
                )}
                isLoading={loadingProducts.has(product.id)}
                showSuccess={successProducts.has(product.id)}
                isAdded={addedProducts.has(product.id)}
              />
            </View>
          );
        }}
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
