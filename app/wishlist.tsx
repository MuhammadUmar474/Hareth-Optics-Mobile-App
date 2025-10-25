import ProductCard, { ProductData } from "@/components/home/product-card";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { prescriptionToCartAttributes, useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/shopifyStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useWishlistActions } from "@/utils/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Wishlist = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { wishlistItems, setCurrentUser } = useWishlistStore();
  const { t, isRtl } = useLocal();
  const { createCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistActions();
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set());
  const [successProducts, setSuccessProducts] = useState<Set<string>>(new Set());
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: scale(6),
          paddingTop: verticalScale(10),
          paddingBottom: verticalScale(10),
          borderBottomWidth: 1,
          borderBottomColor: COLORS.grey4,
        },
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setCurrentUser(user.email);
    }
  }, [isAuthenticated, user?.email, setCurrentUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, router]);

  // Convert wishlist item to ProductData format
  const convertToProductData = (item: any): ProductData => {

    
    const currentPrice = parseFloat(item.price.toString());
    const compareAtPrice = (currentPrice * 1.2).toFixed(2); // 20% higher for discount
    
    const variantId = item.variantId || `gid://shopify/ProductVariant/${item.id}V1`;
    
    const productData = {
      id: `gid://shopify/Product/${item.id}`,
      title: item.name,
      handle: item.id.toString(),
      description: `Premium ${item.name} with high-quality materials and modern design.`,
      vendor: 'Hareth Optics',
      productType: 'Eyeglasses',
      tags: ['premium', 'designer', 'eyeglasses'],
      totalInventory: 10,
      availableForSale: true,
      featuredImage: {
        url: item.image.uri,
        altText: item.name
      },
      images: {
        edges: [{
          node: {
            url: item.image.uri,
            altText: item.name
          }
        }]
      },
      variants: {
        edges: [{
          node: {
            id: variantId,
            title: 'Default',
            sku: `SKU-${item.id}`,
            availableForSale: true,
            price: {
              amount: item.price.toString(),
              currencyCode: 'KD'
            },
            compareAtPrice: {
              amount: compareAtPrice,
              currencyCode: 'KD'
            },
            selectedOptions: [],
            image: {
              url: item.image.uri,
              altText: item.name
            }
          }
        }]
      },
      priceRange: {
        minVariantPrice: {
          amount: item.price.toString(),
          currencyCode: 'KD'
        },
        maxVariantPrice: {
          amount: item.price.toString(),
          currencyCode: 'KD'
        }
      }
    };
    
    return productData;
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
        console.error("❌ Wishlist: Failed to add to cart");
      }
    } catch (error) {
      console.error("❌ Wishlist: Error adding to cart:", error);
    } finally {
      setLoadingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleToggleWishlist = (product: ProductData) => {
    const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
    const numericId = parseInt(product.id.replace(/\D/g, ""), 10);
    toggleWishlist({
      id: numericId,
      name: product.title,
      price: price,
      image: { uri: product.featuredImage?.url || "" },
    });
  };


  if (wishlistItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={dynamicStyles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name={isRtl ? "arrow-forward" : "arrow-back"}
              size={24}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Typography
            title={t("wishlist.wishlist")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.headerTitle, dynamicStyles.textAlign]}
          />
          <View style={styles.headerButton} />
        </View>

        <View style={styles.emptyWishlistContainer}>
          <Image
            source={require("@/assets/images/home/favorite-hareth.png")}
            style={styles.illustrationImage}
            contentFit="contain"
          />
          <Typography
            title={t("wishlist.elevateStyle")}
            fontSize={scale(24)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.emptyWishlistTitle, dynamicStyles.textAlign]}
          />
          <Typography
            title={t("wishlist.elevatDescription")}
            fontSize={scale(14)}
            fontFamily="Roboto-Regular"
            color={COLORS.grey29}
            style={[styles.emptyWishlistMessage, dynamicStyles.textAlign]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name={isRtl ? "arrow-forward" : "arrow-back"}
            size={24}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Typography
          title={t("wishlist.wishlist")}
          fontSize={scale(18)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          style={[styles.headerTitle, dynamicStyles.textAlign]}
        />
        <View style={styles.headerButton} />
      </View>

      <FlatList
        data={wishlistItems}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => null}
        renderItem={({ item }) => {
          const productData = convertToProductData(item);
          const numericId = parseInt(item.id.toString().replace(/\D/g, ""), 10);
          return (
            <View style={{ width: (SCREEN_WIDTH - scale(48)) / 2 }}>
              <ProductCard
                product={productData}
              onPress={() => router.push(`/product-details?id=${item.id}`)}
                onAddToCart={() => handleAddToCart(productData)}
                onToggleWishlist={() => handleToggleWishlist(productData)}
                isFavorited={isInWishlist(numericId)}
                isLoading={loadingProducts.has(productData.id)}
                showSuccess={successProducts.has(productData.id)}
                isAdded={addedProducts.has(productData.id)}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  headerButton: {
    width: scale(40),
    height: scale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontWeight: "600" },
  emptyWishlistContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(12),
  },
  illustrationImage: {
    width: scale(240),
    height: scale(240),
    resizeMode: "contain",
  },
  emptyWishlistTitle: {
    fontWeight: "600",
    marginBottom: verticalScale(12),
  },
  emptyWishlistMessage: {
    lineHeight: scale(22),
    paddingHorizontal: scale(16),
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(40),
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
});

export default Wishlist;
