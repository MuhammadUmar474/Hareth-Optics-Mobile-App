import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  content: {
    flex: 1,
  },

  productsContainer: {
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(100),
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
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
  productPlaceholderText: {
    opacity: 0.5,
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
});
