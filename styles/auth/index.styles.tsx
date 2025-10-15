import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 350,
    height: 350,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    width: 200,
  },
  loadingBar: {
    width: "100%",
    height: 6,
    backgroundColor: COLORS.primary20,
    borderRadius: 3,
    overflow: "hidden",
  },
  loadingProgress: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});


