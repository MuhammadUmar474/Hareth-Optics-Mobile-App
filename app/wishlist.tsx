import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/shopifyStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Wishlist = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { wishlistItems, removeFromWishlist, setCurrentUser } = useWishlistStore();
  const{t,isRtl}=useLocal()
  const addToCart = useCartStore((state) => state.addToCart);

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

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  if (wishlistItems.length === 0) {
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
            title={t("wishlist.wishlist")}
            fontSize={scale(18)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={styles.headerTitle}
          />
          <View style={styles.headerButton} />
        </View>

        <View style={styles.emptyWishlistContainer}>
          <View style={styles.illustrationContainer}>
              <Image 
                source={require("@/assets/images/home/favorite-hareth.png")}
                style={styles.illustrationImage}
                contentFit="contain"
              />
          </View>

          <Typography
            title={t("wishlist.elevateStyle")}
            fontSize={scale(24)}
            fontFamily="Poppins-Bold"
            color={COLORS.black}
            style={styles.emptyWishlistTitle}
          />
          <Typography
            title={t("wishlist.elevatDescription")}
            fontSize={scale(14)}
            fontFamily="Roboto-Regular"
            color={COLORS.grey29}
            style={styles.emptyWishlistMessage}
          />
        </View>
      </View>
    );
  }

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
          title={t("wishlist.wishlist")}
          fontSize={scale(18)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          style={styles.headerTitle}
        />
        <View style={styles.headerButton} />
      </View>

      <FlatList
        data={wishlistItems}
        keyExtractor={(item, index) => `${item.id}-${item.name}-${index}`}
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

            <TouchableOpacity onPress={() => router.push(`/product-details?id=${item.id}`)}>
              <Image source={item.image} style={styles.productImage} />
            </TouchableOpacity>

            <View style={styles.productInfo}>
              <Typography
                title={item.name}
                fontSize={scale(12)}
                fontFamily="Roboto-Bold"
                color={COLORS.black}
                style={styles.productName}
                numberOfLines={2}
                textAlign={isRtl?"right":"left"}
              />
              <Typography
                title={`$${item.price.toFixed(2)}`}
                fontSize={scale(14)}
                fontFamily="Roboto-Bold"
                color={COLORS.primary}
                style={styles.productPrice}
                textAlign={isRtl?"right":"left"}
              />
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => handleAddToCart(item)}
              >
                <Typography
                  title={t("purchases.addtoCart")}
                  fontSize={scale(12)}
                  color={COLORS.white}
                  fontFamily="Roboto-Bold"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Wishlist;

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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey4,
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
  emptyWishlistContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(12),
  },
  illustrationContainer: {
    marginBottom: verticalScale(4),
  },
  illustrationImage: {
    width: scale(240),
    height: scale(240),
    resizeMode: "contain",
  },
  emptyWishlistTitle: {
    fontWeight: "600",
    textAlign: "center",
    marginBottom: verticalScale(12),
  },
  emptyWishlistMessage: {
    textAlign: "center",
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
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: scale(120),
    resizeMode: "cover",
  },
  productInfo: {
    padding: scale(12),
    gap: scale(6),
  },
  productName: {
    fontWeight: "600",
    minHeight: scale(32),
  },
  productPrice: {
    fontWeight: "600",
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(10),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(4),
  },
});

