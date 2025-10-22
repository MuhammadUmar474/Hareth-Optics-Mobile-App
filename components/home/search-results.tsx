import { COLORS } from "@/constants/colors";
import { executeHomeQuery } from "@/services/home/homeApi";
import { useCartStore } from "@/store/cartStore";
import { useWishlistActions } from "@/utils/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";
import SimpleOptimizedImage from "../ui/simple-optimized-image";

type SearchProduct = {
  id: string;
  title: string;
  handle: string;
  price: string;
  currency: string;
  image: string;
  productType: string;
  vendor: string;
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
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistActions();

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

  const handleAddToCart = (product: SearchProduct) => {
    const price = parseFloat(product.price);
    addToCart({
      id: parseInt(product.id),
      name: product.title,
      price: price,
      image: { uri: product.image },
    });
  };

  const handleToggleWishlist = (product: SearchProduct) => {
    const price = parseFloat(product.price);
    toggleWishlist({
      id: parseInt(product.id),
      name: product.title,
      price: price,
      image: { uri: product.image },
    });
  };

  const renderProduct = ({ item }: { item: SearchProduct }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push({
        pathname: "/product-details",
        params: { id: item.id, title: encodeURIComponent(item.title) }
      })}
      activeOpacity={0.8}
    >
      <View style={styles.productImageContainer}>
        <SimpleOptimizedImage
          source={{ uri: item.image }}
          style={styles.productImage}
          contentFit="cover"
          priority="high"
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleToggleWishlist(item)}
        >
          <Ionicons
            name={isInWishlist(parseInt(item.id)) ? "heart" : "heart-outline"}
            size={moderateScale(18)}
            color={isInWishlist(parseInt(item.id)) ? COLORS.danger : COLORS.secondary}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.productInfo}>
        <Typography
          title={item.title}
          fontSize={scale(12)}
          fontFamily="Roboto-Bold"
          color={COLORS.black7}
          style={styles.productTitle}
          numberOfLines={2}
        />
        
        <Typography
          title={item.vendor}
          fontSize={scale(10)}
          color={COLORS.grey10}
          style={styles.productVendor}
        />
        
        <View style={styles.priceContainer}>
          <Typography
            title={`${item.price} ${item.currency}`}
            fontSize={scale(14)}
            fontFamily="Roboto-Bold"
            color={COLORS.primary}
          />
        </View>
        
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Typography
            title="Add to Cart"
            fontSize={scale(11)}
            color={COLORS.white}
            fontFamily="Roboto-Bold"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
  productCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: verticalScale(120),
  },
  favoriteButton: {
    position: "absolute",
    top: scale(8),
    right: scale(8),
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    padding: scale(12),
  },
  productTitle: {
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  productVendor: {
    marginBottom: verticalScale(6),
  },
  priceContainer: {
    marginBottom: verticalScale(8),
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(8),
    borderRadius: scale(6),
    alignItems: "center",
    justifyContent: "center",
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
