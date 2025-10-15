import Typography from "@/components/ui/custom-typography";
import { COLORS } from "@/constants/colors";
import { howToFindYourSize, SizeMeasurement, sizeMeasurements } from "@/constants/data";
import { FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const SizeGuide = () => {
  const router = useRouter();

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
          title="Eyeglasses Size Guide"
          fontSize={scale(18)}
          fontFamily="Poppins-Bold"
          color={COLORS.black}
          style={styles.headerTitle}
        />
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentSection}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Typography
              title="Understanding Eyeglass Measurements"
              fontSize={scale(22)}
              fontFamily="Poppins-Bold"
              color={COLORS.black}
              style={styles.mainTitle}
            />
            <Typography
              title="Eyeglass sizes are typically represented by three numbers, such as 52-18-140. These numbers correspond to the lens width, bridge width, and temple length, all measured in millimeters."
              fontSize={scale(14)}
              color={COLORS.grey29}
              fontFamily="Roboto-Regular"
              style={styles.description}
            />
          </View>

          {/* Image Section */}
          <View style={styles.imageSection}>
            <Image
              source={require("@/assets/images/classic.jpg")}
              style={styles.glassesImage}
              contentFit="contain"
            />
          </View>

          {/* Measurements List */}
          <View style={styles.measurementsList}>
            {sizeMeasurements.map((measurement: SizeMeasurement) => (
              <View key={measurement.id} style={styles.measurementCard}>
                <View style={styles.iconContainer}>
                  {measurement.iconLibrary === "fontawesome6" ? (
                    <FontAwesome6
                      name={measurement.iconName as any}
                      size={20}
                      color={COLORS.primary}
                    />
                  ) : measurement.iconLibrary === "fontawesome5" ? (
                    <FontAwesome5
                      name={measurement.iconName as any}
                      size={20}
                      color={COLORS.primary}
                    />
                  ) : measurement.iconLibrary === "simplelineicons" ? (
                    <SimpleLineIcons
                      name={measurement.iconName as any}
                      size={20}
                      color={COLORS.primary}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={measurement.iconName as any}
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </View>
                <View style={styles.measurementContent}>
                  <Typography
                    title={measurement.label}
                    fontSize={scale(15)}
                    fontFamily="Poppins-Bold"
                    color={COLORS.black}
                    style={styles.measurementLabel}
                  />
                  <Typography
                    title={measurement.description}
                    fontSize={scale(13)}
                    color={COLORS.grey29}
                    fontFamily="Roboto-Regular"
                    style={styles.measurementDescription}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* How to Find Your Size Section */}
          <View style={styles.howToFindSection}>
            <Typography
              title={howToFindYourSize.title}
              fontSize={scale(18)}
              fontFamily="Poppins-Bold"
              color={COLORS.black}
              style={styles.howToFindTitle}
            />
            <Typography
              title={howToFindYourSize.description}
              fontSize={scale(13)}
              color={COLORS.grey29}
              fontFamily="Roboto-Regular"
              style={styles.howToFindDescription}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SizeGuide;

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
    backgroundColor: COLORS.white,
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
  scrollContent: {
    paddingBottom: verticalScale(40),
    backgroundColor: COLORS.white,
  },
  contentSection: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
  },
  titleSection: {
    marginBottom: verticalScale(24),
  },
  mainTitle: {
    marginBottom: verticalScale(12),
    lineHeight: scale(30),
    fontWeight: "600",
  },
  description: {
    lineHeight: scale(20),
  },
  imageSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(22),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  glassesImage: {
    width: scale(250),
    height: scale(180),
  },
  measurementsList: {
    gap: scale(16),
  },
  measurementCard: {
    flexDirection: "row",
    padding: scale(4),
    gap: scale(12),
    alignItems: "flex-start",
  },
  iconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: COLORS.lightSkyBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  measurementContent: {
    flex: 1,
    gap: verticalScale(4),
  },
  measurementLabel: {
    fontWeight: "600",
    lineHeight: scale(20),
  },
  measurementDescription: {
    lineHeight: scale(20),
  },
  howToFindSection: {
    marginTop: verticalScale(32),
    gap: verticalScale(12),
  },
  howToFindTitle: {
    fontWeight: "600",
    lineHeight: scale(24),
  },
  howToFindDescription: {
    lineHeight: scale(20),
  },
});

