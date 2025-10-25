import { COLORS } from "@/constants/colors";
import { useDynamicStyles } from "@/constants/dynamicStyles";
import React from "react";
import { StyleSheet, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { Skeleton } from "./ui/skeletons";

export const CardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Skeleton style={styles.skeletonCard}>
          <Skeleton style={styles.skeletonImage} />
          <View style={styles.skeletonContent}>
            <Skeleton style={styles.skeletonTitle} />
            <View style={styles.skeletonTextContainer}>
              <Skeleton style={styles.skeletonText1} />
              <Skeleton style={styles.skeletonText2} />
            </View>
            <Skeleton style={styles.skeletonSubtitle} />
          </View>
        </Skeleton>
      </View>

      <View style={styles.card}>
        <Skeleton style={styles.skeletonCard}>
          <Skeleton style={styles.skeletonImage} />
          <View style={styles.skeletonContent}>
            <Skeleton style={styles.skeletonTitle} />
            <View style={styles.skeletonTextContainer}>
              <Skeleton style={styles.skeletonText1} />
              <Skeleton style={styles.skeletonText2} />
            </View>
            <Skeleton style={styles.skeletonSubtitle} />
          </View>
        </Skeleton>
      </View>

      <View style={styles.card}>
        <Skeleton style={styles.skeletonCard}>
          <Skeleton style={styles.skeletonImage} />
          <View style={styles.skeletonContent}>
            <Skeleton style={styles.skeletonTitle} />
            <View style={styles.skeletonTextContainer}>
              <Skeleton style={styles.skeletonText1} />
              <Skeleton style={styles.skeletonText2} />
            </View>
            <Skeleton style={styles.skeletonSubtitle} />
          </View>
        </Skeleton>
      </View>
    </View>
  );
};

export const ExploreCardSkeleton: React.FC = () => {
  const commonStyles=useDynamicStyles();
  return (
    <View style={styles.container}>
      <View style={[styles.skeletonRow,commonStyles.horizontal]}>
        <View style={styles.card}>
          <Skeleton style={styles.skeletonCard}>
            <Skeleton style={styles.skeletonImage} />
            <View style={styles.skeletonContent}>
              <Skeleton style={styles.skeletonTitle} />
              <View style={styles.skeletonTextContainer}>
                <Skeleton style={styles.skeletonText1} />
                <Skeleton style={styles.skeletonText2} />
              </View>
              <Skeleton style={styles.skeletonSubtitle} />
            </View>
          </Skeleton>
        </View>

        <View style={styles.card}>
          <Skeleton style={styles.skeletonCard}>
            <Skeleton style={styles.skeletonImage} />
            <View style={styles.skeletonContent}>
              <Skeleton style={styles.skeletonTitle} />
              <View style={styles.skeletonTextContainer}>
                <Skeleton style={styles.skeletonText1} />
                <Skeleton style={styles.skeletonText2} />
              </View>
              <Skeleton style={styles.skeletonSubtitle} />
            </View>
          </Skeleton>
        </View>
      </View>

      <View style={[styles.skeletonRow,commonStyles.horizontal]}>
        <View style={styles.card}>
          <Skeleton style={styles.skeletonCard}>
            <Skeleton style={styles.skeletonImage} />
            <View style={styles.skeletonContent}>
              <Skeleton style={styles.skeletonTitle} />
              <View style={styles.skeletonTextContainer}>
                <Skeleton style={styles.skeletonText1} />
                <Skeleton style={styles.skeletonText2} />
              </View>
              <Skeleton style={styles.skeletonSubtitle} />
            </View>
          </Skeleton>
        </View>

        <View style={styles.card}>
          <Skeleton style={styles.skeletonCard}>
            <Skeleton style={styles.skeletonImage} />
            <View style={styles.skeletonContent}>
              <Skeleton style={styles.skeletonTitle} />
              <View style={styles.skeletonTextContainer}>
                <Skeleton style={styles.skeletonText1} />
                <Skeleton style={styles.skeletonText2} />
              </View>
              <Skeleton style={styles.skeletonSubtitle} />
            </View>
          </Skeleton>
        </View>
      </View>
    </View>
  );
};

export const ProductsSkeleton: React.FC = () => {
  const commonStyles=useDynamicStyles();
  return (
    <View style={styles.productsContainer}>
      <View style={[styles.productsList,commonStyles.horizontal]}>
        {[1, 2, 3, 4, 5].map((index) => (
          <View key={index} style={styles.productItem}>
            <Skeleton style={styles.productImageSkeleton} />
            <Skeleton style={styles.productNameSkeleton} />
          </View>
        ))}
      </View>
    </View>
  );
};

export const TrendingNowSkeleton: React.FC = () => {
  const commonStyles=useDynamicStyles();
  return (
    <View style={styles.trendingContainer}>
      <View style={[styles.trendingList,commonStyles.horizontal]}>
        {[1, 2, 3].map((index) => (
          <View key={index} style={styles.trendingCard}>
            <Skeleton style={styles.trendingCardImage} />
            <View style={styles.trendingTextContainer}>
              <Skeleton style={styles.trendingCardTitle} />
              <Skeleton style={styles.trendingCardSubtitle} />
              <Skeleton style={styles.trendingButton} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  skeletonRow: {
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
  card: {
    borderRadius: scale(16),
    alignSelf: "center",
    marginVertical: verticalScale(8),
    width: scale(166),
    paddingHorizontal: scale(6),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skeletonCard: {
    width: "100%",
    alignSelf: "center",
    marginBottom: verticalScale(4),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: scale(16),
    backgroundColor: COLORS.white,
  },
  skeletonImage: {
    width: "100%",
    height: verticalScale(112),
    backgroundColor: COLORS.grey4,
  },
  skeletonContent: {
    width: "100%",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(16),
    gap: verticalScale(10),
  },
  skeletonTitle: {
    height: scale(8),
    width: scale(56),
    backgroundColor: COLORS.grey4,
    marginTop: verticalScale(6),
  },
  skeletonTextContainer: {
    marginVertical: verticalScale(4),
    gap: verticalScale(10),
  },
  skeletonText1: {
    height: scale(8),
    width: scale(112),
    backgroundColor: COLORS.grey4,
  },
  skeletonText2: {
    height: scale(8),
    width: scale(128),
    backgroundColor: COLORS.grey4,
  },
  skeletonSubtitle: {
    height: scale(8),
    width: scale(80),
    backgroundColor: COLORS.grey4,
  },
  productsContainer: {
    paddingVertical: verticalScale(16),
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(12),
  },
  productsTitle: {
    height: scale(20),
    width: scale(120),
    backgroundColor: COLORS.grey4,
  },
  productsViewAll: {
    height: scale(14),
    width: scale(60),
    backgroundColor: COLORS.grey4,
  },
  productsList: {
    paddingHorizontal: scale(22),
    gap: scale(20),
  },
  productItem: {
    alignItems: "center",
  },
  productImageSkeleton: {
    width: 70,
    height: 70,
    borderRadius: scale(12),
    marginBottom: verticalScale(8),
    backgroundColor: COLORS.grey4,
  },
  productNameSkeleton: {
    height: scale(12),
    width: 70,
    backgroundColor: COLORS.grey4,
  },
  // Trending Now Skeleton Styles
  trendingContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  trendingHeader: {
    marginBottom: verticalScale(16),
  },
  trendingTitle: {
    height: scale(20),
    width: scale(200),
    backgroundColor: COLORS.grey4,
  },
  trendingList: {
    gap: scale(12),
    paddingRight: scale(16),
  },
  trendingCard: {
    width: scale(280),
    backgroundColor: COLORS.white,
    borderRadius: scale(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.11,
    shadowRadius: 12,
    elevation: 6,
    marginHorizontal: scale(4),
    marginBottom: verticalScale(6),
  },
  trendingCardImage: {
    width: "100%",
    height: verticalScale(100),
    backgroundColor: COLORS.grey4,
  },
  trendingTextContainer: {
    flex: 1,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(16),
  },
  trendingCardTitle: {
    height: scale(12),
    width: scale(50),
    backgroundColor: COLORS.grey3,
    marginBottom: verticalScale(4),
  },
  trendingCardSubtitle: {
    height: scale(13),
    width: scale(120),
    backgroundColor: COLORS.grey3,
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  trendingButton: {
    height: scale(20),
    width: scale(60),
    backgroundColor: COLORS.grey3,
    borderRadius: scale(40),
    marginBottom: verticalScale(16),
  },
});
