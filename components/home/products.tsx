import { COLORS } from "@/constants/colors";
import { Product, ProductCategory } from "@/constants/data";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";

interface ProductsProps {
  productCategory: ProductCategory;
  onProductPress?: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = ({
  productCategory,
  onProductPress,
}) => {
  const renderProduct = ({ item }: { item: Product }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => onProductPress?.(item)}
          activeOpacity={0.8}
        >
          <Image source={item.image} style={styles.productImage} />
        </TouchableOpacity>
        <Typography
          title={item.name}
          fontSize={scale(11)}
          fontFamily="Roboto-Bold"
          color={COLORS.black}
          style={styles.productName}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography
          title={productCategory.title}
          fontSize={scale(17)}
          fontFamily="Poppins-Bold"
          color={COLORS.secondary}
          style={styles.headerTitle}
        />
        <TouchableOpacity onPress={() => router.push(`/(tabs)/(explore)`)}>
          <Typography
            title="View All"
            fontSize={scale(12)}
            color={COLORS.primary}
            fontFamily="Roboto-Bold"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={productCategory.products}
        renderItem={renderProduct}
        keyExtractor={(item) => `${productCategory.id}-${item.id}`}
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
  },
  headerTitle: {
    fontWeight: "600",
  },
});
