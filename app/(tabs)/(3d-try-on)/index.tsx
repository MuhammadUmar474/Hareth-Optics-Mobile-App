import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import { styles } from "@/styles/3d-try-on/3d-try-on";

const TryOnViewer = () => {
  const{t}=useLocal()
  const [isViewerActive, setIsViewerActive] = useState(false);

  const handleStartTryOn = () => {
    setIsViewerActive(true);
  };

  const handleClose = () => {
    setIsViewerActive(false);
  };

  return (
    <View style={styles.container}>
      <Header
        title={isViewerActive ? "3D Viewer" : "3D Try-on"}
        onBack={handleClose}
      />

      <View style={[styles.contentContainer]}>
        {!isViewerActive ? (
          <>
            <View style={styles.placeholderContainer}>
              <View style={styles.placeholder}>
                <Ionicons
                  name="camera-outline"
                  size={moderateScale(60)}
                  color={COLORS.grey6}
                />
                <Typography
                  title={t("tryOn.cameraPlaceholder")}
                  fontSize={SIZES.desc}
                  color={COLORS.grey6}
                  style={styles.placeholderText}
                />
              </View>
              <Button style={styles.startButton} onPress={handleStartTryOn}>
                <Typography
                  title={t("tryOn.startTryOn")}
                  fontSize={SIZES.desc}
                  color={COLORS.white}
                  style={styles.buttonText}
                />
              </Button>
            </View>
          </>
        ) : (
          // 3D Viewer Screen
          <>
            <View style={styles.viewerContainer}>
              <View style={[styles.viewer3D]}>
                <Ionicons
                  name="cube-outline"
                  size={moderateScale(80)}
                  color={COLORS.grey6}
                />
                <Typography
                  title="3D viewer placeholder"
                  fontSize={SIZES.desc}
                  color={COLORS.grey6}
                  style={styles.placeholderText}
                />
              </View>
            </View>

            <View style={styles.integrationNote}>
              <Typography
                title="Integration note: mount the Fittingbox 3D viewer into the container above."
                fontSize={SIZES.caption}
                color={COLORS.black4}
                style={styles.noteText}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default TryOnViewer;
