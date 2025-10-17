import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { useCartStore } from "@/store/cartStore";
import { useWishlistActions } from "@/utils/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Typography from "../ui/custom-typography";

export const AnimatedProductCard = ({
  item,
  index,
  onToggleFavorite,
  isFavorite,
}: any) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistActions();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [imageLoaded, setImageLoaded] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const {t}=useLocal();
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

    // Start spinner animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [index, scaleAnim, fadeAnim, spinAnim]);

  const handlePress = () => {
    router.push(`/product-details`);
  };

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: { uri: item.image },
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: { uri: item.image },
    });
  };

  return (
    <Animated.View
      style={[
        styles.productCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={1} onPress={handlePress}>
        <View style={styles.productImageContainer}>
          <Image
            style={styles.productImagePlaceholder}
            source={{ uri: item.image }}
            contentFit="cover"
            transition={300}
            cachePolicy="memory-disk"
            onLoadEnd={() => setImageLoaded(true)}
          />

          {!imageLoaded && (
            <LinearGradient
              colors={["#f0f9ff", "#e0f2fe", "#bae6fd"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.productImagePlaceholder,
                { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
              ]}
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
            <Animated.View>
              <Ionicons
                name={isInWishlist(item.id) ? "heart" : "heart-outline"}
                size={moderateScale(20)}
                color={isInWishlist(item.id) ? COLORS.danger : COLORS.secondary}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.productInfo}>
          <Typography
            title={item.name}
            fontSize={moderateScale(16)}
            color={COLORS.secondary}
            fontFamily="Inter-SemiBold"
          />
          <Typography
            title={`${item.category} • KD ${item.price}`}
            fontSize={moderateScale(13)}
            color="#6b7280"
            style={styles.productDetails}
          />

          <TouchableOpacity
            style={styles.addToCartButton}
            activeOpacity={0.8}
            onPress={handleAddToCart}
          >
            <Typography
              title={t("purchases.addtoCart")}
              fontSize={moderateScale(14)}
              color={COLORS.white}
              fontFamily="Inter-SemiBold"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const styles = StyleSheet.create({
  productCard: {
    width: (scale(355) - scale(46)) / 2,
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: COLORS.grey24,
  },
  productImageContainer: {
    position: "relative",
  },
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
  productInfo: {
    padding: scale(12),
  },
  productDetails: {
    marginTop: verticalScale(4),
    marginBottom: verticalScale(12),
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
});
