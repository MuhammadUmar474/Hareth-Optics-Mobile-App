import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderWidth: 0.3,
    borderColor: COLORS.gray,
    marginHorizontal: SIZES.caption,
    borderRadius: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingHorizontal: 8,
    marginTop: 15,
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
