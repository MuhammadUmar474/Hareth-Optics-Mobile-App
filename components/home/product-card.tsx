import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";
import SimpleOptimizedImage from "../ui/simple-optimized-image";

interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: {
    url: string;
    altText?: string;
  };
}

export interface ProductData {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  totalInventory: number;
  availableForSale: boolean;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  images: {
    edges: {
      node: {
        url: string;
        altText?: string;
      };
    }[];
  };
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface ProductCardProps {
  product: ProductData;
  onPress?: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isFavorited: boolean;
  isLoading?: boolean;
  showSuccess?: boolean;
  isAdded?: boolean;
}

// Price rendering function
const renderPrice = (product: ProductData) => {
  const firstVariant = product.variants?.edges?.[0]?.node;
  const currentPrice = product.priceRange?.minVariantPrice?.amount || "0";
  const compareAtPrice = firstVariant?.compareAtPrice?.amount;
  const currencyCode =
    product.priceRange?.minVariantPrice?.currencyCode || "KD";

  const hasDiscount =
    compareAtPrice && parseFloat(compareAtPrice) > parseFloat(currentPrice);

  if (hasDiscount) {
    return (
      <>
        <Typography
          title={`${currentPrice} ${currencyCode}`}
          fontSize={scale(14)}
          fontFamily="Roboto-Bold"
          color={COLORS.primary}
        />
        <Typography
          title={`${compareAtPrice} ${currencyCode}`}
          fontSize={scale(11)}
          color={COLORS.grey10}
          style={styles.originalPrice}
        />
      </>
    );
  } else {
    return (
      <Typography
        title={`${currentPrice} ${currencyCode}`}
        fontSize={scale(14)}
        fontFamily="Roboto-Bold"
        color={COLORS.primary}
      />
    );
  }
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isFavorited = false,
  isLoading = false,
  showSuccess = false,
  isAdded = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showSuccess) {
      // Button pulse animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Checkmark animation
      Animated.parallel([
        Animated.spring(checkmarkScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Hide checkmark after delay
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(checkmarkScale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(checkmarkOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1500);
    }
  }, [showSuccess, scaleAnim, checkmarkScale, checkmarkOpacity]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={isLoading ? undefined : onPress}
      style={[styles.card, isLoading && styles.cardDisabled]}
      disabled={isLoading}
    >
      <View style={styles.cardContent}>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isLoading && styles.favoriteButtonDisabled,
          ]}
          onPress={isLoading ? undefined : onToggleWishlist}
          disabled={isLoading}
        >
          <Animated.View>
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={moderateScale(20)}
              color={
                isLoading
                  ? COLORS.grey4
                  : isFavorited
                  ? COLORS.danger
                  : COLORS.secondary
              }
            />
          </Animated.View>
        </TouchableOpacity>

        <SimpleOptimizedImage
          source={{ uri: product.featuredImage?.url || "" }}
          style={styles.productImage}
          contentFit="cover"
          priority="high"
        />

        <View style={styles.infoContainer}>
          <Typography
            title={product.title}
            fontSize={scale(12)}
            fontFamily="Roboto-Bold"
            color={COLORS.black7}
            style={styles.productName}
            numberOfLines={2}
          />
          <Typography
            title={product.productType}
            fontSize={moderateScale(13)}
            color={COLORS.grey10}
            numberOfLines={1}
            ellipsizeMode="tail"
          />
          <View style={styles.priceContainer}>{renderPrice(product)}</View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.addToCart,
                isLoading && styles.addToCartDisabled,
                showSuccess && styles.addToCartSuccess,
                isAdded && styles.addToCartAdded,
              ]}
              onPress={isAdded ? undefined : onAddToCart}
              disabled={isLoading || showSuccess || isAdded}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : isAdded ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(6),
                  }}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={scale(18)}
                    color={COLORS.white}
                  />
                  <Typography
                    title="Added"
                    fontSize={scale(12)}
                    color={COLORS.white}
                    fontFamily="Roboto-Bold"
                  />
                </View>
              ) : showSuccess ? (
                <Animated.View
                  style={{
                    transform: [{ scale: checkmarkScale }],
                    opacity: checkmarkOpacity,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(6),
                  }}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={scale(18)}
                    color={COLORS.white}
                  />
                  <Typography
                    title="Added!"
                    fontSize={scale(12)}
                    color={COLORS.white}
                    fontFamily="Roboto-Bold"
                  />
                </Animated.View>
              ) : (
                <Typography
                  title="Add to Cart"
                  fontSize={scale(12)}
                  color={COLORS.white}
                  fontFamily="Roboto-Bold"
                />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
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
  cardDisabled: {
    opacity: 0.6,
    pointerEvents: "none",
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
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButtonDisabled: {
    opacity: 0.5,
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
  addToCart: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(10),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: verticalScale(4),
    minHeight: verticalScale(38),
  },
  addToCartDisabled: {
    backgroundColor: COLORS.grey4,
    borderColor: COLORS.grey4,
  },
  addToCartSuccess: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  addToCartAdded: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});

export default ProductCard;
