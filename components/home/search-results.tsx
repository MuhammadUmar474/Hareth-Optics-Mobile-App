import ProductCard, { ProductData } from "@/components/home/product-card";
import { COLORS } from "@/constants/colors";
import { executeHomeQuery } from "@/services/home/homeApi";
import { prescriptionToCartAttributes, useCartStore } from "@/store/cartStore";
import { useWishlistActions } from "@/utils/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type SearchProduct = {
  id: string;
  title: string;
  handle: string;
  price: string;
  currency: string;
  image: string;
  productType: string;
  vendor: string;
  compareAtPrice?: string;
  variantId?: string;
};

interface SearchResultsProps {
  searchQuery: string;
  onClose: () => void;
  onClearInput?: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchQuery, onClose, onClearInput }) => {
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const endCursorRef = useRef<string | null>(null);
  const { createCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistActions();
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set());
  const [successProducts, setSuccessProducts] = useState<Set<string>>(new Set());
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  const searchProducts = useCallback(async (query: string, loadMore = false) => {
    if (!query.trim()) return;
        
    try {
      setLoading(true);
      const searchQuery = `
        query SearchProducts($query: String!, $first: Int = 20, $after: String) {
          products(first: $first, after: $after, query: $query) {
            edges {
              node {
                id
                title
                handle
                description
                productType
                vendor
                tags
                featuredImage { url altText }
                images(first: 5) { edges { node { url altText } } }
                priceRange {
                  minVariantPrice { amount currencyCode }
                  maxVariantPrice { amount currencyCode }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      availableForSale
                      selectedOptions { name value }
                      price { amount currencyCode }
                      compareAtPrice { amount currencyCode }
                    }
                  }
                }
              }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
      `;

      const data = await executeHomeQuery<{ products: { edges: any[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } }>(searchQuery, {
        query: query,
        first: 20,
        after: loadMore ? endCursorRef.current : undefined,
      });

      const mapped: SearchProduct[] = data.products.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        price: node.priceRange.minVariantPrice.amount,
        currency: node.priceRange.minVariantPrice.currencyCode,
        image: node.featuredImage?.url || node.images?.edges?.[0]?.node?.url || "",
        productType: node.productType || "",
        vendor: node.vendor || "",
        compareAtPrice: node.variants?.edges?.[0]?.node?.compareAtPrice?.amount,
        variantId: node.variants?.edges?.[0]?.node?.id,
      }));

      if (loadMore) {
        // Filter out duplicates when loading more
        setSearchResults(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newItems = mapped.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
      } else {
        setSearchResults(mapped);
      }
      const newEndCursor = data.products.pageInfo?.endCursor ?? null;
      const hasNext = data.products.pageInfo?.hasNextPage ?? false;
      
      endCursorRef.current = newEndCursor;
      setHasNextPage(hasNext);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      // Reset pagination state for new search
      endCursorRef.current = null;
      setHasNextPage(false);
      searchProducts(searchQuery);
    } else {
      setSearchResults([]);
      endCursorRef.current = null;
      setHasNextPage(false);
    }
  }, [searchQuery, searchProducts]);

  // Convert SearchProduct to ProductData format
  const convertToProductData = (item: SearchProduct): ProductData => {
    return {
      id: item.id,
      title: item.title,
      handle: item.handle,
      description: '',
      vendor: item.vendor,
      productType: item.productType,
      tags: [],
      totalInventory: 0,
      availableForSale: true,
      featuredImage: {
        url: item.image,
        altText: item.title
      },
      images: {
        edges: [{
          node: {
            url: item.image,
            altText: item.title
          }
        }]
      },
      variants: {
        edges: [{
          node: {
            id: item.variantId || `gid://shopify/ProductVariant/${item.id}V1`,
            title: 'Default',
            sku: '',
            availableForSale: true,
            price: {
              amount: item.price,
              currencyCode: item.currency
            },
            compareAtPrice: {
              amount: item.compareAtPrice || item.price,
              currencyCode: item.currency
            },
            selectedOptions: [],
            image: {
              url: item.image,
              altText: item.title
            }
          }
        }]
      },
      priceRange: {
        minVariantPrice: {
          amount: item.price,
          currencyCode: item.currency
        },
        maxVariantPrice: {
          amount: item.price,
          currencyCode: item.currency
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
        console.error("❌ SearchResults: Failed to add to cart");
      }
    } catch (error) {
      console.error("❌ SearchResults: Error adding to cart:", error);
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
    const firstVariant = product.variants?.edges?.[0]?.node;
    toggleWishlist({
      id: numericId,
      name: product.title,
      price: price,
      image: { uri: product.featuredImage?.url || "" },
      variantId: firstVariant?.id,
    });
  };

  const renderProduct = ({ item }: { item: SearchProduct }) => {
    const productData = convertToProductData(item);
    const numericId = parseInt(item.id.replace(/\D/g, ""), 10);
    
    return (
      <View style={{ width: (SCREEN_WIDTH - scale(34)) / 2 }}>
        <ProductCard
          product={productData}
          onPress={() => router.push({
            pathname: "/product-details",
            params: { id: item.id, title: encodeURIComponent(item.title) }
          })}
          onAddToCart={() => handleAddToCart(productData)}
          onToggleWishlist={() => handleToggleWishlist(productData)}
          isFavorited={isInWishlist(numericId)}
          isLoading={loadingProducts.has(productData.id)}
          showSuccess={successProducts.has(productData.id)}
          isAdded={addedProducts.has(productData.id)}
        />
      </View>
    );
  };

  if (!searchQuery.trim()) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography
          title={`Search results for "${searchQuery}"`}
          fontSize={scale(16)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
        />
        <TouchableOpacity 
          onPress={() => {
            onClose();
            onClearInput?.();
          }} 
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      {loading && searchResults.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Typography
            title="Searching..."
            fontSize={scale(14)}
            color={COLORS.grey10}
            style={styles.loadingText}
          />
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderProduct}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productsContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !loading && searchQuery.trim()) {
              searchProducts(searchQuery, true);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color={COLORS.grey4} />
          <Typography
            title="No products found"
            fontSize={scale(16)}
            fontFamily="Roboto-Bold"
            color={COLORS.grey10}
            style={styles.emptyTitle}
          />
          <Typography
            title="Try searching with different keywords"
            fontSize={scale(12)}
            color={COLORS.grey10}
            style={styles.emptySubtitle}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey4,
  },
  closeButton: {
    padding: scale(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(40),
  },
  loadingText: {
    marginTop: verticalScale(8),
  },
  productsContainer: {
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(100),
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
  footerLoading: {
    paddingVertical: verticalScale(20),
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: verticalScale(80),
  },
  emptyTitle: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  emptySubtitle: {
    textAlign: "center",
  },
});

export default SearchResults;
