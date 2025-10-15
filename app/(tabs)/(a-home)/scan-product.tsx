import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { styles } from "@/styles/3d-try-on/3d-try-on";

const ScanProduct = () => {
  const handleScan = () => {
    router.navigate("/(tabs)/(explore)");
  };

  return (
    <View style={styles.container}>
      <Header title={"Scan Product in Store"} />

      <View style={[styles.contentContainer]}>
        <View style={styles.placeholderContainer}>
          <View style={styles.placeholder}>
            <Ionicons
              name="camera-outline"
              size={moderateScale(60)}
              color={COLORS.grey6}
            />
            <Typography
              title="Camera view placeholder"
              fontSize={15}
              color={COLORS.black2}
              style={styles.placeholderText}
            />
          </View>
          <Button style={styles.startButton} onPress={handleScan}>
            <Typography
              title="Scan"
              fontSize={18}
              color={COLORS.white}
              style={styles.buttonText}
            />
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ScanProduct;
