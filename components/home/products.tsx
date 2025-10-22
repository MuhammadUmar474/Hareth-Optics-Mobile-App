import { COLORS } from "@/constants/colors";
import { MenuItem } from "@/services/home/homeApi";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { ProductsSkeleton } from "../skeletons";
import Typography from "../ui/custom-typography";
import SimpleOptimizedImage from "../ui/simple-optimized-image";

interface ProductsProps {
  productCategory: MenuItem[];
  onProductPress?: (product: MenuItem) => void;
  title: string;
  loading?: boolean;
}

const Products: React.FC<ProductsProps> = ({
  productCategory,
  onProductPress,
  title,
  loading = false,
}) => {
  if (loading) {
    return <ProductsSkeleton />;
  }

  const renderProduct = ({ item }: { item: MenuItem }) => {
    // Handle cases where image might be null
    const imageUrl = item.resource?.image?.url || null;
    
    return (
      <View>
        <TouchableOpacity
          onPress={() => onProductPress?.(item)}
          activeOpacity={0.8}
        >
          <SimpleOptimizedImage
            source={{ uri: imageUrl }}
            style={styles.productImage}
            priority="high"
            contentFit="cover"
          />
        </TouchableOpacity>
        <Typography
          title={item.title ?? ""}
          fontSize={scale(11)}
          fontFamily="Roboto-Bold"
          color={COLORS.black}
          style={styles.productName}
        />
      </View>
    );
  };

  const handleViewAllPress = (categoryTitle: string) => {
    router.push({
      pathname: "/(tabs)/(explore)",
      params: { category: categoryTitle },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography
          title={title}
          fontSize={scale(17)}
          fontFamily="Poppins-Bold"
          color={COLORS.secondary}
          style={styles.headerTitle}
        />
        <TouchableOpacity onPress={() => handleViewAllPress(title)}>
          <Typography
            title="View All"
            fontSize={scale(12)}
            color={COLORS.primary}
            fontFamily="Roboto-Bold"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={productCategory}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(16),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(12),
  },
  listContainer: {
    paddingHorizontal: scale(22),
    gap: scale(20),
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: scale(12),
    marginBottom: verticalScale(8),
  },
  productName: {
    textAlign: "center",
    width: 70,
  },
  headerTitle: {
    fontWeight: "600",
  },
});
