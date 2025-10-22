import LensType, { PrescriptionData } from "@/components/product/lens-type";
import VirtualTryOn from "@/components/product/virtual-try-on";
import Typography from "@/components/ui/custom-typography";
import { COLOR_MAP, COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { homeApi, ProductDetailResponse } from "@/services/home/homeApi";
import { prescriptionToCartAttributes, useCartStore } from "@/store/cartStore";
import { useWishlistActions } from "@/utils/wishlist";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
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
  const { id, cartLineId, isFromCart } = useLocalSearchParams<{
    id: string;
    cartLineId?: string;
    isFromCart?: string;
  }>();
  const {
    createCart,
    updateCartLines,
    loading: cartLoading,
    error: cartError,
    loadCart,
    cart,
  } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistActions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<number>(1);
  const [product, setProduct] = useState<
    ProductDetailResponse["product"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [prescriptionData, setPrescriptionData] =
    useState<PrescriptionData | null>(null);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const [existingCartLine, setExistingCartLine] = useState<any>(null);
  const { t, isRtl } = useLocal();

  // Helper function to get color from variant options
  const getColorFromVariant = useCallback((variant: any) => {
    const colorKeywords = ["color", "colour", "frame", "finish", "material"];

    const colorOption = variant.selectedOptions.find((option: any) =>
      colorKeywords.some((keyword) =>
        option.name.toLowerCase().includes(keyword)
      )
    );

    return colorOption?.value || null;
  }, []);

  // Helper function to map color names to hex values
  const getColorHex = (colorName: string) => {
    const color = colorName.toLowerCase().trim();

    if (COLOR_MAP[color]) return COLOR_MAP[color];

    const colorParts = color.split(" ").filter((part) => part.length > 0);
    for (const part of colorParts) {
      if (COLOR_MAP[part]) {
        return COLOR_MAP[part];
      }
    }

    for (const [key, value] of Object.entries(COLOR_MAP)) {
      if (color.includes(key) || key.includes(color)) {
        return value;
      }
    }

    const commonColors = [
      "red",
      "blue",
      "green",
      "yellow",
      "orange",
      "purple",
      "pink",
      "brown",
      "black",
      "white",
      "gray",
      "grey",
      "silver",
      "gold",
    ];
    for (const commonColor of commonColors) {
      if (color.includes(commonColor)) {
        return COLOR_MAP[commonColor] || "#000000";
      }
    }

    if (color.startsWith("#") && color.length === 7) return color;

    const hash = color.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (Math.abs(hash) % 40);
    const lightness = 40 + (Math.abs(hash) % 30);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Helper function to scroll to specific image when color is selected
  const scrollToImage = (imageIndex: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: imageIndex * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  // Helper function to find image index for a variant's image URL
  const findImageIndex = useCallback(
    (imageUrl: string) => {
      if (!product) return 0;
      return product.images.edges.findIndex(
        ({ node }) => node.url === imageUrl
      );
    },
    [product]
  );

  // Helper function to get unique colors from variants with proper image mapping
  const getUniqueColors = useCallback(() => {
    if (!product) return [];

    const uniqueColors = new Map();
    product.variants.edges.forEach(({ node: variant }) => {
      const colorValue = getColorFromVariant(variant);
      if (colorValue && !uniqueColors.has(colorValue)) {
        const imageIndex = variant.image
          ? findImageIndex(variant.image.url)
          : 0;

        uniqueColors.set(colorValue, {
          colorValue,
          firstImageIndex: imageIndex >= 0 ? imageIndex : 0,
          variantId: variant.id,
          variantTitle: variant.title,
        });
      }
    });

    return Array.from(uniqueColors.values());
  }, [product, getColorFromVariant, findImageIndex]);

  const fetchProductDetails = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await homeApi.getProductById(id);
      setProduct(response.product);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
    loadCart(); // Load cart when component mounts
  }, [fetchProductDetails, loadCart]);

  // Handle cart navigation and pre-fill prescription data
  useEffect(() => {
    if (isFromCart === "true" && cartLineId && cart) {
      const cartLine = cart.lines.edges.find(
        ({ node }) => node.id === cartLineId
      );

      if (cartLine) {
        setExistingCartLine(cartLine.node);
        setIsUpdatingCart(true);

        // Pre-fill prescription data from cart attributes
        const attributes = cartLine.node.attributes;
        const prescriptionFromCart: PrescriptionData = {
          lensType:
            attributes.find((attr) => attr.key === "Lens Type")?.value ||
            "Single Vision",
          leftEye:
            attributes.find((attr) => attr.key === "Left Eye (L)")?.value || "",
          rightEye:
            attributes.find((attr) => attr.key === "Right Eye (R)")?.value ||
            "",
          lensTint:
            attributes.find((attr) => attr.key === "Lens Tint")?.value ||
            "Clear",
          blueLightFilter:
            attributes.find((attr) => attr.key === "Blue Light Filter")
              ?.value || "No",
        };

        setPrescriptionData(prescriptionFromCart);
      }
    } else {
      setIsUpdatingCart(false);
    }
  }, [isFromCart, cartLineId, cart]);

  // Dynamic styles for RTL support
  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: scale(6),
          paddingTop: verticalScale(10),
          paddingBottom: verticalScale(10),
          backgroundColor: COLORS.white,
        },
        colorContainer: {
          flexDirection: isRtl ? "row-reverse" : "row",
          gap: scale(12),
          paddingHorizontal: scale(4),
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
          paddingVertical: isRtl ? verticalScale(15) : verticalScale(10),
          alignItems: "center",
        },
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);

    // Find which color variant this image belongs to
    if (product && product.images.edges[index]) {
      const currentImageUrl = product.images.edges[index].node.url;

      const matchingVariant = product.variants.edges.find(
        ({ node: variant }) =>
          variant.image && variant.image.url === currentImageUrl
      );

      if (matchingVariant) {
        const colorValue = getColorFromVariant(matchingVariant.node);
        if (colorValue) {
          const uniqueColors = getUniqueColors();
          const matchingColor = uniqueColors.find(
            (color) => color.colorValue === colorValue
          );
          if (matchingColor) {
            setSelectedColor(matchingColor.firstImageIndex + 1);
          }
        }
      }
    }
  };

  const toggleFavorite = () => {
    if (!product) return;

    toggleWishlist({
      id: parseInt(product.id.split("/").pop() || "0", 10),
      name: product.title,
      price: parseFloat(product.priceRange.minVariantPrice.amount),
      image: {
        uri:
          product.featuredImage?.url || product.images.edges[0]?.node.url || "",
      },
    });
  };

  const onAddToCart = async () => {
    if (!product) return;

    if (!prescriptionData) {
      Alert.alert(
        "Prescription Required",
        "Please fill in your prescription details in the form above before adding to cart.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      // Get the selected variant
      const selectedVariant = product.variants.edges[selectedSize - 1]?.node;
      if (!selectedVariant) {
        Alert.alert("Error", "Please select a variant");
        return;
      }

      // Convert prescription to cart attributes with product ID
      const attributes = prescriptionToCartAttributes(
        prescriptionData,
        product?.id
      );

      if (isUpdatingCart && existingCartLine) {
        const updateLine = {
          id: existingCartLine.id,
          quantity: existingCartLine.quantity,
          attributes,
        };

        const success = await updateCartLines([updateLine]);

        if (success) {
          Alert.alert("Success", "Cart item updated successfully", [
            { text: "OK", onPress: () => router.push("/shopping-cart") },
          ]);
        } else {
          Alert.alert("Error", cartError || "Failed to update cart item");
        }
      } else {
        const cartLine = {
          merchandiseId: selectedVariant.id,
          quantity: 1,
          attributes,
        };

        const success = await createCart([cartLine]);

        if (success) {
          Alert.alert("Success", "Item added to cart successfully", [
            { text: "OK", onPress: () => router.push("/shopping-cart") },
          ]);
        } else {
          Alert.alert("Error", cartError || "Failed to add item to cart");
        }
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handlePrescriptionChange = useCallback(
    (prescription: PrescriptionData | null) => {
      setPrescriptionData(prescription);
    },
    []
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View>
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <View>
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
        <View style={styles.loadingContainer}>
          <Typography
            title="Product not found"
            fontSize={scale(16)}
            color={COLORS.black}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name={isRtl ? "arrow-forward" : "arrow-back"}
            size={24}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Typography
          title={t("home.eyeGlasses")}
          fontSize={scale(18)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          style={[styles.headerTitle, dynamicStyles.textAlign]}
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
            {product.images.edges.map(({ node: image }, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri: image.url }}
                  style={styles.productImage}
                  contentFit="cover"
                />
              </View>
            ))}
          </ScrollView>

          {/* Image Counter Badge */}
          <View style={styles.imageCounter}>
            <Typography
              title={`${currentImageIndex + 1}/${product.images.edges.length}`}
              fontSize={scale(14)}
              color={COLORS.white}
              fontFamily="Roboto-Bold"
            />
          </View>
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {product.images.edges.map((_, index) => {
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
              title={product.title}
              fontSize={scale(22)}
              fontFamily="Poppins-Bold"
              color={COLORS.black}
              style={[styles.productTitle, dynamicStyles.textAlign]}
            />
            <Typography
              title={product.description}
              fontSize={scale(13)}
              color={COLORS.grey16}
              fontFamily="Roboto-Regular"
              style={[styles.productDescription, dynamicStyles.textAlign]}
            />
          </View>

          {/* Frame Color Section */}
          {getUniqueColors().length > 0 ? (
            <View style={styles.section}>
              <Typography
                title={t("eyeglassesDetails.frameColor")}
                fontSize={scale(16)}
                fontFamily="Poppins-Bold"
                color={COLORS.black}
                style={[styles.sectionTitle, dynamicStyles.textAlign]}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={dynamicStyles.colorContainer}
                style={styles.colorScrollView}
              >
                {getUniqueColors().map((colorData) => {
                  const displayColor = colorData.colorValue;

                  return (
                    <TouchableOpacity
                      key={colorData.variantId}
                      style={[
                        styles.colorCircle,
                        selectedColor === colorData.firstImageIndex + 1 &&
                          styles.colorCircleSelected,
                      ]}
                      onPress={() => {
                        setSelectedColor(colorData.firstImageIndex + 1);
                        scrollToImage(colorData.firstImageIndex);
                      }}
                    >
                      <View
                        style={[
                          styles.colorInner,
                          {
                            backgroundColor: getColorHex(displayColor),
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          {/* Frame Size Section */}
          {product.variants.edges.find(({ node: variant }) =>
            variant.selectedOptions.find((option) =>
              option.name.toLowerCase().includes("size")
            )
          ) ? (
            <View style={styles.section}>
              <View style={dynamicStyles.sectionHeader}>
                <Typography
                  title={t("eyeglassesDetails.frameSize")}
                  fontSize={scale(16)}
                  fontFamily="Poppins-Bold"
                  color={COLORS.black}
                  style={[styles.sectionFrame, dynamicStyles.textAlign]}
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
                    style={dynamicStyles.textAlign}
                  />
                </TouchableOpacity>
              </View>
              <View style={dynamicStyles.sizeContainer}>
                {product.variants.edges.map(({ node: variant }, index) => {
                  const sizeOption = variant.selectedOptions.find((option) =>
                    option.name.toLowerCase().includes("size")
                  );
                  if (!sizeOption) return null;

                  return (
                    <TouchableOpacity
                      key={variant.id}
                      style={[
                        styles.sizeButton,
                        selectedSize === index + 1 && styles.sizeButtonSelected,
                      ]}
                      onPress={() => setSelectedSize(index + 1)}
                    >
                      <Typography
                        title={sizeOption.value}
                        fontSize={scale(14)}
                        color={
                          selectedSize === index + 1
                            ? COLORS.white
                            : COLORS.black
                        }
                        fontFamily="Roboto-Bold"
                        style={dynamicStyles.textAlign}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}

          {/* Lens Type Section */}
          <LensType
            onPrescriptionChange={handlePrescriptionChange}
            initialData={
              isUpdatingCart && prescriptionData ? prescriptionData : undefined
            }
          />

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
            style={dynamicStyles.textAlign}
          />
          <View style={dynamicStyles.priceContainer}>
            <Typography
              title={`$${product.priceRange.minVariantPrice.amount}`}
              fontSize={scale(20)}
              fontFamily="Poppins-Bold"
              color={COLORS.primary}
              style={dynamicStyles.textAlign}
            />
            {product.priceRange.maxVariantPrice.amount !==
              product.priceRange.minVariantPrice.amount && (
              <Typography
                title={`$${product.priceRange.maxVariantPrice.amount}`}
                fontSize={scale(14)}
                color={COLORS.grey10}
                style={[styles.originalPrice, dynamicStyles.textAlign]}
              />
            )}
          </View>
        </View>
        <View style={dynamicStyles.buyNowButtonContainer}>
          <TouchableOpacity
            style={[
              dynamicStyles.addToCartButton,
              !prescriptionData && styles.addToCartButtonDisabled,
            ]}
            onPress={onAddToCart}
            disabled={cartLoading}
          >
            {cartLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="cart-outline" size={20} color={COLORS.white} />
                <Typography
                  title={
                    isUpdatingCart
                      ? "Update Cart Item"
                      : t("purchases.addtoCart")
                  }
                  fontSize={scale(14)}
                  color={COLORS.white}
                  fontFamily="Roboto-Bold"
                  style={dynamicStyles.textAlign}
                />
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={dynamicStyles.buyNowButton}
            onPress={toggleFavorite}
          >
            <AntDesign
              name="heart"
              size={24}
              color={
                isInWishlist(parseInt(product?.id?.split("/").pop() || "0", 10))
                  ? COLORS.danger
                  : COLORS.grey33
              }
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(50),
  },
  colorScrollView: {
    marginVertical: verticalScale(8),
  },
  addToCartButtonDisabled: {
    backgroundColor: COLORS.grey4,
    opacity: 0.6,
  },
});

export default ProductDetails;
