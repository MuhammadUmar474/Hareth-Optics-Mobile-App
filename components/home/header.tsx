import { COLORS } from "@/constants/colors";
import { suggestionCategories } from "@/constants/data";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
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

const StickyHeader = () => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const cartCount = useCartStore((state) => state.cartCount);
  const wishlistCount = useWishlistStore((state) => state.wishlistCount);
  const [isVisible, setIsVisible] = useState(false);

  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={() => router.push("/(tabs)/(profile)")}>
            <Image
              source={require("@/assets/images/home/profile.png")}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileText}>Get Faster Delivery</Text>
            <TouchableOpacity
              style={styles.locationContainer}
              onPress={() => setIsVisible(true)}
            >
              <Text style={styles.locationText}>Select Location</Text>
              <Ionicons
                name="chevron-down"
                size={13}
                color={COLORS.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => router.push("/wishlist")}
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
            onPress={() => router.push("/shopping-cart")}
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
        placeholder="What you are looking for?"
        containerStyle={styles.inputContainer}
        inputContainerStyle={styles.inputContainerStyle}
        leftAccessory={
          <Feather name="search" size={20} color={COLORS.primary} />
        }
        rightAccessory={
          <View style={styles.rightIconContainer}>
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
        contentContainerStyle={styles.suggestionContainer}
        style={styles.suggestionScrollView}
      >
        {suggestionCategories.map((category) => (
          <SuggestionTab
            key={category.id}
            title={category.title}
            lefticon={
              category.iconLibrary === "ionicons" ? (
                <Ionicons
                  name={category.iconName as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={
                    selectedCategories.includes(category.id)
                      ? COLORS.white
                      : COLORS.primary
                  }
                />
              ) : (
                <Feather
                  name={category.iconName as keyof typeof Feather.glyphMap}
                  size={16}
                  color={
                    selectedCategories.includes(category.id)
                      ? COLORS.white
                      : COLORS.primary
                  }
                />
              )
            }
            isSelected={selectedCategories.includes(category.id)}
            onPress={() => handleCategoryPress(category.id)}
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
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: scale(10),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(8),
    gap: scale(10),
  },
  profileImage: {
    width: scale(30),
    height: verticalScale(30),
    borderRadius: 15,
  },
  profileTextContainer: {
    gap: scale(4),
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: scale(12),
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
  rightIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: scale(10),
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
  suggestionContainer: {
    flexDirection: "row",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(8),
    gap: scale(8),
    alignItems: "center",
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
