import LensType from "@/components/product/lens-type";
import VirtualTryOn from "@/components/product/virtual-try-on";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { FrameColor, FrameSize, productDetailData } from "@/constants/data";
import { useLocal } from "@/hooks/use-lang";
import { useCartStore } from "@/store/cartStore";
import { useWishlistActions } from "@/utils/wishlist";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ProductDetails = () => {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistActions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<number>(1);
  const { t, isRtl } = useLocal();
  const product = productDetailData;

  // Dynamic styles for RTL support
  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
     
        colorContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          gap: scale(12),
        },
        sizeContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          gap: scale(12),
        },
        sectionHeader: {
          flexDirection: isRtl ? "row-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: verticalScale(12),
        },
        bottomSection: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: scale(16),
          paddingVertical: verticalScale(16),
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.grey4,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
          position: "absolute",
          bottom: 12,
          left: 0,
          right: 0,
        },
        priceContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          gap: scale(8),
        },
        buyNowButtonContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          gap: scale(8),
        },
        sizeGuideButton: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          gap: scale(4),
        },
        addToCartButton: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          gap: scale(8),
          backgroundColor: COLORS.primary,
          paddingHorizontal: scale(12),
          paddingVertical: verticalScale(12),
          borderRadius: scale(10),
        },
        buyNowButton: {
          borderWidth: 1,
          borderColor: COLORS.grey4,
          borderRadius: scale(10),
          paddingHorizontal: scale(12),
          paddingVertical:isRtl? verticalScale(15): verticalScale(10),
          alignItems: "center",
        },
      }),
    [isRtl]
  );

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const toggleFavorite = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: parseFloat(product.discountedPrice.replace(/[^0-9.]/g, "")),
      image: product.images[0],
    });
  };

  const onAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.discountedPrice.replace(/[^0-9.]/g, "")),
      image: product.images[0],
    });
    router.push("/shopping-cart");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Typography
          title={t("home.eyeGlasses")}
          fontSize={scale(18)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          style={styles.headerTitle}
        />
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Swiper Section */}
        <View style={styles.imageSection}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {product.images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={image}
                  style={styles.productImage}
                  contentFit="cover"
                />
              </View>
            ))}
          </ScrollView>

          {/* Image Counter Badge */}
          <View style={styles.imageCounter}>
            <Typography
              title={`${currentImageIndex + 1}/${product.images.length}`}
              fontSize={scale(14)}
              color={COLORS.white}
              fontFamily="Roboto-Bold"
            />
          </View>
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {product.images.map((_, index) => {
            const isActive = index === currentImageIndex;
            return (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  isActive
                    ? styles.paginationDotActive
                    : styles.paginationDotInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Product Info Section */}
        <View style={styles.contentSection}>
          {/* Product Title and Description */}
          <View style={styles.titleSection}>
            <Typography
              title={product.name}
              fontSize={scale(22)}
              fontFamily="Poppins-Bold"
              color={COLORS.black}
              style={styles.productTitle}
            />
            <Typography
              title={product.description}
              fontSize={scale(13)}
              color={COLORS.grey16}
              fontFamily="Roboto-Regular"
              style={styles.productDescription}
            />
          </View>

          {/* Frame Color Section */}
          <View style={styles.section}>
            <Typography
              title={t("eyeglassesDetails.frameColor")}
              fontSize={scale(16)}
              fontFamily="Poppins-Bold"
              color={COLORS.black}
              textAlign={isRtl ? "right":"left"}
              style={styles.sectionTitle}
            />
            <View style={dynamicStyles.colorContainer}>
              {product.frameColors.map((color: FrameColor) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorCircle,
                    selectedColor === color.id && styles.colorCircleSelected,
                  ]}
                  onPress={() => setSelectedColor(color.id)}
                >
                  <View
                    style={[
                      styles.colorInner,
                      { backgroundColor: color.color },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Frame Size Section */}
          <View style={styles.section}>
            <View style={dynamicStyles.sectionHeader}>
              <Typography
                title={t("eyeglassesDetails.frameSize")}
                fontSize={scale(16)}
                fontFamily="Poppins-Bold"
                color={COLORS.black}
                style={styles.sectionFrame}
              />
              <TouchableOpacity
                style={dynamicStyles.sizeGuideButton}
                onPress={() => router.push("/size-guide")}
              >
                <Ionicons
                  name="resize-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Typography
                  title={t("eyeglassesDetails.sizeGuide")}
                  fontSize={scale(12)}
                  color={COLORS.primary}
                  fontFamily="Roboto-Bold"
                />
              </TouchableOpacity>
            </View>
            <View style={dynamicStyles.sizeContainer}>
              {product.frameSizes.map((size: FrameSize) => (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.sizeButton,
                    selectedSize === size.id && styles.sizeButtonSelected,
                  ]}
                  onPress={() => setSelectedSize(size.id)}
                >
                  <Typography
                    title={t(size.name)}
                    fontSize={scale(14)}
                    color={
                      selectedSize === size.id ? COLORS.white : COLORS.black
                    }
                    fontFamily="Roboto-Bold"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Lens Type Section */}
          <LensType />

          {/* Virtual Try-On Section */}
          <VirtualTryOn onTryNow={() => router.push("/(tabs)/(3d-try-on)")} />
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={dynamicStyles.bottomSection}>
        <View style={styles.totalPriceContainer}>
          <Typography
            title={t("purchases.totalPrice")}
            fontSize={scale(14)}
            fontFamily="Poppins-Bold"
            color={COLORS.grey33}
          />
          <View style={dynamicStyles.priceContainer}>
            <Typography
              title={product.discountedPrice}
              fontSize={scale(20)}
              fontFamily="Poppins-Bold"
              color={COLORS.primary}
            />
            <Typography
              title={product.price}
              fontSize={scale(14)}
              color={COLORS.grey10}
              style={styles.originalPrice}
            />
          </View>
        </View>
        <View style={dynamicStyles.buyNowButtonContainer}>
          <TouchableOpacity
            style={dynamicStyles.addToCartButton}
            onPress={onAddToCart}
          >
            <Ionicons name="cart-outline" size={20} color={COLORS.white} />
            <Typography
              title={t("purchases.addtoCart")}
              fontSize={scale(14)}
              color={COLORS.white}
              fontFamily="Roboto-Bold"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={dynamicStyles.buyNowButton}
            onPress={toggleFavorite}
          >
            <AntDesign
              name="heart"
              size={24}
              color={isInWishlist(product.id) ? COLORS.danger : COLORS.grey33}
            />
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(6),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    backgroundColor: COLORS.white,
  },
  headerButton: {
    width: scale(40),
    height: scale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: verticalScale(100),
  },
  imageSection: {
    width: SCREEN_WIDTH,
    height: verticalScale(300),
    backgroundColor: COLORS.grey3,
    position: "relative",
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: verticalScale(300),
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imageCounter: {
    position: "absolute",
    bottom: verticalScale(20),
    alignSelf: "center",
    backgroundColor: COLORS.grey16,
    paddingHorizontal: scale(13),
    paddingVertical: verticalScale(5),
    borderRadius: scale(40),
  },
  paginationContainer: {
    flexDirection: "row",
    alignSelf: "center",
    gap: scale(6),
    alignItems: "center",
    marginVertical: verticalScale(14),
  },
  paginationDot: {
    height: scale(7),
  },
  paginationDotInactive: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(4),
    backgroundColor: COLORS.grey4,
  },
  paginationDotActive: {
    width: scale(26),
    height: scale(6),
    borderRadius: scale(40),
    backgroundColor: COLORS.primary,
  },
  contentSection: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  titleSection: {
    marginBottom: verticalScale(20),
  },
  productTitle: {
    marginBottom: verticalScale(8),
    lineHeight: scale(28),
    fontWeight: "600",
  },
  productDescription: {
    lineHeight: scale(20),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    marginBottom: verticalScale(12),
    fontWeight: "600",
  },
  sectionFrame: {
    fontWeight: "600",
  },
  colorCircle: {
    width: scale(47),
    height: scale(47),
    borderRadius: scale(24),
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  colorCircleSelected: {
    borderColor: COLORS.primary,
  },
  colorInner: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(50),
  },
  sizeButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(14),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: COLORS.grey4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  sizeButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  totalPriceContainer: {
    gap: scale(6),
  },
  originalPrice: {
    textDecorationLine: "line-through",
  },

});

export default ProductDetails;