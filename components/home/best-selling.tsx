import { COLORS } from "@/constants/colors";
import { BestSellingProduct } from "@/constants/data";
import { executeHomeQuery, MenuItem } from "@/services/home/homeApi";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ProductCardProps {
  product: BestSellingProduct;
  onPress?: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isFavorited: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isFavorited,
}) => {
  const { isInWishlist } = useWishlistStore();



  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onToggleWishlist}
        >
          <Animated.View>
            <Ionicons
              name={isInWishlist(product.id) ? "heart" : "heart-outline"}
              size={moderateScale(20)}
              color={
                isInWishlist(product.id) ? COLORS.danger : COLORS.secondary
              }
            />
          </Animated.View>
        </TouchableOpacity>

        <Image source={{uri: product.featuredImage.url}} style={styles.productImage}  contentFit="cover"/>

        <View style={styles.infoContainer}>
          <Typography
            title={product.title}
            fontSize={scale(12)}
            fontFamily="Roboto-Bold"
            color={COLORS.black7}
            style={styles.productName}
            numberOfLines={2}
          />
          <View style={styles.priceContainer}>
            <Typography
              title={product.priceRange.minVariantPrice.amount+" "+product.priceRange.minVariantPrice.currencyCode}
              fontSize={scale(14)}
              fontFamily="Roboto-Bold"
              color={COLORS.primary}
            />
            <Typography
              title={product.priceRange.minVariantPrice.amount+" "+product.priceRange.minVariantPrice.currencyCode}
              fontSize={scale(11)}
              color={COLORS.grey10}
              style={styles.originalPrice}
            />
          </View>
          <TouchableOpacity style={styles.addToCart} onPress={onAddToCart}>
            <Typography
              title="Add to Cart"
              fontSize={scale(12)}
              color={COLORS.white}
              fontFamily="Roboto-Bold"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BestSelling: React.FC = () => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [bestSellingProducts, setBestSellingProducts] = useState<MenuItem[]>([]);


  const handleAddToCart = (product: BestSellingProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.discountedPrice.replace(/[^0-9.]/g, "")),
      image: product.image,
    });
  };

  const handleToggleWishlist = (product: BestSellingProduct) => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: parseFloat(product.discountedPrice.replace(/[^0-9.]/g, "")),
      image: product.image,
    });
  };

  const handleFetchLatestProducts = async () => {
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

    const data = await executeHomeQuery<{ products: { edges: any[] } }>(query);
    setBestSellingProducts(data.products.edges);
  };

  useEffect(() => {
    handleFetchLatestProducts();
  }, []);

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
        data={bestSellingProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item.node}
            onPress={() => {
              router.push(`/product-details`);
            }}
            onAddToCart={() => handleAddToCart(item)}
            onToggleWishlist={() => handleToggleWishlist(item)}
            isFavorited={isInWishlist(item.id)}
          />
        )}
        // keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.viewAllButtons}>
        <TouchableOpacity
          style={styles.viewAllButtonContainer}
          onPress={() => router.push("/(tabs)/(explore)")}
        >
          <ImageBackground
            source={require("@/assets/images/sale.jpg")}
            style={styles.viewAllButtonBackground}
            imageStyle={styles.viewAllButtonImageStyle}
            resizeMode="cover"
          >
            <View style={styles.viewAllButtonOverlay}>
              <Typography
                title="Bestselling Eyeglasses"
                fontSize={scale(16)}
                color={COLORS.white}
                fontFamily="Roboto-Bold"
                style={styles.viewAllButtonText}
              />
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewAllButtonContainer}
          onPress={() => router.push("/(tabs)/(explore)")}
        >
          <ImageBackground
            source={require("@/assets/images/lenses.jpg")}
            style={styles.viewAllButtonBackground}
            imageStyle={styles.viewAllButtonImageStyle}
            resizeMode="cover"
          >
            <View style={styles.viewAllButtonOverlay}>
              <Typography
                title="Bestselling Sunglasses"
                fontSize={scale(16)}
                color={COLORS.white}
                fontFamily="Roboto-Bold"
                style={styles.viewAllButtonText}
              />
            </View>
          </ImageBackground>
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
  card: {
    width: (SCREEN_WIDTH - scale(40)) / 2,
    borderRadius: scale(16),
    alignSelf: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: COLORS.white,
    marginBottom: verticalScale(6),
  },
  cardContent: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: scale(16),
    backgroundColor: COLORS.white,
  },
  favoriteButton: {
    width: scale(28),
    height: scale(28),
    position: "absolute",
    zIndex: 10,
    borderRadius: scale(8),
    top: scale(12),
    right: scale(12),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  newBadge: {
    position: "absolute",
    top: scale(12),
    right: scale(12),
    backgroundColor: COLORS.grey20,
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(6),
    zIndex: 10,
  },
  productImage: {
    width: "100%",
    height: scale(112),
    resizeMode: "cover",
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    gap: scale(6),
  },
  productName: {
    fontWeight: "700",
    minHeight: scale(22),
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  originalPrice: {
    textDecorationLine: "line-through",
  },
  viewButton: {
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(10),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.grey4,
  },
  addToCart: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(10),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: verticalScale(4),
  },
  viewAllButtons: {
    flexDirection: "row",
    gap: scale(12),
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
  },
  viewAllButtonContainer: {
    flex: 1,
    height: verticalScale(200),
    borderRadius: scale(12),
    overflow: "hidden",
  },
  viewAllButtonBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  viewAllButtonImageStyle: {
    borderRadius: scale(12),
  },
  viewAllButtonOverlay: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(12),
    marginHorizontal: scale(8),
    paddingVertical: verticalScale(32),
    marginBottom: verticalScale(8),
  },
  viewAllButtonText: {
    textAlign: "center",
  },
});

export default BestSelling;
