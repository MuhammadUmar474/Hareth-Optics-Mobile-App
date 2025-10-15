import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, ScrollView, View } from "react-native";

import { AnimatedProductCard } from "@/components/explore/animated-product-card";
import SuggestionTab from "@/components/home/suggestion-tab";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { categoryOptions } from "@/constants/data";
import { styles } from "@/styles/explore/explore";
import { PRODUCTS } from "@/utils/data";
import { Feather, Ionicons } from "@expo/vector-icons";

const Explore = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const headerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

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
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProducts = PRODUCTS.filter((product) => {
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
    item: (typeof PRODUCTS)[0];
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
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productsContainer}
          showsVerticalScrollIndicator={false}
          key={selectedFilter}
        />
      </Animated.View>
    </View>
  );
};

export default Explore;
