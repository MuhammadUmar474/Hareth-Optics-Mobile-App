import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, ScrollView, View } from "react-native";

import { AnimatedProductCard } from "@/components/explore/animated-product-card";
import SuggestionTab from "@/components/home/suggestion-tab";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { categoryOptions } from "@/constants/data";
import { handleLargerText } from "@/constants/helper";
import { homeApi } from "@/services/home/homeApi";
import { styles } from "@/styles/explore/explore";
import { Feather, Ionicons } from "@expo/vector-icons";

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
      const selected = categoryOptions.find((c) => c.title === selectedFilter);
      const handle = selected?.handle ?? "";

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

  const handleCategoryPress = (categoryId: number) => {
    const categoryTitle =
      categoryOptions.find((category) => category.id === categoryId)?.title ||
      "All";

    setSelectedCategories([categoryId]);
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

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionContainer}
        style={styles.suggestionScrollView}
      >
        {categoryOptions.map((category) => (
          <SuggestionTab
            key={category.id}
            title={category.title}
            lefticon={
              category.iconLibrary === "ionicons" ? (
                <Ionicons
                  name={category.iconName as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={
                    selectedCategories.includes(category.id)
                      ? COLORS.white
                      : COLORS.primary
                  }
                />
              ) : (
                <Feather
                  name={category.iconName as keyof typeof Feather.glyphMap}
                  size={16}
                  color={
                    selectedCategories.includes(category.id)
                      ? COLORS.white
                      : COLORS.primary
                  }
                />
              )
            }
            isSelected={selectedCategories.includes(category.id)}
            onPress={() => handleCategoryPress(category.id)}
            containerStyle={styles.suggestionTab}
          />
        ))}
      </ScrollView>

      <Animated.View style={[styles.content, { opacity: headerFadeAnim }]}>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productsContainer}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage && !loading) {
              fetchProducts(true); // load more
            }
          }}
          ListFooterComponent={
            loading ? <View style={{ padding: 20 }} /> : null
          }
        />
      </Animated.View>
    </View>
  );
};

export default Explore;
