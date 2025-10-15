import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    padding: moderateScale(20),
    marginBottom: verticalScale(100),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    marginBottom: moderateScale(16),
    borderWidth: 0.5,
    borderColor: COLORS.grayBorder,
  },
  cardTitle: {
    fontWeight: "500",
    marginBottom: moderateScale(6),
  },
  cardSubtitle: {
    marginBottom: moderateScale(16),
    lineHeight: moderateScale(18),
  },
  buttonRow: {
    flexDirection: "row",
    gap: moderateScale(12),
  },
  secondaryButton: {
    minHeight: moderateScale(40),
    borderRadius: moderateScale(12),
    borderColor: COLORS.gray,
    paddingHorizontal: moderateScale(12),
  },
  primaryButton: {
    minHeight: moderateScale(40),
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
  },
  cameraButton: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(12),
  },
  buttonText: {
    fontWeight: "600",
  },
  optionButton: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    marginBottom: moderateScale(10),
    borderWidth: 0.5,
    borderColor: COLORS.grayBorder,
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: moderateScale(16),
    alignItems: "center",
  },
  selectedImage: {
    width: "100%",
    height: moderateScale(200),
    borderRadius: moderateScale(12),
    resizeMode: "cover",
  },
  removeImageButton: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    marginTop: moderateScale(8),
    alignSelf: "flex-end",
  },
});
