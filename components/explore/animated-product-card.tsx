import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { prescriptionToCartAttributes, useCartStore } from "@/store/cartStore";
import { useWishlistActions } from "@/utils/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";
import SimpleOptimizedImage from "../ui/simple-optimized-image";

export const AnimatedProductCard = ({ item, index }: any) => {
  const { createCart, loading: cartLoading, error: cartError } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistActions();
  const { t, isRtl } = useLocal();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const checkmarkScaleAnim = useRef(new Animated.Value(0)).current;
  const checkmarkOpacityAnim = useRef(new Animated.Value(0)).current;
  const buttonColorAnim = useRef(new Animated.Value(0)).current;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        delay: index * 100,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handlePress = () => {
    router.push(
      `/product-details?id=${item.id}&title=${encodeURIComponent(
        item.category
      )}`
    );
    // router.push(`/product-details?id=${item.id}`);
  };

  const handleAddToCart = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Button pulse animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      let variantId = item.variantId || item.id;
      if (item.variantId) {
        variantId = item.variantId;
      } else if (item.variants && item.variants.length > 0) {
        variantId = item.variants[0].id;
      } else {
        console.error(
          "❌ AnimatedProductCard: No variant information available for product:",
          item.id
        );
        console.error("❌ AnimatedProductCard: Item structure:", item);
        setIsAnimating(false);
        return;
      }

      const cartLine = {
        merchandiseId: variantId,
        quantity: 1,
        attributes: prescriptionToCartAttributes(
          {
            lensType: "Single Vision",
            leftEye: "",
            rightEye: "",
            lensTint: "Clear",
            blueLightFilter: "No",
          },
          item.id
        ),
      };

      const success = await createCart([cartLine]);

      if (success) {
        setShowCheckmark(true);

        // Color transition to green
        Animated.timing(buttonColorAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();

        // Checkmark spring animation
        Animated.parallel([
          Animated.spring(checkmarkScaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(checkmarkOpacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        // Reset after 2 seconds
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(checkmarkScaleAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(checkmarkOpacityAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(buttonColorAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start(() => {
            setShowCheckmark(false);
            setIsAnimating(false);
          });
        }, 2000);
      } else {
        console.error(
          "❌ AnimatedProductCard: Failed to add to cart - success was false"
        );
        console.error("❌ AnimatedProductCard: Cart error:", cartError);
        setIsAnimating(false);
      }
    } catch (error) {
      console.error("❌ AnimatedProductCard: Error adding to cart:", error);
      console.error("❌ AnimatedProductCard: Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        item: item,
      });
      setIsAnimating(false);
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: { uri: item.image },
    });
  };

  // Interpolate background color
  const backgroundColor = buttonColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.primary, "#4CAF50"],
  });

  return (
    <View style={[styles.productCard]}>
      <TouchableOpacity activeOpacity={1} onPress={handlePress}>
        <View style={styles.productImageContainer}>
          <SimpleOptimizedImage
            style={styles.productImagePlaceholder}
            source={{ uri: item.image }}
            contentFit="cover"
            onLoad={() => setImageLoaded(true)}
          />

          {!imageLoaded && (
            <LinearGradient
              colors={["#f0f9ff", "#e0f2fe", "#bae6fd"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.productImagePlaceholder}
            >
              <Ionicons
                name="glasses-outline"
                size={moderateScale(40)}
                color={COLORS.primary}
                style={{ opacity: 0.3 }}
              />
            </LinearGradient>
          )}

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleWishlist}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isInWishlist(item.id) ? "heart" : "heart-outline"}
              size={moderateScale(20)}
              color={isInWishlist(item.id) ? COLORS.danger : COLORS.secondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.productInfo}>
          <Typography
            title={item.name}
            fontSize={moderateScale(16)}
            color={COLORS.secondary}
            fontFamily="Inter-SemiBold"
            textAlign={isRtl ? "right" : "left"}
          />
          <Typography
            title={`${item.category} • KD ${item.price}`}
            fontSize={moderateScale(13)}
            color="#6b7280"
            style={styles.productDetails}
            textAlign={isRtl ? "right" : "left"}
          />

          <Animated.View
            style={[
              styles.addToCartButtonContainer,
              { transform: [{ scale: buttonScaleAnim }] },
            ]}
          >
            <Animated.View
              style={[styles.addToCartButton, { backgroundColor }]}
            >
              <TouchableOpacity
                style={styles.addToCartTouchable}
                disabled={isAnimating}
                onPress={handleAddToCart}
                activeOpacity={0.8}
              >
                {showCheckmark ? (
                  <Animated.View
                    style={{
                      opacity: checkmarkOpacityAnim,
                      transform: [{ scale: checkmarkScaleAnim }],
                      flexDirection: "row",
                      alignItems: "center",
                      gap: scale(6),
                    }}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={moderateScale(20)}
                      color={COLORS.white}
                    />
                    <Typography
                      title="Added!"
                      fontSize={moderateScale(14)}
                      color={COLORS.white}
                      fontFamily="Inter-SemiBold"
                    />
                  </Animated.View>
                ) : (
                  <Typography
                    title={t("purchases.addtoCart")}
                    fontSize={moderateScale(14)}
                    color={COLORS.white}
                    fontFamily="Inter-SemiBold"
                  />
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: (scale(355) - scale(46)) / 2,
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: COLORS.grey24,
  },
  productImageContainer: { position: "relative" },
  productImagePlaceholder: {
    width: "100%",
    height: verticalScale(120),
    backgroundColor: COLORS.grey7,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: verticalScale(12),
    right: scale(12),
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    ...COLORS.shadow,
  },
  productInfo: { padding: scale(12) },
  productDetails: {
    marginTop: verticalScale(4),
    marginBottom: verticalScale(12),
  },
  addToCartButtonContainer: { position: "relative" },
  addToCartButton: {
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
    minHeight: verticalScale(35),
    overflow: "hidden",
  },
  addToCartTouchable: {
    alignItems: "center",
    justifyContent: "center",
  },
});
