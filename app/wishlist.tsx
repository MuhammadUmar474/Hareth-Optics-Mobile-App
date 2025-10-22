import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/shopifyStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Wishlist = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { wishlistItems, removeFromWishlist, setCurrentUser } = useWishlistStore();
  const { t, isRtl } = useLocal();
  const addToCart = useCartStore((state) => state.addToCart);

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
          borderBottomWidth: 1,
          borderBottomColor: COLORS.grey4,
        },
        textAlign: {
          textAlign: isRtl ? "right" : "left",
        },
      }),
    [isRtl]
  );

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setCurrentUser(user.email);
    }
  }, [isAuthenticated, user?.email, setCurrentUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, router]);

  // ==========================
  // ADD TO CART WITH ANIMATION
  // ==========================
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const checkmarkScaleAnim = useRef(new Animated.Value(0)).current;
  const checkmarkOpacityAnim = useRef(new Animated.Value(0)).current;

  const [showCheckmark, setShowCheckmark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = (item: any) => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Bounce animation
    Animated.sequence([
      Animated.spring(buttonScaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    // Add to cart action
    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image,
    });

    // Show checkmark animation
    setShowCheckmark(true);
    Animated.parallel([
      Animated.spring(checkmarkScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 5,
      }),
      Animated.timing(checkmarkOpacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide checkmark after delay
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
      ]).start(() => {
        setShowCheckmark(false);
        setIsAnimating(false);
      });
    }, 1200);
  };

  // ==========================

  if (wishlistItems.length === 0) {
    return (
      <View style={styles.container}>
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
            title={t("wishlist.wishlist")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.headerTitle, dynamicStyles.textAlign]}
          />
          <View style={styles.headerButton} />
        </View>

        <View style={styles.emptyWishlistContainer}>
          <Image
            source={require("@/assets/images/home/favorite-hareth.png")}
            style={styles.illustrationImage}
            contentFit="contain"
          />
          <Typography
            title={t("wishlist.elevateStyle")}
            fontSize={scale(24)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={[styles.emptyWishlistTitle, dynamicStyles.textAlign]}
          />
          <Typography
            title={t("wishlist.elevatDescription")}
            fontSize={scale(14)}
            fontFamily="Roboto-Regular"
            color={COLORS.grey29}
            style={[styles.emptyWishlistMessage, dynamicStyles.textAlign]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          title={t("wishlist.wishlist")}
          fontSize={scale(18)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          style={[styles.headerTitle, dynamicStyles.textAlign]}
        />
        <View style={styles.headerButton} />
      </View>

      <FlatList
        data={wishlistItems}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => removeFromWishlist(item.id)}
            >
              <Ionicons name="heart" size={20} color={COLORS.danger} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push(`/product-details?id=${item.id}`)}
            >
              <Image source={item.image} style={styles.productImage} />
            </TouchableOpacity>

            <View style={styles.productInfo}>
              <Typography
                title={item.name}
                fontSize={scale(12)}
                fontFamily="Roboto-Bold"
                color={COLORS.black}
                numberOfLines={2}
                style={[styles.productName, dynamicStyles.textAlign]}
              />
              <Typography
                title={`$${item.price.toFixed(2)}`}
                fontSize={scale(14)}
                fontFamily="Roboto-Bold"
                color={COLORS.primary}
                style={[styles.productPrice, dynamicStyles.textAlign]}
              />

              {/* ==== Animated Add to Cart Button ==== */}
              <Animated.View
                style={[
                  styles.addToCartButtonContainer,
                  { transform: [{ scale: buttonScaleAnim }] },
                ]}
              >
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => handleAddToCart(item)}
                  disabled={isAnimating}
                  activeOpacity={0.8}
                >
                  {!showCheckmark && (
                    <Typography
                      title={t("purchases.addtoCart")}
                      fontSize={moderateScale(12)}
                      color={COLORS.white}
                      fontFamily="Roboto-Bold"
                    />
                  )}

                  {showCheckmark && (
                    <Animated.View
                      style={{
                        opacity: checkmarkOpacityAnim,
                        transform: [{ scale: checkmarkScaleAnim }],
                        position: "absolute",
                        alignSelf: "center",
                      }}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={moderateScale(24)}
                        color={COLORS.white}
                      />
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  headerButton: {
    width: scale(40),
    height: scale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontWeight: "600" },
  emptyWishlistContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(12),
  },
  illustrationImage: {
    width: scale(240),
    height: scale(240),
    resizeMode: "contain",
  },
  emptyWishlistTitle: {
    fontWeight: "600",
    marginBottom: verticalScale(12),
  },
  emptyWishlistMessage: {
    lineHeight: scale(22),
    paddingHorizontal: scale(16),
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(40),
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
  productCard: {
    width: (SCREEN_WIDTH - scale(48)) / 2,
    backgroundColor: COLORS.white,
    borderRadius: scale(16),
    overflow: "hidden",
    elevation: 4,
    borderWidth: 0.5,
    borderColor: COLORS.grey4,
  },
  favoriteButton: {
    position: "absolute",
    top: scale(12),
    right: scale(12),
    zIndex: 10,
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: { width: "100%", height: scale(120), resizeMode: "cover" },
  productInfo: { padding: scale(12), gap: scale(6) },
  productName: { fontWeight: "600", minHeight: scale(32) },
  productPrice: { fontWeight: "600" },
  addToCartButtonContainer: { position: "relative" },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(10),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(4),
    minHeight: verticalScale(35),
  },
});

export default Wishlist;
