import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, ScrollView, Text, View } from "react-native";

import { AnimatedProductCard } from "@/components/explore/animated-product-card";
import SuggestionTab from "@/components/home/suggestion-tab";
import { ExploreCardSkeleton } from "@/components/skeletons";
import { Header } from "@/components/ui/header";
import { handleLargerText } from "@/constants/helper";
import { homeApi } from "@/services/home/homeApi";
import { useCommonStore } from "@/store/commonStore";
import { styles } from "@/styles/explore/explore";

type ExploreProduct = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
};

const Explore = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<ExploreProduct[]>([]);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const categories = useCommonStore((state) => state.categories);

  // Animate header on mount
  useEffect(() => {
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchProducts = async (loadMore = false) => {
    setLoading(true);
    setError(null);

    try {
      const selected = categories.find((c) => c.title === selectedFilter);
      const handle =
        selectedFilter === "All"
          ? "eyeglasses"
          : selected?.resource?.handle  ?? "";

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
      }));

      // If loading more, append to current list
      setProducts((prev) => (loadMore ? [...prev, ...mapped] : mapped));

      setEndCursor(collection?.products.pageInfo.endCursor ?? null);
      setHasNextPage(collection?.products.pageInfo.hasNextPage ?? false);
    } catch (e: any) {
      setError(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts(false); // initial load
  }, [selectedFilter]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleCategoryPress = (categoryId: string) => {
    const categoryTitle =
      categories.find((category) => category.id === categoryId)?.title || "All";
    setSelectedFilter(categoryTitle);
  };

  const filteredProducts = products.filter((product) => {
    const matchesFilter =
      selectedFilter === "All" || product.category === selectedFilter;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
      onToggleFavorite={toggleFavorite}
      isFavorite={favorites.has(item.id)}
    />
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <ExploreCardSkeleton />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No products found</Text>
            </View>
          }
          onEndReached={() => {
            if (hasNextPage && !loading) {
              fetchProducts(true); // load more
            }
          }}
          ListEmptyComponent={
            loading && products.length === 0 ? renderSkeleton : null
          }
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
