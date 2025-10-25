import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, FlatList, ScrollView, View } from "react-native";

import ProductCard, { ProductData } from "@/components/home/product-card";
import SuggestionTab from "@/components/home/suggestion-tab";
import { ExploreCardSkeleton } from "@/components/skeletons";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { handleLargerText } from "@/constants/helper";
import { homeApi } from "@/services/home/homeApi";
import { prescriptionToCartAttributes, useCartStore } from "@/store/cartStore";
import { useCommonStore } from "@/store/commonStore";
import { styles } from "@/styles/explore/explore";
import { useWishlistActions } from "@/utils/wishlist";
import { useLocalSearchParams, useRouter } from "expo-router";
import { scale, verticalScale } from "react-native-size-matters";

type ExploreProduct = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  variantId?: string;
  compareAtPrice?: string;
};

const Explore = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [products, setProducts] = useState<ExploreProduct[]>([]);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set());
  const [successProducts, setSuccessProducts] = useState<Set<string>>(new Set());
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const categories = useCommonStore((state) => state.categories);
  const params = useLocalSearchParams<{ category?: string }>();
  const router = useRouter();
  const { createCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistActions();

  // Animate header on mount
  useEffect(() => {
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [headerFadeAnim]);

  useEffect(() => {
    if (params.category) {
      const categoryIndex = categories.findIndex(
        (cat) => cat.title === params.category
      );

      if (categoryIndex !== -1) {
        setSelectedFilter(params.category);
        setSelectedCategories([categoryIndex]);
      } else {
        // If category not found, default to "All"
        setSelectedFilter("All");
        setSelectedCategories([-1]);
      }
    }
  }, [params.category, categories]);

  const fetchProducts = useCallback(async (loadMore = false) => {
    setLoading(true);

    try {
      const selected = categories.find((c) => c.title === selectedFilter);
      const handle =
        selectedFilter === "All"
          ? "eyeglasses"
          : selected?.handle ?? "";

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
        category: node.productType || selectedFilter,
        variantId: node.variants?.edges?.[0]?.node?.id,
        compareAtPrice: node.variants?.edges?.[0]?.node?.compareAtPrice?.amount,
      }));

      setProducts((prev) => (loadMore ? [...prev, ...mapped] : mapped));

      setEndCursor(collection?.products.pageInfo.endCursor ?? null);
      setHasNextPage(collection?.products.pageInfo.hasNextPage ?? false);
    } catch (e: any) {
      console.error("Failed to load products:", e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, categories, endCursor]);
  useEffect(() => {
    fetchProducts(false); // initial load
  }, [selectedFilter, fetchProducts]);


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
          // Mark as permanently added after animation completes
          setAddedProducts((prev) => new Set(prev).add(productId));
        }, 2000);
      } else {
        console.error("❌ Explore: Failed to add to cart");
      }
    } catch (error) {
      console.error("❌ Explore: Error adding to cart:", error);
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

  const handleCategoryPress = (categoryId: string) => {
    const categoryTitle =
      categories.find((category) => category.id === categoryId)?.title || "All";
    setSelectedFilter(categoryTitle);
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

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <ExploreCardSkeleton />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Explore" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionContainer}
        style={styles.suggestionScrollView}
      >
        {/* "ALL" tab (index -1 to avoid collision with categories) */}
        <SuggestionTab
          key="all"
          title="ALL"
          isSelected={selectedCategories.includes(-1)}
          onPress={() => {
            handleCategoryPress("All");
            setSelectedCategories([-1]);
          }}
          containerStyle={styles.suggestionTab}
        />

        {/* Category tabs */}
        {categories.map((category, index) => (
          <SuggestionTab
            key={category.id ?? index}
            title={category.title}
            isSelected={selectedCategories.includes(index)}
            onPress={() => {
              handleCategoryPress(category.id);
              setSelectedCategories([index]);
            }}
            containerStyle={styles.suggestionTab}
          />
        ))}
      </ScrollView>

      <Animated.View style={[styles.content, { opacity: headerFadeAnim }]}>
        <FlatList
          data={loading && products.length === 0 ? [] : products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productsContainer}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            loading && products.length === 0 ? (
              renderSkeleton
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: verticalScale(100),
                }}
              >
                <Typography
                  title="No products found"
                  fontSize={scale(16)}
                  fontFamily="Roboto-Bold"
                  color={COLORS.gray3}
                />
              </View>
            )
          }
          onEndReached={() => {
            if (hasNextPage && !loading) {
              fetchProducts(true); // load more
            }
          }}
          ListFooterComponent={
            loading && products.length > 0 ? (
              <View style={{ padding: 20 }} />
            ) : null
          }
        />
      </Animated.View>
    </View>
  );
};

export default Explore;
