import BestSelling from "@/components/home/best-selling";
import Brands from "@/components/home/brands";
import StickyHeader from "@/components/home/header";
import NearByStores from "@/components/home/near-by-stores";
import OurPromiseComponent from "@/components/home/our-promise";
import PaymentMethods from "@/components/home/payment-methods";
import Products from "@/components/home/products";
import TrendingNow from "@/components/home/trending-now";
import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import {
  glassesBrandsData,
  ourPromiseData,
  paymentMethodTypes,
  storeBenefits,
} from "@/constants/data";
import { homeApi, MenuItem } from "@/services/home/homeApi";
import { useAuthGuard } from "@/utils/auth";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const HomeScreen = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [categories, setCategories] = useState<MenuItem[]>([]);

  const { checkAuthAndNavigate } = useAuthGuard();


  const handleGetCategories = async () => {
    const categories = await homeApi.getCategories();
    setCategories(
      categories.filter((category) => category.type === "COLLECTION")
    );
  };
  useEffect(() => {
    handleGetCategories();
  }, []);

  const player = useVideoPlayer(
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    (player) => {
      player.loop = false;
    }
  );

  const handlePlayPress = () => {
    if (player) {
      player.play();
      setIsPlaying(true);
    }
  };

  player.addListener("playingChange", (newIsPlaying) => {
    setIsPlaying(newIsPlaying.isPlaying);
  });

  const onProductPress = () => {
    checkAuthAndNavigate(
      `/(tabs)/(explore)`,
      "Please login to explore products"
    );
  };

 
  return (
    <View style={styles.container}>
      <StickyHeader categories={categories} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TrendingNow />




        {categories.map((category) => (
          <Products
            key={category.id}
            productCategory={category.items || []}
            onProductPress={onProductPress}
            title={category.title}
          />
        ))}

        <PaymentMethods paymentMethods={paymentMethodTypes} />

        <Brands brands={glassesBrandsData} />

        <OurPromiseComponent
          promises={ourPromiseData}
          title="Hareth Optics Promise"
        />

        <BestSelling />

        <Brands brands={glassesBrandsData} latest />

        <NearByStores />

        <OurPromiseComponent promises={storeBenefits} title="Store Benefits" />

        {/* Video Component */}
        <View style={styles.videoContainer}>
          <View style={styles.videoWrapper}>
            <VideoView
              player={player}
              style={styles.video}
              allowsFullscreen
              allowsPictureInPicture
              nativeControls
            />
            {!isPlaying && (
              <>
                <TouchableOpacity
                  style={styles.overlayContainer}
                  onPress={handlePlayPress}
                  activeOpacity={0.9}
                >
                  <View style={styles.playButton}>
                    <Ionicons name="play" size={20} color={COLORS.black} />
                  </View>
                </TouchableOpacity>
                <Typography
                  title="FROM THE FACTORY STRAIGHT TO YOU"
                  fontSize={moderateScale(14)}
                  color={COLORS.white}
                  style={styles.overlayText}
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 2,
  },
  videoContainer: {
    width: "100%",
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(130),
  },
  videoWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: scale(8),
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  overlayText: {
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
