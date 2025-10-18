import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { useLocal } from "@/hooks/use-lang";
import { styles } from "@/styles/home/visual-try";
import { router } from "expo-router";

const VisualSearch = () => {
  const {t}=useLocal()
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleChoosePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access camera roll is required!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const handleFindSimilar = () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select an image first");
      return;
    }
    router.navigate("/(tabs)/(explore)");
  };

  const handleOpenCamera = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access camera is required!"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleARTryOn = () => {
    router.navigate("/(tabs)/(3d-try-on)");
  };

  const handleQRScan = () => {
    console.log("Scan QR");
  };

  return (
    <View style={styles.container}>
      <Header title={t("visualSearch.visualSearch")} />

      <ScrollView style={[styles.contentContainer]} showsVerticalScrollIndicator={false}>
        {/* Selected Image Display */}
        {selectedImage && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Typography
                title="Remove Image"
                fontSize={12}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <Typography
            title={t("visualSearch.uploadPhoto")}
            fontSize={16}
            style={styles.cardTitle}
          />
          <Typography
            title={t("visualSearch.similarFrame")}
            fontSize={13}
            color={COLORS.black4}
            style={styles.cardSubtitle}
          />

          <View style={styles.buttonRow}>
            <Button
              bordered
              style={styles.secondaryButton}
              onPress={handleChoosePhoto}
            >
              <Typography
                title={t("visualSearch.choosePhoto")}
                fontSize={15}
                color={COLORS.black}
              />
            </Button>

            <Button style={styles.primaryButton} onPress={handleFindSimilar}>
              <Typography
                title={t("visualSearch.findSimilar")}
                fontSize={15}
                color={COLORS.white}
              />
            </Button>
          </View>
        </View>

        {/* Click Photo Section */}
        <View style={styles.card}>
          <Typography
            title={t("visualSearch.clickPhoto")}
            fontSize={18}
            style={styles.cardTitle}
          />
          <Typography
            title={t("visualSearch.cameraSearchImage")}
            fontSize={15}
            color={COLORS.black4}
            style={styles.cardSubtitle}
          />

          <Button style={styles.cameraButton} onPress={handleOpenCamera}>
            <Typography
              title={t("visualSearch.openCamera")}
              fontSize={16}
              color={COLORS.white}
              style={styles.buttonText}
            />
          </Button>
        </View>

        <View style={styles.card}>
          <Typography
            title={t("visualSearch.discoverCameraOptions")}
            fontSize={18}
            style={styles.cardTitle}
          />

          <TouchableOpacity style={styles.optionButton} onPress={handleARTryOn}>
            <Typography
              title={t("visualSearch.tryFrameonYourFace")}
              fontSize={15}
              color={COLORS.black}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleQRScan}>
            <Typography
              title={t("visualSearch.scanQR")}
              fontSize={15}
              color={COLORS.black}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default VisualSearch;
