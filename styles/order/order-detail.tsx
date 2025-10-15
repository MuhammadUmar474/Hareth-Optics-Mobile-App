import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white2,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    paddingTop: 30,
  },
  section: {
    marginBottom: 24,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
  },
  statusItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  statusIndicatorContainer: {
    alignItems: "center",
    marginRight: 12,
  },
  statusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white4,
    borderWidth: 2,
    borderColor: COLORS.grey22,
    alignItems: "center",
    justifyContent: "center",
  },
  statusCircleCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.grey22,
    marginVertical: 2,
    minHeight: 30,
  },
  statusLineCompleted: {
    backgroundColor: COLORS.primary,
  },
  statusContent: {
    flex: 1,
    paddingTop: 2,
  },
  statusTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
  orderId: {
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.black,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  productImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  productName: {
    fontWeight: "600",
    marginBottom: 4,
    color: COLORS.black,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey22,
  },
  totalText: {
    fontWeight: "700",
    color: COLORS.black,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 8,
    color: COLORS.black,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    borderRadius: 10,
    height: 45,
    marginBottom: 12,
  },
  buttonSecondary: {
    borderRadius: 10,
    height: 45,
    marginBottom: 12,
    backgroundColor: COLORS.primary10,
  },
});
