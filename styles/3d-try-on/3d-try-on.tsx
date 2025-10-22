import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    padding: moderateScale(20),
  },
  placeholderContainer: {
    flex: 1,
  },
  placeholder: {
    backgroundColor: COLORS.gray18 || "#f5f5f5",
    borderRadius: moderateScale(16),
    padding: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
    minHeight: moderateScale(300),
  },
  placeholderText: {
    marginTop: moderateScale(12),
    textAlign: "center",
  },
  startButton: {
    marginTop: moderateScale(25),
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(16),
  },
  buttonText: {
    fontWeight: "600",
  },
  viewerContainer: {
    height: "90%",
    position: "relative",
  },
  viewer3D: {
    flex: 1,
    borderRadius: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.gray || "#e0e0e0",
  },
  integrationNote: {
    marginTop: moderateScale(16),
    padding: moderateScale(12),
  },
  noteText: {
    lineHeight: moderateScale(18),
  },
});
