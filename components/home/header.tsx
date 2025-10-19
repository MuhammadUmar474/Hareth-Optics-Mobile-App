import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { MenuItem } from "@/services/home/homeApi";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useWishlistAuth } from "@/utils/wishlist";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import LocationModal from "../modals/location-modal";
import Input from "../ui/input";
import SuggestionTab from "./suggestion-tab";

const StickyHeader = ({ categories, setHandle }: { categories: MenuItem[], setHandle: (handle: string) => void }) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const cartCount = useCartStore((state) => state.cartCount);
  const wishlistCount = useWishlistStore((state) => state.wishlistCount);
  const [isVisible, setIsVisible] = useState(false);
  const { checkAuthForWishlistView } = useWishlistAuth();

  const { isRtl,t } = useLocal();
  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategories([categoryId]);
  };
  const dynamicStyles = useMemo(
    () => StyleSheet.create({
      profileContainer: {
        flexDirection: isRtl ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: scale(10),
      },
      headerContainer: {
        flexDirection: isRtl ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between" as const,
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(8),
        gap: scale(10),
      },
      locationContainer: {
        flexDirection: isRtl ? "row-reverse" : "row",
        alignItems: "flex-end",
      },
      headerIcons: {
        flexDirection: isRtl ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: scale(12),
      },
      rightIconContainer: {
        flexDirection: isRtl ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: scale(10),
      },
      suggestionContainer: {
        flexDirection: isRtl ? "row-reverse" : "row",
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(8),
        gap: scale(8),
        alignItems: "center",
      },
    }),
    [isRtl]
  );
  return (
    <View style={styles.container}>
      <View style={dynamicStyles.headerContainer}>
        <View style={dynamicStyles.profileContainer}>
          <TouchableOpacity onPress={() => router.push("/(tabs)/(profile)")}>
            <Image
              source={require("@/assets/images/home/profile.png")}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileText}>{t("home.getFasterDel")}</Text>
            <TouchableOpacity
              style={dynamicStyles.locationContainer}
              onPress={() => setIsVisible(true)}
            >
              <Text style={styles.locationText}>{t("home.selectLocation")}</Text>
              <Ionicons
                name="chevron-down"
                size={13}
                color={COLORS.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={dynamicStyles.headerIcons}>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => {
              if (checkAuthForWishlistView()) {
                router.navigate("/wishlist");
              }
            }}
          >
            <FontAwesome6 name="heart" size={20} color={COLORS.black} />
            {wishlistCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => router.navigate("/shopping-cart")}
          >
            <Ionicons name="cart-outline" size={22} color={COLORS.black} />
            {cartCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cartCount > 9 ? "9+" : cartCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      <Input
        placeholder={t("home.lookingFor")}
        containerStyle={styles.inputContainer}
        inputContainerStyle={styles.inputContainerStyle}
        leftAccessory={
          <Feather name="search" size={20} color={COLORS.primary} />
        }
        rightAccessory={
          <View style={dynamicStyles.rightIconContainer}>
            <TouchableOpacity
              onPress={() => {
                router.navigate("/(tabs)/(a-home)/scan-product");
              }}
            >
              <Image
                source={require("@/assets/images/home/focus.png")}
                style={styles.rightIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.navigate("/(tabs)/(a-home)/visual-search");
              }}
            >
              <Image
                source={require("@/assets/images/home/four-squares-view.png")}
                style={styles.rightIcon}
              />
            </TouchableOpacity>
          </View>
        }
      />
      <LocationModal isVisible={isVisible} setIsVisible={setIsVisible} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.suggestionContainer}
        style={styles.suggestionScrollView}
      >
        {categories.map((category,index) => (
          <SuggestionTab
            key={category.id}
            title={category.title}
            isSelected={selectedCategories.includes(index)}
            onPress={() => {handleCategoryPress(index)
              setHandle(category.resource?.handle ?? "");
            }}
            containerStyle={styles.suggestionTab}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default StickyHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: COLORS.white,
    paddingHorizontal: scale(8),
    borderBottomWidth: 1,
    borderColor: COLORS.grey4,
  },
  profileImage: {
    width: scale(30),
    height: verticalScale(30),
    borderRadius: 15,
  },
  profileTextContainer: {
    gap: scale(4),
  },
  icon: {
    width: scale(30),
    height: scale(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(7),
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey10,
  },
  rightIcon: {
    width: scale(16),
    height: scale(16),
  },
  profileText: {
    fontSize: scale(12),
    fontWeight: "500",
    color: COLORS.orange,
  },
  locationText: {
    fontSize: scale(12),
    fontWeight: "500",
    color: COLORS.black,
    textDecorationLine: "underline",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.grey4,
    borderRadius: scale(12),
    marginHorizontal: scale(8),
    width: "96%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(2.5),
    marginVertical: verticalScale(4),
  },
  inputContainerStyle: {
    backgroundColor: COLORS.white,
    borderWidth: 0,
  },
  suggestionScrollView: {
    maxHeight: verticalScale(50),
  },

  suggestionTab: {
    marginVertical: verticalScale(2),
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLORS.danger,
    borderRadius: scale(10),
    minWidth: scale(16),
    height: scale(16),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(4),
  },
  badgeText: {
    color: COLORS.white,
    fontSize: scale(9),
    fontWeight: "bold",
    textAlign: "center",
  },
});
