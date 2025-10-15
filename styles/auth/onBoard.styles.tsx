import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  logo: {
    width: scale(80),
    height: verticalScale(50),
    alignSelf: "center",
    marginTop: verticalScale(16),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(16),
  },
  header: {
    paddingHorizontal: scale(18),
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  greeting: {
    marginBottom: verticalScale(4),
    marginRight: scale(4),
  },
  mainTitle: {
    marginBottom: verticalScale(8),
  },
  categoriesSection: {
    paddingHorizontal: scale(22),
    marginTop: verticalScale(8),
  },
  buttonContainer: {
    paddingHorizontal: scale(18),
    marginTop: verticalScale(24),
    width: "98%",
    alignSelf: "center",
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    height: verticalScale(12),
  },
});


