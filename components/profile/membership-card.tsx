import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLangStore } from "@/store/langStore";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Button from "../ui/custom-button";
import Typography from "../ui/custom-typography";

const MembershipCard = () => {
  const lang = useLangStore(state => state.language);
  const rtl = lang === 'ar';
  const { t } = useTranslation(); 
  return (
    <View style={[styles.container,{flexDirection: rtl ? "row-reverse" : "row"}]}>
      <View>
        <Typography
          title={t("profile.menu.Hareth Gold Membership")}
          fontSize={SIZES.desc}
          style={{
            fontWeight: "bold",
            marginBottom: 5,
          }}
        />
        <Typography
          title={t("profile.menu.Validity show here when logged in")}
          fontSize={SIZES.caption}
          color={COLORS.grey6}
        />
      </View>
      <Button
        bordered
        style={styles.button}
       
      >
        <Typography
          title={t("profile.menu.join")}
          fontSize={SIZES.caption}
          color={COLORS.black}
        />
      </Button>
    </View>
  );
};

export default MembershipCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.3,
    borderColor: COLORS.gray,
    marginHorizontal: SIZES.caption,
    borderRadius: SIZES.base,
    padding: SIZES.base,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    minHeight: 25,
  },
});
